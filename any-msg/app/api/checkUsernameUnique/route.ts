import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/User";
import z, { json, success } from "zod";
import { usernameValidation } from "@/src/schemas/signupSchema";

const UsernameQuaryShema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {


  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    const queryParams = {
      username: searchParams.get("username"),
    };

    // Validate with Zod

    const result = UsernameQuaryShema.safeParse(queryParams);

    console.log("Query result", result);

    if (!result.success) {
      const userErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message: "Invalid query paramerter",
        },
        {
          status: 400,
        },
      );
    }

    const { username } = result.data;

    const isuserVerified = await UserModel.findOne({
      username,
      isverified: true,
    });

    if (isuserVerified) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 400,
        },
      );
    }
    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      {
        status: 400,
      },
    );
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error while checking username",
      },
      {
        status: 500,
      },
    );
  }
}
