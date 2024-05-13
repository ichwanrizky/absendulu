import { NextResponse } from "next/server";
import { checkSession } from "@/libs/checkSession";
import { checkRoles } from "@/libs/checkRoles";
import prisma from "@/libs/db";
import { handleError } from "@/libs/handleError";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
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

    const searchParams = new URL(req.url).searchParams;
    const menu_url = searchParams.get("menu_url");

    if (!menu_url) {
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

    const roleId = session[1].roleId;
    const roleAccess = await checkRoles(roleId, menu_url);
    if (!roleAccess) {
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

    const id = params.id;
    if (!id) {
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

    const data = await prisma.pegawai.findFirst({
      include: {
        izin_lokasi_tambahan: {
          select: {
            lokasi_tambahan: {
              select: {
                id: true,
                lokasi: true,
              },
            },
          },
        },
      },
      where: {
        id: Number(id),
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

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
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

    const searchParams = new URL(req.url).searchParams;
    const menu_url = searchParams.get("menu_url");

    if (!menu_url) {
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

    const roleId = session[1].roleId;
    const roleAccess = await checkRoles(roleId, menu_url);
    if (!roleAccess) {
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

    const actions = roleAccess?.action ? roleAccess?.action.split(",") : [];
    if (!actions.includes("update")) {
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

    const id = params.id;
    if (!id) {
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

    const body = await req.formData();
    const nama = body.get("nama")!.toString();
    const idKaryawan = body.get("id_karyawan")?.toString();
    const department = body.get("department")!.toString();
    const subDepartment = body.get("sub_department")!.toString();
    const nik = body.get("nik")!.toString();
    const posisi = body.get("posisi")!.toString();
    const tempatLahir = body.get("tempat_lahir")?.toString();
    const jenisKelamin = body.get("jenis_kelamin")!.toString();
    const agama = body.get("agama")?.toString();
    const kebangsaan = body.get("kebangsaan")?.toString();
    const alamat = body.get("alamat")!.toString();
    const rt = body.get("rt")?.toString();
    const rw = body.get("rw")?.toString();
    const kelurahan = body.get("kelurahan")?.toString();
    const kecamatan = body.get("kecamatan")?.toString();
    const kota = body.get("kota")?.toString();
    const telp = body.get("telp")?.toString();
    const email = body.get("email")?.toString();
    const statusNikah = body.get("status_nikah")!.toString();
    const npwp = body.get("npwp")?.toString();
    const jenisBank = body.get("jenis_bank")?.toString();
    const noRekening = body.get("no_rekening")?.toString();
    const bpjstk = body.get("bpjstk")?.toString();
    const bpjkskes = body.get("bpjkskes")?.toString();

    const tanggalLahir = body.get("tanggal_lahir")!.toString();
    const tanggalJoin = body.get("tanggal_join")?.toString();

    const izinLokasi = body.get("izin_lokasi");
    const parseIzinLokasi = izinLokasi ? JSON.parse(izinLokasi as string) : [];

    const update = await prisma.$transaction([
      prisma.pegawai.update({
        data: {
          panji_id: idKaryawan ? idKaryawan.toUpperCase() : null,
          nama: nama.toUpperCase(),
          nik_ktp: nik,
          tmp_lahir: tempatLahir,
          tgl_lahir: new Date(tanggalLahir),
          tgl_join: tanggalJoin ? new Date(tanggalJoin) : null,
          jk: jenisKelamin,
          agama: agama,
          kebangsaan: kebangsaan,
          alamat: alamat,
          rt: rt,
          rw: rw,
          kel: kelurahan,
          kec: kecamatan,
          kota: kota,
          telp: telp,
          status_nikah: statusNikah,
          email: email,
          position: posisi,
          npwp: npwp,
          jenis_bank: jenisBank,
          no_rek: noRekening,
          bpjs_tk: bpjstk,
          bpjs_kes: bpjkskes,
          department: {
            connect: {
              id: Number(department),
            },
          },
          sub_department: {
            connect: {
              id: Number(subDepartment),
            },
          },
        },
        where: {
          id: Number(id),
        },
      }),

      prisma.izin_lokasi_tambahan.deleteMany({
        where: {
          pegawai_id: Number(id),
        },
      }),
    ]);

    if (parseIzinLokasi.length > 0) {
      await prisma.izin_lokasi_tambahan.createMany({
        data: parseIzinLokasi.map((item: any) => ({
          pegawai_id: Number(id),
          lokasi_tambahan_id: item.value,
        })),
      });
    }

    if (!update) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to update karyawan",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to update karyawan",
        data: update,
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
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

    const searchParams = new URL(req.url).searchParams;
    const menu_url = searchParams.get("menu_url");

    if (!menu_url) {
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

    const roleId = session[1].roleId;
    const roleAccess = await checkRoles(roleId, menu_url);
    if (!roleAccess) {
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

    const actions = roleAccess?.action ? roleAccess?.action.split(",") : [];
    if (!actions.includes("delete")) {
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

    const id = params.id;
    if (!id) {
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

    const deletes = await prisma.pegawai.delete({
      where: {
        id: Number(id),
      },
    });

    if (!deletes) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to delete data karyawan",
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
        message: "Success to delete data karyawan",
        data: deletes,
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
