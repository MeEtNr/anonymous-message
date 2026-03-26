import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ questionId: string }> }
) {
  await dbConnect();

  try {
    let { questionId } = await params;
    questionId = decodeURIComponent(questionId).trim();
    console.log("DEBUG: Target questionId:", questionId);

    if (!questionId) {
      return Response.json({ success: false, message: "Question ID is missing" }, { status: 400 });
    }

    const isPossiblyValidId = mongoose.Types.ObjectId.isValid(questionId);
    const idAsObjectId = isPossiblyValidId ? new mongoose.Types.ObjectId(questionId) : null;

    console.log("DEBUG: Querying for ID formats:", { questionId, idAsObjectId });

    // Method 1: findOne with positional operator
    const user = await UserModel.findOne({
      "questions._id": idAsObjectId || questionId
    }, { "questions.$": 1, username: 1 }).lean();

    console.log("DEBUG: User found via findOne:", !!user);

    if (!user) {
      // Method 2: Fallback to aggregation if findOne fails
      console.log("DEBUG: findOne failed, trying aggregation...");
      const aggregationResult = await UserModel.aggregate([
        { $match: { "questions._id": idAsObjectId || questionId } },
        { $unwind: "$questions" },
        { $match: { "questions._id": idAsObjectId || questionId } },
        { $project: { question: "$questions", username: 1 } }
      ]);
      
      if (aggregationResult && aggregationResult.length > 0) {
        console.log("DEBUG: Found via aggregation fallback");
        const { question, username } = aggregationResult[0];
        return handleQuestionResponse(question, username);
      }

      // Method 3: Final desperate fallback - search for any user and check in memory
      console.log("DEBUG: Aggregation failed, trying manual search...");
      // This is a last resort to see if the ID exists at all
      const allUsers = await UserModel.find({ "questions": { $exists: true, $ne: [] } }, { questions: 1, username: 1 }).lean();
      for (const u of allUsers) {
        const q = u.questions.find((qi: any) => qi._id.toString() === questionId);
        if (q) {
          console.log("DEBUG: MANUALLY FOUND in user:", u.username);
          return handleQuestionResponse(q, u.username);
        }
      }

      console.log("DEBUG: All search methods failed for ID:", questionId);
      return Response.json({ 
        success: false, 
        message: "Question not found. Checked all search methods." 
      }, { status: 404 });
    }

    const question = (user.questions as any)[0];
    return handleQuestionResponse(question, (user as any).username);

  } catch (error) {
    console.log("CRITICAL: Failed to get question", error);
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

function handleQuestionResponse(question: any, username: string) {
  if (question.isDeleted) {
    console.log("DEBUG: Question is deleted:", question._id);
    return Response.json({ success: false, message: "This question has been deleted" }, { status: 404 });
  }

  return Response.json(
    {
      success: true,
      question: {
        _id: question._id,
        content: question.content,
        createdAt: question.createdAt,
        messages: (question.messages || [])
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((m: any) => ({
             ...m,
             _id: m._id || "MISSING_ID" // Fallback to help identify issues
          })),
        username: username,
        isAcceptingMessages: question.isAcceptingMessages ?? true,
      },
    },
    { status: 200 }
  );
}
