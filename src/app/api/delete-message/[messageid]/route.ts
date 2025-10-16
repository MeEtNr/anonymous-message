import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/models/User";
import { User as IUserSession } from "next-auth";

type Params = { messageid: string };

export async function DELETE(_req: Request, context: { params: Params }) {
  const { messageid } = context.params;
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user as IUserSession | undefined;

  if (!session || !user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not authenticated" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: (user as User)._id }, // your session.user._id
      { $pull: { messages: { _id: messageid } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Message not found or already deleted",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message deleted successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
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
