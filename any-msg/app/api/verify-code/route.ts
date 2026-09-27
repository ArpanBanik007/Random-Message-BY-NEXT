import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/User";

async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({
      username: decodedUsername,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 400,
        },
      );
    }

    const isCodeValid = user.verifycode === code;
    const isCodeNotExpire = new Date(user.verifycodeExpire) > new Date();

    if (isCodeValid && isCodeNotExpire) {
      user.isverified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account is verified suecessfully ",
        },
        {
          status: 200,
        },
      );
    } else if (!isCodeNotExpire) {
      return Response.json(
        {
          success: false,
          message: "Verification code is expired please enter a new code ",
        },
        {
          status: 400,
        },
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect Verifiaction code",
        },
        {
          status: 400,
        },
      );
    }
  } catch (error) {
    console.error("Error verifying User", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying User",
      },
      {
        status: 500,
      },
    );
  }
}
