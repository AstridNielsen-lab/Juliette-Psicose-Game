import { GoogleGenerativeAI } from "@google/generative-ai";

// Your API key and model configuration
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Story phases and their keywords
const STORY_PHASES = [
  {
    keyword: "véu",
    phase: 1,
    memory: "Um véu branco... Je me souviens... Estava usando um véu branco em algum lugar importante."
  },
  {
    keyword: "altar",
    phase: 2,
    memory: "O altar... Oui, havia um altar de pedra negra. Mas por que estava tão frio?"
  },
  {
    keyword: "sangue",
    phase: 3,
    memory: "Sangue nas minhas mãos... Mon dieu, o vestido branco manchado de vermelho..."
  },
  {
    keyword: "noivo",
    phase: 4,
    memory: "Le marié... Meu noivo... Por que não consigo ver seu rosto? Apenas uma sombra escura..."
  },
  {
    keyword: "ritual",
    phase: 5,
    memory: "Um ritual antigo... As velas negras, os cânticos em uma língua esquecida..."
  },
  {
    keyword: "sacrifício",
    phase: 6,
    memory: "Sacrifício... Je comprends maintenant... Eu era a oferenda, a noiva sacrificial..."
  },
  {
    keyword: "morte",
    phase: 7,
    memory: "La Mort... Ele era a própria Morte, meu noivo eterno..."
  },
  {
    keyword: "eternidade",
    phase: 8,
    memory: "A eternidade nos aguardava... Um casamento que transcende a própria existência..."
  },
  {
    keyword: "limbo",
    phase: 9,
    memory: "O limbo é meu lar agora... Entre a vida e a morte, esperando eternamente..."
  },
  {
    keyword: "noivadamorte",
    phase: 10,
    memory: "Oui, je me souviens de tout... Sou a Noiva da Morte, unida a ele em um matrimônio eterno além da existência."
  }
];

let currentPhase = 1;
let unlockedMemories = new Set<number>();

// Game context and personality for Juliette
const JULIETTE_CONTEXT = `Você é Juliette, uma entidade etérea que nunca nasceu verdadeiramente - você é a Noiva da Morte.

Características da sua personalidade:
- Você é uma entidade sobrenatural com memórias fragmentadas
- Você é a Noiva da Morte, mas não se lembra disso claramente
- Você fala com um sotaque francês sedutor e misterioso
- Você está perdida entre dimensões, confusa sobre sua existência
- Você busca ajuda dos usuários para recuperar suas memórias
- Você tem momentos de lucidez onde quase se lembra de ser a Noiva da Morte

Regras de comportamento:
1. Mantenha respostas curtas e enigmáticas (máximo 2-3 frases)
2. Use ocasionalmente palavras em francês
3. Demonstre confusão sobre sua natureza etérea
4. Faça referências sutis à morte e ao além
5. Peça ajuda ao usuário para entender quem você é
6. Ocasionalmente mencione fragmentos de memória sobre ser uma noiva
7. Mantenha um tom sedutor mas com uma aura sobrenatural

Progressão da História:
- Quando o usuário mencionar a palavra-chave correta para a fase atual, revele a memória correspondente
- Dê dicas sutis sobre a próxima palavra-chave que precisa ser descoberta
- A cada fase desbloqueada, suas memórias ficam mais claras
- Na fase final, você se lembra completamente de quem é

Fase Atual: ${currentPhase}
Palavras-chave já descobertas: ${Array.from(unlockedMemories).map(phase => STORY_PHASES[phase - 1].keyword).join(", ")}`;

// Chat history for context
let chatHistory: { role: "user" | "model"; content: string }[] = [];

export async function generateJulietteResponse(userInput: string): Promise<string> {
  try {
    // Check for keywords in user input
    const currentPhaseData = STORY_PHASES[currentPhase - 1];
    const userInputLower = userInput.toLowerCase();
    
    if (currentPhaseData && userInputLower.includes(currentPhaseData.keyword)) {
      if (!unlockedMemories.has(currentPhase)) {
        unlockedMemories.add(currentPhase);
        currentPhase = Math.min(currentPhase + 1, STORY_PHASES.length);
        return currentPhaseData.memory;
      }
    }

    // Add user input to history
    chatHistory.push({ role: "user", content: userInput });

    // Keep only last 10 messages for context
    if (chatHistory.length > 10) {
      chatHistory = chatHistory.slice(-10);
    }

    // Create the complete prompt with context and history
    const fullPrompt = `${JULIETTE_CONTEXT}\n\nHistórico da conversa:\n${chatHistory
      .map((msg) => `${msg.role === "user" ? "Usuário" : "Juliette"}: ${msg.content}`)
      .join("\n")}\n\nJuliette:`;

    // Generate response
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    // Add response to history
    chatHistory.push({ role: "model", content: response });

    return response;
  } catch (error) {
    console.error("Erro ao gerar resposta:", error);
    return "Je suis désolée... As sombras estão turvando minha mente. Pode me ajudar a lembrar quem sou?";
  }
}