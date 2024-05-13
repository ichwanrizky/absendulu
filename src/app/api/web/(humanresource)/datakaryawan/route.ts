import { NextResponse } from "next/server";
import { checkSession } from "@/libs/checkSession";
import { checkRoles } from "@/libs/checkRoles";
import prisma from "@/libs/db";
import { handleError } from "@/libs/handleError";

export async function GET(req: Request) {
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
    if (!actions.includes("view")) {
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

    // filter
    const filter = searchParams.get("filter");
    const parseFilter = filter ? JSON.parse(filter) : {};

    if (!filter) {
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

    // search
    const search = searchParams.get("search");

    // page
    const page = searchParams.get("page");

    // dept
    const select_dept = searchParams.get("select_dept");

    const condition = {
      where: {
        department: {
          id: Number(select_dept),
        },
        is_active: parseFilter.active === "1",
        ...(parseFilter.subDepartment && {
          sub_department: {
            id: Number(parseFilter.subDepartment),
          },
        }),
        nama: {
          contains: search ? search : undefined,
        },
      },
    };

    const totalData = await prisma.pegawai.count({
      ...condition,
    });

    const ITEMS_PER_PAGE = page ? 10 : totalData;
    var data = await prisma.pegawai.findMany({
      include: {
        department: {
          select: {
            nama_department: true,
          },
        },
        sub_department: {
          select: {
            nama_sub_department: true,
          },
        },
      },
      ...condition,
      orderBy: [
        {
          sub_department: {
            id: "asc",
          },
        },
        {
          nama: "asc",
        },
      ],
      skip: page ? (parseInt(page) - 1) * ITEMS_PER_PAGE : 0,
      take: ITEMS_PER_PAGE,
    });

    data = data.map((data, index) => {
      return {
        number: page
          ? (Number(page) - 1) * ITEMS_PER_PAGE + index + 1
          : index + 1,
        ...data,
      };
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
        actions: actions,
        itemsPerPage: ITEMS_PER_PAGE,
        total: totalData,
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
    if (!actions.includes("insert")) {
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

    const create = await prisma.pegawai.create({
      data: {
        panji_id: idKaryawan ? idKaryawan?.toUpperCase() : null,
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
    });

    if (!create) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to create karyawan",
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
        message: "Success to create karyawan",
        data: create,
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
