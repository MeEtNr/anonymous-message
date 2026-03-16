import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";
import mongoose from "mongoose";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { questionId, content } = await req.json();

    if (!questionId || !content) {
      return Response.json(
        {
          success: false,
          message: "Question ID and content are required",
        },
        {
          status: 400,
        }
      );
    }

    const qId = mongoose.Types.ObjectId.isValid(questionId)
      ? new mongoose.Types.ObjectId(questionId)
      : questionId;

    const result = await UserModel.collection.findOneAndUpdate(
      {
        $or: [
          { "questions._id": questionId, "questions.isDeleted": { $ne: true } },
          { "questions._id": qId, "questions.isDeleted": { $ne: true } },
        ],
      },
      {
        $push: {
          "questions.$[elem].messages": {
            content,
            createdAt: new Date(),
          },
        } as any,
      },
      {
        arrayFilters: [
          {
            "elem._id": { $in: [questionId, qId] },
            "elem.isDeleted": { $ne: true }
          },
        ],
        returnDocument: "after",
      }
    );

    if (!result) {
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
        message: "Message sent successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error adding message to question", error);
    return Response.json(
      {
        success: false,
        message: "Error in sending message",
      },
      {
        status: 500,
      }
    );
  }
}
