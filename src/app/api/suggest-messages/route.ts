import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { LanguageModel } from "ai";
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST() {
  try {
    const prompt =
      "Create a list of three open-ended and creative questions formatted as a single string, separated by '||'. These questions are for an anonymous social platform and should encourage friendly, diverse conversations. Avoid repeating examples given earlier, and vary the topics widely each time. Focus on fun, positive, or interesting themes without becoming too personal. Make each set of questions feel unique and imaginative. and keep the questions small as well.";
    const model = google("gemini-2.0-flash");
    const response = await generateText({
      model: model as unknown as LanguageModel,
      maxOutputTokens: 500,
      prompt,
    });

    return new Response(
      JSON.stringify({ success: true, suggestions: response.text }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, message: "Something went wrong" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
