import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import { questionSchema } from "@/schemas/questionSchema";
import mongoose from "mongoose";

export async function POST(request: Request) {
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
    const { content } = await request.json();

    // Validate with zod
    const result = questionSchema.safeParse({ content });
    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: result.error.format().content?._errors || "Invalid content",
        },
        {
          status: 400,
        }
      );
    }

    console.log("Creating question with content:", content, "for user:", user._id);

    const newQuestion = {
      _id: new mongoose.Types.ObjectId(),
      content,
      createdAt: new Date(),
      messages: [],
      isAcceptingMessages: true,
    };

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: user._id },
      {
        $push: {
          questions: newQuestion,
        },
      },
      { new: true, strict: false }
    ).lean();

    console.log("Updated user result:", JSON.stringify(updatedUser, null, 2));

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found or failed to update",
        },
        {
          status: 404,
        }
      );
    }

    const questions = (updatedUser as any).questions || [];
    const createdQuestion = questions[questions.length - 1];

    console.log("Created question:", createdQuestion);

    return Response.json(
      {
        success: true,
        message: "Thread created successfully",
        question: createdQuestion,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Failed to create question", error);
    return Response.json(
      {
        success: false,
        message: "Error in creating thread",
      },
      {
        status: 500,
      }
    );
  }
}
