import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

console.log("GET QUESTION ROUTE LOADED");

export async function GET(
  request: Request,
  { params }: { params: { questionId: string } }
) {
  await dbConnect();

  try {
    const { questionId } = params;
    console.log("Fetching question with ID:", questionId);

    const user = await UserModel.findOne(
      { "questions._id": questionId },
      { "questions.$": 1, username: 1 }
    ).lean();

    console.log("User found for question:", JSON.stringify(user, null, 2));

    if (!user || !user.questions || user.questions.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Question not found",
        },
        {
          status: 404,
        }
      );
    }

    const question = user.questions[0];

    return Response.json(
      {
        success: true,
        question: {
          _id: question._id,
          content: question.content,
          createdAt: question.createdAt,
          username: user.username,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to get question", error);
    return Response.json(
      {
        success: false,
        message: "Error in getting question",
      },
      {
        status: 500,
      }
    );
  }
}
