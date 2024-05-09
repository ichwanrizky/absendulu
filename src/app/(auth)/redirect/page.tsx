import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const RedirectPage = async () => {
  const session: any = await getServerSession(authOptions);
  if (session) {
    redirect(session.user.path);
  }

  redirect("/auth/login");
};

export default RedirectPage;
