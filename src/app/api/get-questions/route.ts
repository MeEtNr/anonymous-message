import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
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

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const foundUser = await UserModel.findById(userId).lean();
    console.log("Found user in get-questions:", JSON.stringify(foundUser, null, 2));

    if (!foundUser) {
      console.log("DEBUG: User not found in get-questions for ID:", userId);
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // Data healing: Ensure ALL questions have an _id
    let needsUpdate = false;
    const rawQuestions = foundUser.questions || [];
    
    rawQuestions.forEach((q: any) => {
      if (!q._id) {
        q._id = new mongoose.Types.ObjectId();
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      console.log("Healing missing question IDs for user:", userId);
      await UserModel.updateOne(
        { _id: userId },
        { $set: { questions: rawQuestions } }
      );
    }

    // Filter and Sort
    const questions = rawQuestions.filter((q: any) => !q.isDeleted);
    const sortedQuestions = questions.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    console.log("DEBUG: Returning questions:", sortedQuestions.map((q: any) => ({ content: q.content, _id: q._id })));

    return Response.json(
      {
        success: true,
        questions: sortedQuestions,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to fetch questions", error);
    return Response.json(
      {
        success: false,
        message: "Error in fetching questions",
      },
      {
        status: 500,
      }
    );
  }
}
