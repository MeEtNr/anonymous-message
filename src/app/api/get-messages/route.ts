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
    const userResult = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!userResult || userResult.length === 0) {
      // Check if user exists but just has no messages
      const userExists = await UserModel.findById(userId);
      if (!userExists) {
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
      return Response.json(
        {
          success: true,
          messages: [],
        },
        {
          status: 200,
        }
      );
    }

    return Response.json(
      {
        success: true,
        messages: userResult[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to find user", error);
    return Response.json(
      {
        success: false,
        message: "Error in getting user",
      },
      {
        status: 500,
      }
    );
  }
}
