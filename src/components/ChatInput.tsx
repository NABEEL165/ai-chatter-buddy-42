import { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
        disabled={disabled}
        className="min-h-[60px] max-h-[200px] resize-none bg-card border-border focus:border-primary transition-colors"
        rows={2}
      />
      <Button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        size="icon"
        className="h-[60px] w-[60px] shrink-0 bg-primary hover:bg-primary/90 animate-pulse-glow"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatInput;
