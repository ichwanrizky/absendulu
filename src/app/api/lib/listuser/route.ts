import { NextResponse } from "next/server";
import { checkSession } from "@/libs/checkSession";
import prisma from "@/libs/db";
import { handleError } from "@/libs/handleError";

export async function POST(req: Request) {
  try {
    const authorization = req.headers.get("Authorization");

    const session = await checkSession(authorization);
    if (!session[0]) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Unauthorized",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const body = await req.formData();
    const department = body.get("department")!.toString();

    const data = await prisma.pegawai.findMany({
      select: {
        id: true,
        nama: true,
      },
      where: {
        user: {
          none: {},
        },
        department_id: Number(department),
        is_active: true,
      },
      orderBy: {
        nama: "asc",
      },
    });

    if (!data) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Data not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "success",
        data: data,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return handleError(error);
  }
}
