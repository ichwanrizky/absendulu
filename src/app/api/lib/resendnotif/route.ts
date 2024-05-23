import { NextResponse } from "next/server";
import { checkSession } from "@/libs/checkSession";
import prisma from "@/libs/db";
import { handleError } from "@/libs/handleError";
import sendWhatsappMessage from "@/libs/WhatsAppService";

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
    const id = body.get("id_pengajuanizin")!.toString();

    const checkPengajuan = await prisma.pengajuan_izin.findFirst({
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
      },
      where: {
        id: Number(id),
      },
    });

    if (!checkPengajuan) {
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

    const managerTelp =
      checkPengajuan.pegawai.sub_department?.manager?.user.telp;
    const managerName =
      checkPengajuan.pegawai.sub_department?.manager?.user.name;
    const supervisorTelp =
      checkPengajuan.pegawai.sub_department?.supervisor?.user.telp;
    const supervisorName =
      checkPengajuan.pegawai.sub_department?.supervisor?.user.name;

    const waTelp =
      checkPengajuan.known_status === 0 ? supervisorTelp : managerTelp;
    const waName =
      checkPengajuan.known_status === 0 ? supervisorName : managerName;

    const link =
      checkPengajuan.known_status === 0
        ? `${process.env.IZIN_URL}/approval-izin/supervisor/${checkPengajuan.uuid}`
        : `${process.env.IZIN_URL}/approval-izin/manager/${checkPengajuan.uuid}`;

    const jenis_izin = checkPengajuan.jenis_izin;
    const jumlah_hari = checkPengajuan.jumlah_hari;
    const jumlah_jam = checkPengajuan.jumlah_jam;

    let keteranganJumlah = "";

    if (jenis_izin == "C" || jenis_izin == "I" || jenis_izin == "S") {
      keteranganJumlah = `Selama ${jumlah_hari} Hari`;
    } else if (jenis_izin == "CS" || jenis_izin == "IS") {
      keteranganJumlah = `Selama Setengah Hari`;
    } else if (jenis_izin == "G1" || jenis_izin == "G2" || jenis_izin == "G3") {
      keteranganJumlah = `Selama ${jumlah_jam} Jam`;
    }

    const message =
      `*Notifikasi Pengajuan Cuti & Izin | EMS PANJI JAYA*\n\n` +
      `Halo Bapak/Ibu ${waName?.toUpperCase()},\n\n` +
      `Dengan ini saya ${checkPengajuan?.pegawai?.nama?.toUpperCase()} mengajukan *${jenisPengajuan(
        jenis_izin
      )?.toUpperCase()}* untuk tanggal *${new Date(
        checkPengajuan.tanggal as Date
      ).toLocaleString(
        "id-ID",
        optionsDate
      )} ${keteranganJumlah}*. Alasan pengajuan saya adalah *${checkPengajuan.keterangan?.toUpperCase()}*.\n\n` +
      `Untuk melihat status pengajuan saya, Bapak/Ibu dapat mengklik link berikut: ${link} \n\n` +
      `Terima kasih atas perhatian dan pengertiannya.\n` +
      `Pesan ini dikirim secara otomatis oleh sistem dan tidak perlu direspon.\n` +
      `Salam,\n` +
      `EMS PANJI JAYA`;

    const sendWhatsapp = await sendWhatsappMessage(waTelp!, message);
    if (!sendWhatsapp) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to send ",
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
        message: "Success to send notif",
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
