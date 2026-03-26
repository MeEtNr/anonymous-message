import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || user?.role !== "admin") {
    return Response.json(
      { success: false, message: "Not authorized" },
      { status: 401 }
    );
  }

  try {
    const users = await UserModel.find({}, {
      username: 1,
      email: 1,
      isVerified: 1,
      createdAt: 1,
      role: 1
    }).sort({ createdAt: -1 });

    return Response.json(
      {
        success: true,
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin users", error);
    return Response.json(
      { success: false, message: "Error fetching admin users" },
      { status: 500 }
    );
  }
}
