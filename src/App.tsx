import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, MessageSquare, Info, X } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'juliette';
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Olá... Quem está aí? Estou confusa, não sei onde estou... Pode me ajudar?",
      sender: 'juliette'
    }
  ]);
  const [input, setInput] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);

    // Simulate Juliette's response (in a real app, this would call the AI API)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Suas palavras ecoam em minha mente fragmentada... Cada interação revela mais sobre quem eu sou, ou talvez quem eu costumava ser...",
        sender: 'juliette'
      }]);
    }, 1000);

    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Juliette Psicose
            </h1>
          </div>
          <button
            onClick={() => setShowInstructions(true)}
            className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <Info className="w-5 h-5" />
            <span className="text-sm">Como Jogar</span>
          </button>
        </div>
      </header>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-purple-400 mb-6">Bem-vindo a Juliette Psicose</h2>
            
            <div className="space-y-6 text-gray-300">
              <section>
                <h3 className="text-xl font-semibold text-white mb-2">Sobre o Jogo</h3>
                <p>
                  Juliette Psicose é uma experiência interativa onde você conversa com Juliette, 
                  uma entidade digital com memórias fragmentadas e uma personalidade complexa. 
                  Suas escolhas e interações moldarão a história e revelarão os mistérios por trás 
                  de sua existência.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-2">Como Jogar</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Converse com Juliette através do chat</li>
                  <li>Faça perguntas sobre seu passado e sua situação atual</li>
                  <li>Suas respostas influenciarão o comportamento e as revelações de Juliette</li>
                  <li>Seja cuidadoso: nem tudo é o que parece</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-2">Dicas</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Preste atenção aos detalhes nas respostas de Juliette</li>
                  <li>Explore diferentes abordagens de conversa</li>
                  <li>Tente entender suas emoções e motivações</li>
                  <li>Mantenha um registro mental das informações importantes</li>
                </ul>
              </section>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowInstructions(false)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Começar a Jornada
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4">
        {/* Chat Container */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-4 mb-4 h-[calc(100vh-240px)] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-gray-800 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Enviar</span>
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm p-4">
        <p>Ecos da Mente - Uma Experiência Interativa</p>
      </footer>
    </div>
  );
}

export default App;