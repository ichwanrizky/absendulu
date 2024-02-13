import prisma from "@/libs/db";
export const checkRoles = async (roleId: number, path: string) => {
  const accessMenu = await prisma.access_menu.findFirst({
    where: {
      role_id: roleId,
      menu: {
        path: path,
      },
    },
  });

  return accessMenu;
};
