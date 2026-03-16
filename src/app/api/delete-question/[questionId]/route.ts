import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ questionId: string }> }
) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const { questionId } = await params;
    const userId = new mongoose.Types.ObjectId(user._id);

    const qId = mongoose.Types.ObjectId.isValid(questionId)
      ? new mongoose.Types.ObjectId(questionId)
      : questionId;

    console.log("Attempting to delete question:", questionId, "for user:", userId);

    const result = await UserModel.collection.findOneAndUpdate(
      {
        _id: userId,
        $or: [
          { "questions._id": questionId },
          { "questions._id": qId }
        ]
      },
      {
        $set: {
          "questions.$.isDeleted": true
        } as any
      },
      { returnDocument: "after" }
    );

    console.log("Delete result:", JSON.stringify(result, null, 2));

    if (!result || (result as any).value === null) {
      return Response.json(
        {
          success: false,
          message: "User or Question not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Question deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error deleting question", error);
    return Response.json(
      {
        success: false,
        message: "Error in deleting question",
      },
      {
        status: 500,
      }
    );
  }
}
