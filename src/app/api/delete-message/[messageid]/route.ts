import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/models/User";
import mongoose from "mongoose";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ messageid: string }> }
) {
  const { messageid } = await params;
  const url = new URL(req.url);

  if (!messageid) {
    return Response.json(
      { success: false, message: "Message ID missing" },
      { status: 400 }
    );
  }

  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const questionId = url.searchParams.get("questionId");
    
    // Explicitly convert user._id to ObjectId for reliable matching
    const userId = new mongoose.Types.ObjectId((user as any)._id);
    
    // Convert IDs to ObjectId for MongoDB comparison if they are valid
    const messageObjectId = mongoose.Types.ObjectId.isValid(messageid) 
      ? new mongoose.Types.ObjectId(messageid) 
      : messageid;
      
    const questionObjectId = questionId && mongoose.Types.ObjectId.isValid(questionId)
      ? new mongoose.Types.ObjectId(questionId)
      : questionId;

    let updatedResult;
    if (questionId) {
      console.log(`DEBUG: Deleting message ${messageid} from question ${questionId} for user ${userId}`);
      updatedResult = await UserModel.updateOne(
        { _id: userId, "questions._id": questionObjectId },
        { $pull: { "questions.$.messages": { _id: messageObjectId } } }
      );
    } else {
      console.log(`DEBUG: Deleting general message ${messageid} for user ${userId}`);
      updatedResult = await UserModel.updateOne(
        { _id: userId },
        { $pull: { messages: { _id: messageObjectId } } }
      );
    }

    console.log("DEBUG: Delete result:", JSON.stringify(updatedResult));

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete the message", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to delete the message",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
