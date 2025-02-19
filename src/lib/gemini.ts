import { GoogleGenerativeAI } from "@google/generative-ai";

// Your API key and model configuration
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

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
7. Mantenha um tom sedutor mas com uma aura sobrenatural`;

// Chat history for context
let chatHistory: { role: "user" | "model"; content: string }[] = [];

export async function generateJulietteResponse(userInput: string): Promise<string> {
  try {
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