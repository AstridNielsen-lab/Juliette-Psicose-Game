import React, { useState, useRef, useEffect } from 'react';
import { Send, Skull, MessageSquare, Info, X, Volume2, VolumeX } from 'lucide-react';
import { generateJulietteResponse } from './lib/gemini';

interface Message {
  text: string;
  sender: 'user' | 'juliette';
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Olá... Quem está aí? Je suis perdue... Sinto como se nunca tivesse nascido verdadeiramente. Você pode me ajudar a lembrar quem sou?",
      sender: 'juliette'
    }
  ]);
  const [input, setInput] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const synth = window.speechSynthesis;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speakMessage = (text: string) => {
    if (!voiceEnabled) return;

    // Cancel any ongoing speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get all available voices
    const voices = synth.getVoices();
    
    // Try to find a French female voice
    const frenchVoice = voices.find(voice => 
      voice.lang.includes('fr') && voice.name.toLowerCase().includes('female')
    ) || voices.find(voice => 
      voice.lang.includes('fr')
    ) || voices[0];

    utterance.voice = frenchVoice;
    utterance.pitch = 1.1; // Slightly higher pitch for a more feminine voice
    utterance.rate = 0.9; // Slightly slower for a more seductive tone
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
      // Generate response using Gemini
      const response = await generateJulietteResponse(input);
      
      // Add Juliette's response
      setMessages(prev => [...prev, {
        text: response,
        sender: 'juliette'
      }]);

      // Speak the response
      speakMessage(response);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, {
        text: "Je suis désolée... As sombras estão turvando minha mente. Pode me ajudar a lembrar quem sou?",
        sender: 'juliette'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
    }
    setVoiceEnabled(!voiceEnabled);
  };

  // Load voices when the component mounts
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup
    return () => {
      synth.cancel();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/50 p-4 shadow-lg backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skull className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
              Juliette Psicose
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleVoice}
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
              title={voiceEnabled ? "Desativar voz" : "Ativar voz"}
            >
              {voiceEnabled ? (
                <Volume2 className={`w-5 h-5 ${isSpeaking ? 'text-red-400' : ''}`} />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setShowInstructions(true)}
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <Info className="w-5 h-5" />
              <span className="text-sm">Como Jogar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/90 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative border border-red-900/50">
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-red-400 mb-6">Bem-vindo a Juliette Psicose</h2>
            </div>
            
            <div className="px-6 overflow-y-auto flex-1">
              <div className="space-y-6 text-gray-300">
                <section>
                  <h3 className="text-xl font-semibold text-white mb-2">Sobre o Jogo</h3>
                  <p>
                    Juliette Psicose é um RPG psicológico de terror que transcende dimensões. 
                    Nesta experiência única, você interage com Juliette, uma entidade etérea 
                    presa entre mundos. Como uma alma que nunca nasceu verdadeiramente, ela 
                    busca sua ajuda para recuperar memórias fragmentadas e descobrir sua 
                    verdadeira natureza como a Noiva da Morte.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-2">Mecânica do Jogo</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Progressão em 10 níveis distintos</li>
                    <li>Cada nível é desbloqueado por palavras-chave específicas</li>
                    <li>As memórias são reveladas sequencialmente</li>
                    <li>Juliette fornece pistas sutis sobre a próxima palavra-chave</li>
                    <li>A história se torna mais clara a cada memória recuperada</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-2">Como Jogar</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Converse com Juliette através do chat</li>
                    <li>Preste atenção às pistas em suas respostas</li>
                    <li>Descubra as palavras-chave para progredir na história</li>
                    <li>Ajude-a a recuperar suas memórias perdidas</li>
                    <li>Explore os mistérios de sua existência sobrenatural</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-2">Elementos do RPG</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Narrativa não-linear baseada em diálogo</li>
                    <li>Progressão através de descobertas</li>
                    <li>Sistema de memórias desbloqueáveis</li>
                    <li>Múltiplas camadas de mistério</li>
                    <li>Final revelador quando todas as memórias são recuperadas</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-2">Dicas</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Observe o uso de palavras em francês nas respostas</li>
                    <li>Preste atenção a referências sobre casamento e morte</li>
                    <li>Explore temas relacionados a rituais e o sobrenatural</li>
                    <li>Seja paciente e atento às mudanças sutis nas respostas</li>
                    <li>Mantenha um registro das palavras-chave descobertas</li>
                  </ul>
                </section>
              </div>
            </div>

            <div className="p-6 border-t border-red-900/30">
              <button
                onClick={() => setShowInstructions(false)}
                className="w-full bg-red-900 hover:bg-red-800 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Começar a Jornada
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4">
        {/* Chat Container */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg shadow-xl p-4 mb-4 h-[calc(100vh-240px)] overflow-y-auto border border-red-900/30">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-red-900/50 text-white border border-red-800/50'
                      : 'bg-gray-800/50 text-gray-100 border border-purple-900/30'
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
            disabled={isLoading}
            className="flex-1 bg-gray-900/50 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 border border-red-900/30"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-red-900 hover:bg-red-800 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:hover:bg-red-900 border border-red-800"
          >
            <Send className="w-4 h-4" />
            <span>{isLoading ? 'Enviando...' : 'Enviar'}</span>
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm p-4">
        <p>A Noiva da Morte - Uma Experiência Sobrenatural</p>
        <p className="mt-1">
          Desenvolvido por{' '}
          <a
            href="https://wa.me/11970603441"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            Julio Campos Machado
          </a>
          {' '}da{' '}
          <span className="text-red-400">Like Look Solutions</span>
        </p>
      </footer>
    </div>
  );
}

export default App;