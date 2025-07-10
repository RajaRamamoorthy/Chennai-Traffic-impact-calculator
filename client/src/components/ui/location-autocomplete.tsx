import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";

interface LocationAutocompleteProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  locationType?: 'origin' | 'destination';
}

interface PlacePrediction {
  description: string;
  placeId: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

export function LocationAutocomplete({
  id,
  value,
  onChange,
  placeholder,
  className,
  locationType
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced query for autocomplete
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      // Increased minimum characters to 4 to reduce API calls
      if (inputValue.trim().length >= 4) {
        setDebouncedQuery(inputValue);
      } else {
        setDebouncedQuery("");
      }
    }, 500); // Increased debounce from 300ms to 500ms

    return () => clearTimeout(timer);
  }, [inputValue]);

  const { data: suggestions, isLoading } = useQuery<PlacePrediction[]>({
    queryKey: [`/api/places/autocomplete?input=${encodeURIComponent(debouncedQuery)}`],
    enabled: debouncedQuery.length > 0,
  });

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: PlacePrediction) => {
    setInputValue(suggestion.description);
    onChange(suggestion.description);
    setShowSuggestions(false);
    
    // Track analytics
    if (locationType) {
      analytics.trackLocationSelect(suggestion.description, locationType);
    }
    analytics.trackLocationAutocomplete(debouncedQuery, suggestions?.length || 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (inputValue.trim().length >= 4 && suggestions && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={cn("pl-9", className)}
          autoComplete="off"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
      
      {showSuggestions && suggestions && suggestions.length > 0 && (
        <Card 
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-full overflow-hidden shadow-lg"
        >
          <ul className="max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.placeId}
                className={cn(
                  "cursor-pointer px-4 py-3 hover:bg-accent transition-colors",
                  "border-b last:border-0",
                  selectedIndex === index && "bg-accent"
                )}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    {suggestion.structured_formatting ? (
                      <>
                        <div className="font-medium text-sm">
                          {suggestion.structured_formatting.main_text}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {suggestion.structured_formatting.secondary_text}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm">{suggestion.description}</div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}