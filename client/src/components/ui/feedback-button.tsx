import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { FeedbackModal } from "./feedback-modal";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Feedback
      </Button>
      <FeedbackModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}