import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/User";


export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated user",
      },
      {
        status: 401,
      },
    );
  }

  const userId = user?._id;

  const { acceptMessges } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessges },
      { new: true },
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to accept messges",
          updatedUser,
        },
        {
          status: 500,
        },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message aceeacpted sucessfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("Failed to update messges", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update messges",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  const user = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated user",
      },
      {
        status: 401,
      },
    );
  }

  const userId = user?._id;

  try {
    const foundUserId = await UserModel.findById(userId);
    if (!foundUserId) {
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

    return Response.json(
      {
        success: true,
        message: "Found User",
        isAcceptingMessage: foundUserId.isAcceptingMessage,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("Error in getting messges status", error);
    return Response.json(
      {
        success: false,
        message: "Error in getting messges status",
      },
      {
        status: 500,
      },
    );
  }
}
