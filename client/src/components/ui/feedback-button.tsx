
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { FeedbackModal } from "@/components/ui/feedback-modal";

export function FeedbackButton() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        size="icon"
        aria-label="Send feedback"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      
      <FeedbackModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
