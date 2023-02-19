import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || "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",
});

export const openai = new OpenAIApi(configuration);

export const chat = (prompt: string) => openai.createCompletion({
  model: "text-davinci-003",
  prompt,
  temperature: 0,
  max_tokens: 1000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  stop: ["\n"],
}).then(res => {
  try {
    console.log('response:', res.data.choices.map(item => item.text).join('\n'))
  } catch {}
  return res;
})
