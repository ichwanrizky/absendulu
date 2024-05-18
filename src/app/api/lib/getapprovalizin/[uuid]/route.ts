import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import { checkSession } from "@/libs/checkSession";
import { handleError } from "@/libs/handleError";

export async function POST(
  req: Request,
  { params }: { params: { uuid: string } }
) {
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

    const uuid = params.uuid;
    if (!uuid) {
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
    const metode = body.get("metode")?.toString();

    const getData = await prisma.pengajuan_izin.findFirst({
      include: {
        pegawai: {
          select: {
            nama: true,
            department: {
              select: {
                nama_department: true,
              },
            },
            sub_department: {
              select: {
                nama_sub_department: true,
                manager: {
                  select: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        telp: true,
                      },
                    },
                  },
                },
                supervisor: {
                  select: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        telp: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        user_known: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        uuid: uuid,
        ...(metode === "supervisor"
          ? {
              known_status: 0,
              pegawai: {
                sub_department: {
                  supervisor: {
                    user: {
                      id: session[1].id,
                    },
                  },
                },
              },
            }
          : {
              status: 0,
              pegawai: {
                sub_department: {
                  manager: {
                    user: {
                      id: session[1].id,
                    },
                  },
                },
              },
            }),
      },
    });

    if (!getData) {
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
        data: getData,
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
