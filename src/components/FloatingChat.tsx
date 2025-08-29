import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{
    id: string;
    text: string;
    isUser: boolean;
    timestamp: string;
  }>>([
    {
      id: "1",
      text: "👋 Hi! I'm your proposal assistant. I can help you with:\n\n• Writing better proposals\n• Understanding templates\n• Tips for winning jobs\n• Using the AI features\n\nWhat would you like to know?",
      isUser: false,
      timestamp: new Date().toISOString()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, userMessage]);

    // Simulate AI response (you can integrate real AI here)
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, aiMessage]);
    }, 1000);

    setMessage("");
  };

  const generateBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes("template") || msg.includes("templates")) {
      return "📝 Templates help you write proposals faster! We have 10 professional templates for different developer roles like UI/UX Designer, Backend Developer, AI Developer, etc.\n\nYou can find them in the Templates section. Copy the snippets and paste them into your proposals for professional content that wins jobs!";
    }
    
    if (msg.includes("ai") || msg.includes("generate")) {
      return "🤖 Our AI features help you:\n\n• Analyze job posts automatically\n• Generate professional proposals\n• Refine proposals with chat\n\nJust paste a job post and let our AI create a tailored proposal for you! Make sure you have your Google AI API key set up in the .env file.";
    }
    
    if (msg.includes("proposal") || msg.includes("write")) {
      return "✍️ For great proposals:\n\n• Start with job analysis (use our AI)\n• Use relevant templates\n• Customize for each client\n• Include clear milestones\n• Set competitive pricing\n• Share your portfolio\n\nOur app helps with all of these steps!";
    }
    
    if (msg.includes("help") || msg.includes("how")) {
      return "🚀 Here's how to use the app:\n\n1. **Analyze Jobs**: Paste job posts for AI analysis\n2. **Generate Proposals**: Let AI create tailored proposals\n3. **Use Templates**: Speed up with professional content\n4. **Share**: Send proposals to clients\n5. **Track**: Monitor your proposal status\n\nWhat specific feature would you like help with?";
    }
    
    if (msg.includes("share") || msg.includes("link")) {
      return "🔗 Sharing proposals is easy!\n\n• Click the 'Share' button on any proposal\n• Get a public link instantly\n• Status automatically changes to 'Shared'\n• Client can view without signing up\n\nGreat for sending professional proposals that stand out!";
    }
    
    return "💡 Thanks for your message! I can help you with:\n\n• Using templates effectively\n• AI proposal generation\n• Writing winning proposals\n• App features and tips\n\nCould you be more specific about what you'd like to know?";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <Card className="glass-card w-80 h-96 mb-4 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">💬 Chat Assistant</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-4 pt-0">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                      msg.isUser
                        ? 'bg-blue-500/80 text-white ml-4'
                        : 'bg-white/70 text-gray-800 border border-white/30 mr-4'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Input Area */}
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything about proposals..."
                className="glass-input resize-none min-h-[40px] max-h-[80px] text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="glass-primary h-10 w-10 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Floating Chat Icon */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`glass-primary h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-all duration-300 ${
          isOpen ? 'rotate-180' : ''
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default FloatingChat;
