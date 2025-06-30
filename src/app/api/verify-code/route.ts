import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, code } = await req.json();

    const decodedUsername = decodeURIComponent(username); //used when data is coming from the requesdt URL (query)

    const user = await UserModel.findOne({
      username,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found with this username",
        },
        {
          status: 400,
        }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Your account is verified successfully !",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Your verification code is expired, signup again to get a new code",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error verifying your account", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying your account",
      },
      {
        status: 500,
      }
    );
  }
}
