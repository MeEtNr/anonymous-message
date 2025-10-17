import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST() {
  try {
    // Read any request data if needed (optional)

    // Custom prewritten prompt
    const prompt =
      "Create a list of three open-ended and creative questions formatted as a single string, separated by '||'. These questions are for an anonymous social platform and should encourage friendly, diverse conversations. Avoid repeating examples given earlier, and vary the topics widely each time. Focus on fun, positive, or interesting themes without becoming too personal. Make each set of questions feel unique and imaginative. and keep the questions small as well.";
    const result = await generateText({
      model: google("gemini-2.0-flash") as any,
      maxOutputTokens: 500,
      prompt,
    });

    console.log(result.text);

    return Response.json(
      {
        success: true,
        suggestions: result.text,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Suggestion error:", error);
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
