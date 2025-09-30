import { useState, useRef, useEffect } from "react";
import { Bot, Sparkles } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import { streamChat } from "@/utils/chatStream";
import { useToast } from "@/hooks/use-toast";

type Message = { role: "user" | "assistant"; content: string };

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (input: string) => {
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = "";
    const upsertAssistant = (nextChunk: string) => {
      assistantContent += nextChunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => setIsLoading(false),
        onError: (error) => {
          console.error("Chat error:", error);
          setIsLoading(false);
          toast({
            title: "Error",
            description: error.message || "Failed to get response. Please try again.",
            variant: "destructive",
          });
          setMessages((prev) => prev.slice(0, -1));
        },
      });
    } catch (error) {
      console.error("Send error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              NexusAI
              <Sparkles className="h-5 w-5 text-primary" />
            </h1>
            <p className="text-xs text-muted-foreground">Your intelligent assistant</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 animate-pulse-glow">
                <Bot className="h-10 w-10 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome to NexusAI
              </h2>
              <p className="text-muted-foreground max-w-md mb-8">
                I'm here to help! Ask me anything, and I'll provide clear, helpful responses.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                {[
                  "What can you help me with?",
                  "Explain quantum computing",
                  "Write a creative story",
                  "Help me learn something new"
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="px-4 py-3 bg-card border border-border rounded-xl hover:border-primary transition-all text-sm text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} role={msg.role} content={msg.content} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </main>

      {/* Input */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default Index;
