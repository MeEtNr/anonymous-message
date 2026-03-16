import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ questionId: string }> }
) {
  await dbConnect();

  try {
    const { questionId } = await params;
    console.log("Fetching question with ID from NEW route:", questionId);

    const user = await UserModel.findOne(
      {
        $or: [
          { "questions._id": questionId },
          { "questions._id": new mongoose.Types.ObjectId(questionId) },
        ],
      },
      { "questions.$": 1, username: 1 }
    ).lean();

    console.log("User found in NEW route:", JSON.stringify(user, null, 2));

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

    const question = (user.questions as any)[0];

    if (question.isDeleted) {
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

    return Response.json(
      {
        success: true,
        question: {
          _id: question._id,
          content: question.content,
          createdAt: question.createdAt,
          username: (user as any).username,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to get question in NEW route", error);
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
