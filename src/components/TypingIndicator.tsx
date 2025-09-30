import { Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 mb-4 animate-fade-in">
      <Avatar className="h-8 w-8 bg-secondary">
        <AvatarFallback>
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="bg-card border border-border rounded-2xl px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "0s" }} />
          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "0.2s" }} />
          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
