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
    const totalUsers = await UserModel.countDocuments();
    const verifiedUsers = await UserModel.countDocuments({ isVerified: true });

    // Get signup trends for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const signupTrends = await UserModel.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return Response.json(
      {
        success: true,
        stats: {
          totalUsers,
          verifiedUsers,
          signupTrends,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin stats", error);
    return Response.json(
      { success: false, message: "Error fetching admin stats" },
      { status: 500 }
    );
  }
}
