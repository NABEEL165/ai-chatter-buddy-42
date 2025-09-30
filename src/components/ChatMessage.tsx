import { Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div 
      className={`flex gap-3 mb-4 animate-slide-up ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <Avatar className={`h-8 w-8 ${isUser ? "bg-primary" : "bg-secondary"}`}>
        <AvatarFallback>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div 
        className={`
          max-w-[70%] rounded-2xl px-4 py-3 
          ${isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-card text-card-foreground border border-border"
          }
        `}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
