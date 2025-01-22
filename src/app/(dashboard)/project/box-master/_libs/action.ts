"use server";

import prisma from "@/libs/db";
import { handleError } from "@/libs/handleError";

export type BoxMasterProps = {
  id: number;
  box_name: string;
  active: boolean;
};

export const getBoxMaster = async (
  search?: string
): Promise<{
  status: boolean;
  message: string;
  data: any[] | [];
}> => {
  try {
    const result = (await prisma.box_master.findMany({
      where: {
        ...(search && {
          box_name: {
            contains: search,
          },
        }),
      },
      orderBy: {
        box_name: "asc",
      },
    })) as BoxMasterProps[];

    if (!result) {
      return {
        status: false,
        message: "Data not found",
        data: [],
      };
    }

    return {
      status: true,
      message: "Data fetched successfully",
      data: result,
    };
  } catch (error) {
    return handleError(error) as any;
  }
};

export const createBoxMaster = async (data: {
  box_name: string;
}): Promise<{
  status: boolean;
  message: string;
}> => {
  try {
    const result = await prisma.box_master.create({
      data: {
        box_name: data.box_name?.toUpperCase(),
      },
    });

    if (!result) {
      return {
        status: false,
        message: "Add data failed",
      };
    }

    return {
      status: true,
      message: "Add data successfully",
    };
  } catch (error) {
    return handleError(error) as any;
  }
};
