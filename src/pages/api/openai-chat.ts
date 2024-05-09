import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { promptAdvice, promptBuffet, promptEntrepreneur } from "@/constants";

export const maxDuration = 300;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const defaultMessages: ChatCompletionRequestMessage[] = [
  {
    role: "system",
    content: promptBuffet,
  },
];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const incomingMessages = req.body.messages;

      const combinedMessages = [...defaultMessages, ...incomingMessages];

      const completion = await openai.createChatCompletion({
        model: "gpt-4-1106-preview",
        temperature: 0.7,
        messages: combinedMessages,
      });

      const responseMessage = completion.data.choices[0].message;
      const usageData = completion.data.usage || {};
      const totalTokens =
        "total_tokens" in usageData ? usageData.total_tokens : null;
      const promptTokens =
        "prompt_tokens" in usageData ? usageData.prompt_tokens : null;
      const completionTokens =
        "completion_tokens" in usageData ? usageData.completion_tokens : null;

      res.status(200).json({
        message: responseMessage,
        total_tokens: totalTokens,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
      });
    } catch (error) {
      console.error("Error in server code:", error);
      res
        .status(500)
        .json({ error: "An error occurred while processing your request." });
    }
  } else {
    res
      .status(405)
      .json({ error: "Method not allowed. Please send a POST request." });
  }
};

export default handler;
