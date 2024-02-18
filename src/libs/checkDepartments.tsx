import prisma from "@/libs/db";

export const checkDepartments = async (roles: number) => {
  const data = await prisma.access_department.findMany({
    where: {
      role_id: roles,
    },
  });

  return data;
};
