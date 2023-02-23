import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

export const openai = new OpenAIApi(configuration);
console.log(configuration);

const initPrompt = `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.

Human: Hello, who are you?
AI: I am an AI created by OpenAI. How can I help you today?
Human: 你好
AI: 你好👋
`;

export const chat = (msg: string, user?: string) => {
  const prompt = initPrompt + msg + '\nAI: ';
  console.log('createCompletion:', prompt)
  return openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 0.9,
    max_tokens: 1500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6,
    stop: [" Human:", " AI:"],
    user
  })
}
