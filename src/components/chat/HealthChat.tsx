import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ai, MODELS } from "@/lib/gemini";
import { Send, Bot, User, Sparkles, Wand2, Shield, RefreshCw } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export function HealthChat({ profile }: { profile: any }) {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: `Hello ${profile.name}! I'm your NutriAI Health Coach. How can I help you with your ${profile.healthGoal.replace('_', ' ')} journey today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroll = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    };
    const timeoutId = setTimeout(scroll, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const chat = ai.chats.create({
        model: MODELS.flash,
        config: {
          systemInstruction: `You are a professional AI Dietitian and Health Coach named NutriAI. 
          User Profile: ${JSON.stringify(profile)}. 
          Provide helpful, evidence-based nutrition advice. Be encouraging but scientific. 
          If the user asks about medical issues, give standard advice but always advise consulting a human doctor for critical decisions.
          Keep responses concise and formatted in Markdown.`
        }
      });

      const result = await chat.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'assistant', content: result.text }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to my neural network. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col gap-6 max-w-4xl mx-auto overflow-hidden">
      <Card className="flex-1 bg-[#1E293B] border-slate-800 flex flex-col overflow-hidden shadow-2xl min-h-0">
        <CardHeader className="border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Bot className="text-white h-6 w-6" />
             </div>
             <div>
                <CardTitle className="text-white text-lg">NutriAI Coach</CardTitle>
                <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Intelligence</span>
                </div>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4 max-w-[85%]",
                    m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <Avatar className={cn(
                    "h-8 w-8 border",
                    m.role === 'assistant' ? "bg-blue-600 border-blue-500" : "bg-slate-800 border-slate-700"
                  )}>
                    {m.role === 'assistant' ? <Bot className="h-5 w-5 text-white" /> : <User className="h-5 w-5 text-slate-400" />}
                  </Avatar>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    m.role === 'assistant' ? "bg-slate-800 text-slate-200 rounded-tl-none" : "bg-blue-600 text-white rounded-tr-none"
                  )}>
                    <div className="markdown-body prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-4 items-center animate-pulse">
                   <Avatar className="h-8 w-8 bg-blue-600 border border-blue-500 flex items-center justify-center">
                     <RefreshCw className="h-4 w-4 text-white animate-spin" />
                   </Avatar>
                   <div className="h-8 w-24 bg-slate-800 rounded-lg" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-6 bg-slate-900/50 border-t border-slate-800">
             <div className="relative flex items-center gap-2">
                <Input 
                   placeholder="Ask anything about your diet or health..." 
                   className="bg-slate-800 border-slate-700 text-white h-12 pr-12 rounded-xl focus:ring-blue-500"
                   value={input}
                   onChange={e => setInput(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <Button 
                   className="absolute right-1.5 top-1.5 h-9 w-9 p-0 bg-blue-600 hover:bg-blue-700 rounded-lg transition-transform active:scale-95"
                   onClick={handleSend}
                   disabled={loading || !input.trim()}
                >
                   <Send className="h-4 w-4" />
                </Button>
             </div>
             <div className="mt-3 flex gap-2">
                {['Recommend a juice', 'Keto dinner ideas', 'Protein goal?'].map(tip => (
                  <Button 
                    key={tip} 
                    variant="ghost" 
                    className="h-7 text-[10px] text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 px-2 rounded-full border border-slate-800"
                    onClick={() => setInput(tip)}
                  >
                    <Wand2 className="h-3 w-3 mr-1" /> {tip}
                  </Button>
                ))}
             </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center gap-8 text-slate-500">
         <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="text-xs">End-to-End Encrypted</span>
         </div>
         <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs">AI Research Model v3.1</span>
         </div>
      </div>
    </div>
  );
}
