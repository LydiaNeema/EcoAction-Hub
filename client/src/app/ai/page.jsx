"use client";
import { useState, useEffect } from "react";
import { aiService } from "@/services/aiService";

export default function Page() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! 👋 I'm your EcoAction AI assistant. I can help you with questions about climate action, reporting issues, community events, emergency alerts, and how to use our platform. What would you like to know?",
      source: "system"
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usingOpenAI, setUsingOpenAI] = useState(false);
  
  // Check if OpenAI is being used on component mount
  useEffect(() => {
    const checkOpenAIStatus = async () => {
      try {
        const response = await fetch('/api/ai/status');
        const data = await response.json();
        setUsingOpenAI(data?.usingOpenAI || false);
      } catch (err) {
        console.log('Could not verify OpenAI status');
      }
    };
    
    checkOpenAIStatus();
  }, []);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const { reply, source } = await aiService.chat(userMsg.content);
      const botMsg = { role: "assistant", content: reply, source: source };
      setMessages((m) => [...m, botMsg]);
      setUsingOpenAI(source === "OpenAI");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F1FFF6] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-800">EcoAction AI Assistant</h1>
            <div className="flex items-center gap-2">
              <span className={`inline-flex h-2 w-2 rounded-full ${usingOpenAI ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              <span className="text-xs font-medium text-gray-500">{usingOpenAI ? 'Powered by OpenAI' : 'Using rule-based responses'}</span>
            </div>
          </div>
          <div className="space-y-4 mb-4">
            {messages.map((m, idx) => (
              <div key={idx} className={m.role === 'assistant' ? "bg-gray-50 rounded-2xl p-4 text-gray-800" : "text-right"}>
                {m.role === 'user' ? (
                  <div className="inline-block bg-[#E8F5ED] text-gray-900 px-4 py-3 rounded-2xl">{m.content}</div>
                ) : (
                  <div>
                    <div>{m.content}</div>
                    {m.source && m.source !== 'system' && (
                      <div className="mt-1 flex items-center gap-1">
                        <span className={`inline-flex h-1.5 w-1.5 rounded-full ${m.source === 'OpenAI' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        <span className="text-[10px] text-gray-500">{m.source}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
          </div>

          <form onSubmit={sendMessage} className="flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask or type anything"
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#16A34A] text-white px-5 py-3 font-medium hover:bg-[#15803D] disabled:opacity-60"
              aria-label="Send"
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
