import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useFormPersist(
  key: string,
  watch: any,
  setValue: any,
  exclude: string[] = []
) {
  const { toast } = useToast();

  // Load saved data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved);
        Object.entries(data).forEach(([field, value]) => {
          if (!exclude.includes(field)) {
            setValue(field, value);
          }
        });
        
        toast({
          title: "Form data restored",
          description: "Your previous progress has been restored.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
  }, [key, setValue, exclude, toast]);

  // Save data on changes
  useEffect(() => {
    const subscription = watch((data: any) => {
      try {
        const filteredData = { ...data };
        exclude.forEach(field => delete filteredData[field]);
        localStorage.setItem(key, JSON.stringify(filteredData));
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    });

    return () => subscription.unsubscribe();
  }, [key, watch, exclude]);

  // Function to clear saved data
  const clearSaved = () => {
    localStorage.removeItem(key);
  };

  return { clearSaved };
}
