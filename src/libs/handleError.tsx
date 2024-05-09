import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const handleError = (error: any) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return new NextResponse(
      JSON.stringify({ status: false, message: "request error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    return new NextResponse(
      JSON.stringify({ status: false, message: "data validation error" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } else if (error instanceof Error) {
    if (error?.name == "TokenExpiredError") {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Session Expired",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({ status: false, message: error.name }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return new NextResponse(
    JSON.stringify({ status: false, message: "internal server error" }),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
