import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import { handleError } from "@/libs/handleError";
import sendWhatsappMessage from "@/libs/WhatsAppService";
const path = require("path");
const fs = require("fs");

export async function POST(
  req: Request,
  { params }: { params: { uuid: string } }
) {
  try {
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

    const checkPegawai = await prisma.request_session_izin.findFirst({
      include: {
        pegawai: {
          select: {
            nama: true,
            department_id: true,
            sub_department: {
              select: {
                manager: {
                  select: {
                    user: {
                      select: {
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
      },
      where: {
        uuid: uuid,
      },
    });

    if (!checkPegawai) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Unauthorized (data not found)",
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
    const jenis_izin = body.get("jenis_izin")!.toString();
    let tanggal = body.get("tanggal")!.toString();
    let jumlah_hari = body.get("jumlah_hari")!.toString();
    let jumlah_jam = body.get("jumlah_jam")!.toString();
    const keterangan = body.get("keterangan")!.toString();
    const mc = body.get("mc")?.toString();

    if (
      jenis_izin == "C" ||
      jenis_izin == "CS" ||
      jenis_izin == "I" ||
      jenis_izin == "IS" ||
      jenis_izin == "S" ||
      jenis_izin == "P/M"
    ) {
      jumlah_jam = "";
    }

    if (
      jenis_izin == "G1" ||
      jenis_izin == "G2" ||
      jenis_izin == "G3" ||
      jenis_izin == "P/M"
    ) {
      jumlah_hari = "1";
    }

    if (jenis_izin == "CS" || jenis_izin == "IS") {
      jumlah_hari = "0.5";
    }

    const formattedDate = new Date(tanggal);
    formattedDate.setHours(formattedDate.getHours() + 7);

    const create = await prisma.pengajuan_izin.create({
      data: {
        jenis_izin: jenis_izin,
        tanggal: formattedDate,
        jumlah_hari: jumlah_hari,
        jumlah_jam: jumlah_jam === "" ? null : jumlah_jam,
        keterangan: keterangan,
        bulan: formattedDate.getMonth() + 1,
        tahun: formattedDate.getFullYear(),
        pegawai_id: checkPegawai.pegawai_id,
        department_id: checkPegawai.pegawai.department_id,
      },
    });

    if (!create) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Gagal mengajukan izin",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const managerTelp = checkPegawai.pegawai.sub_department?.manager?.user.telp;
    const managerName = checkPegawai.pegawai.sub_department?.manager?.user.name;
    const supervisorTelp =
      checkPegawai.pegawai.sub_department?.supervisor?.user.telp;
    const supervisorName =
      checkPegawai.pegawai.sub_department?.supervisor?.user.name;

    if ((managerTelp || supervisorTelp) && jenis_izin != "P/M") {
      const waTelp = supervisorTelp ? supervisorTelp : managerTelp;
      const waName = supervisorName ? supervisorName : managerName;
      const link = supervisorTelp
        ? `${process.env.IZIN_URL}/approval-izin/supervisor/${create.uuid}`
        : `${process.env.IZIN_URL}/approval-izin/manager/${create.uuid}`;

      let keteranganJumlah = "";

      if (jenis_izin == "C" || jenis_izin == "I" || jenis_izin == "S") {
        keteranganJumlah = `Selama ${jumlah_hari} Hari`;
      } else if (jenis_izin == "CS" || jenis_izin == "IS") {
        keteranganJumlah = `Selama Setengah Hari`;
      } else if (
        jenis_izin == "G1" ||
        jenis_izin == "G2" ||
        jenis_izin == "G3"
      ) {
        keteranganJumlah = `Selama ${jumlah_jam} Jam`;
      }

      const message =
        `*Notifikasi Pengajuan Cuti & Izin | EMS PANJI JAYA*\n\n` +
        `Halo Bapak/Ibu ${waName?.toUpperCase()},\n\n` +
        `Dengan ini saya ${checkPegawai?.pegawai?.nama?.toUpperCase()} mengajukan *${jenisPengajuan(
          jenis_izin
        )?.toUpperCase()}* untuk tanggal *${new Date(
          formattedDate as Date
        ).toLocaleString(
          "id-ID",
          optionsDate
        )} ${keteranganJumlah}*. Alasan pengajuan saya adalah *${keterangan?.toUpperCase()}*.\n\n` +
        `Untuk melihat status pengajuan saya, Bapak/Ibu dapat mengklik link berikut: ${link} \n\n` +
        `Terima kasih atas perhatian dan pengertiannya.\n` +
        `Pesan ini dikirim secara otomatis oleh sistem dan tidak perlu direspon.\n` +
        `Salam,\n` +
        `EMS PANJI JAYA`;

      await sendWhatsappMessage(waTelp!, message);
    }

    if (create.jenis_izin === "S") {
      // save mc base64 to public folder

      const base64Data: any = mc?.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const imagePath = path.join(
        process.cwd(),
        "public/izin",
        create.uuid?.toString() + ".png"
      );
      fs.writeFileSync(imagePath, buffer);
    }

    const expiredSession = await prisma.request_session_izin.update({
      data: {
        expired: true,
      },
      where: {
        uuid: uuid,
      },
    });

    if (!expiredSession) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Gagal mengajukan izin (expired session)",
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
        message: "Berhasil mengajukan izin",
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

const jenisPengajuan = (jenis: string) => {
  switch (jenis) {
    case "C":
      return "Cuti";

    case "CS":
      return "Cuti Setengah Hari";

    case "I":
      return "Izin";

    case "IS":
      return "Izin Setengah Hari";

    case "S":
      return "Sakit";

    case "G1":
      return "Gatepass";

    case "G2":
      return "Datang Terlambat";

    case "G3":
      return "Pulang Awal";

    case "P/M":
      return "Lupa Absen";
  }
};

const optionsDate: any = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
};
