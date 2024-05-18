import { NextResponse } from "next/server";
import { checkSession } from "@/libs/checkSession";
import { checkRoles } from "@/libs/checkRoles";
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
    const status = body.get("status")!.toString();
    const id = body.get("id")!.toString();
    const metode = body.get("metode")!.toString();

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

    // format date
    const currendDate = new Date();
    const formattedDate = new Date(currendDate);
    formattedDate.setHours(formattedDate.getHours() + 7);

    if (metode === "supervisor") {
      const update = await prisma.pengajuan_izin.update({
        data: {
          known_status: Number(status),
          known_by: session[1].id,
          known_date: formattedDate,
          ...(status === "2" && { status: 2 }),
        },
        where: {
          id: Number(id),
        },
      });

      if (!update) {
        return new NextResponse(
          JSON.stringify({
            status: false,
            message: "Failed to update pengajuan izin",
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (status === "1") {
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

        const waName =
          checkPengajuan?.pegawai?.sub_department?.manager?.user?.name;
        const waTelp =
          checkPengajuan?.pegawai?.sub_department?.manager?.user?.telp;

        let keteranganJumlah = "";

        const jenis_izin = checkPengajuan!.jenis_izin;

        if (jenis_izin == "C" || jenis_izin == "I" || jenis_izin == "S") {
          keteranganJumlah = `Selama ${checkPengajuan!.jumlah_hari} Hari`;
        } else if (jenis_izin == "CS" || jenis_izin == "IS") {
          keteranganJumlah = `Selama Setengah Hari`;
        } else if (
          jenis_izin == "G1" ||
          jenis_izin == "G2" ||
          jenis_izin == "G3"
        ) {
          keteranganJumlah = `Selama ${checkPengajuan!.jumlah_jam} Jam`;
        }

        const message =
          `*Notifikasi Pengajuan Cuti & Izin | EMS PANJI JAYA*\n\n` +
          `Halo Bapak/Ibu ${waName?.toUpperCase()},\n\n` +
          `Dengan ini saya ${checkPengajuan?.pegawai?.nama?.toUpperCase()} mengajukan *${jenisPengajuan(
            jenis_izin
          )?.toUpperCase()}* untuk tanggal *${new Date(
            checkPengajuan!.tanggal as Date
          ).toLocaleString(
            "id-ID",
            optionsDate
          )} ${keteranganJumlah}*. Alasan pengajuan saya adalah *${checkPengajuan!.keterangan?.toUpperCase()}*.\n\n` +
          `Untuk melihat status pengajuan saya, Bapak/Ibu dapat mengklik link berikut: ${
            process.env.IZIN_URL
          }/approval-izin/manager/${checkPengajuan!.uuid} \n\n` +
          `Terima kasih atas perhatian dan pengertiannya.\n` +
          `Pesan ini dikirim secara otomatis oleh sistem dan tidak perlu direspon.\n` +
          `Salam,\n` +
          `EMS PANJI JAYA`;

        await sendWhatsappMessage(waTelp!, message);
      }

      return new NextResponse(
        JSON.stringify({
          status: true,
          message: "Success to update pengajuan izin",
          data: update,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      const update = await prisma.pengajuan_izin.update({
        data: {
          status: Number(status),
          approve_by: session[1].id,
          approve_date: formattedDate,
        },
        where: {
          id: Number(id),
        },
      });

      if (!update) {
        return new NextResponse(
          JSON.stringify({
            status: false,
            message: "Failed to update pengajuan izin",
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (status === "1") {
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;

        const tanggalMerah = await prisma.tanggal_merah_list.findMany({
          where: {
            tanggal_merah: {
              department_id: Number(update.department_id),
            },
            OR: [
              {
                tanggal_merah: {
                  tahun: currentYear,
                },
              },
              {
                tanggal_merah: {
                  tahun: nextYear,
                },
              },
            ],
          },
        });

        const tanggalMerahSet = new Set(
          tanggalMerah.map(
            (item: any) => item.tanggal.toISOString().split("T")[0]
          )
        );

        const jumlahHari =
          update.jumlah_hari === "" ? 1 : Number(update.jumlah_hari);

        const izinData = [];
        let tanggalIzin = new Date(update.tanggal as Date);
        let i = 0;

        while (izinData.length < jumlahHari) {
          if (i > 0) {
            tanggalIzin.setDate(tanggalIzin.getDate() + 1);
          }

          if (!tanggalMerahSet.has(tanggalIzin.toISOString().split("T")[0])) {
            const izinEntry = {
              jenis_izin: update.jenis_izin,
              tanggal: new Date(tanggalIzin),
              pegawai_id: update.pegawai_id,
              bulan: update.bulan,
              tahun: update.tahun,
              keterangan: update.keterangan,
              pengajuan_izin_id: update.id,
              department_id: update.department_id,
              jumlah_hari: update.jumlah_hari,
              jumlah_jam: update.jumlah_jam,
            };

            izinData.push(izinEntry);
          }

          i++;
        }

        const insertIzin = await prisma.izin.createMany({
          data: izinData,
        });

        if (!insertIzin) {
          return new NextResponse(
            JSON.stringify({
              status: false,
              message: "Failed to update pengajuan izin",
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      }

      return new NextResponse(
        JSON.stringify({
          status: true,
          message: "Success to update pengajuan izin",
          data: update,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
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
