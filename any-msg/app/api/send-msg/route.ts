import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/User";
import { Message } from "@/src/models/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User not acceptiong",
        },
        {
          status: 403,
        },
      );
    }

    const newMsg = { content, createdAt: new Date() };

    user.message.push(newMsg as Message);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Message send sucessfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("Unexpeted error occurs", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
