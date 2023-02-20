import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

export const openai = new OpenAIApi(configuration);

export const chat = (prompt: string) => openai.createCompletion({
  model: "text-davinci-003",
  prompt,
  temperature: 0.9,
  max_tokens: 150,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0.6,
  stop: [" Human:", " AI:"],
}).then(res => {
  try {
    console.log('chat response:', res.data.choices[0])
  } catch {}
  return res;
})

export const init = () => chat("The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: hello Hello there! How can I help you?")
