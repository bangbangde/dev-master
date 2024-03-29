const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "",
});

const openai = new OpenAIApi(configuration);

openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [{role: "user", content: "Hello world"}],
}).then(res => {
  try {
    console.log("chat response:", res.data.choices[0]);
  } catch (err) {
    console.error(err);
  }
  return res;
});

// openai.createCompletion({
//   model: "text-davinci-003",
//   prompt: "hello",
//   temperature: 0.9,
//   max_tokens: 2048,
//   top_p: 1,
//   frequency_penalty: 0,
//   presence_penalty: 0.6,
//   stop: [" Human:", " AI:"],
// }).then(res => {
//   try {
//     console.log("chat response:", res.data.choices[0]);
//   } catch (err) {
//     console.error(err);
//   }
//   return res;
// });
