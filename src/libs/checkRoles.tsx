import prisma from "@/libs/db";
export const checkRoles = async (roleId: number, menu: string) => {
  const accessMenu = await prisma.access_menu.findFirst({
    where: {
      role_id: roleId,
      menu: {
        last_path: menu.replace(/\s+/g, ""),
      },
    },
  });

  return accessMenu;
};
