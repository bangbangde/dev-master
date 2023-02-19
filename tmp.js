const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const response = openai.createCompletion({
  model: "text-davinci-003",
  prompt: "再说一遍你来自哪",
  temperature: 0,
  max_tokens: 1000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
});

response.then(res => {
  console.log(JSON.stringify(res.data.choices));
})
