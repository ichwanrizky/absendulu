import prisma from "@/libs/db";
const jwt = require("jsonwebtoken");

export const checkSessionMobile = async (authorization: any) => {
  // check if need authorization

  if (!authorization) {
    return [false, null, "unauthorized"];
  }

  // check if token is bearer
  if (authorization.split(" ")[0] !== "Bearer") {
    return [false, null, "invalid token"];
  }

  const token = authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT);

  // check if token is valid
  if (!decoded) {
    return [false, null, "invalid token"];
  }

  // check to session is active
  const session = await prisma.session_mobile.findFirst({
    where: {
      token: token.toString(),
      expired: false,
    },
  });

  if (!session) {
    return [false, null, "session expired"];
  }

  return [true, decoded.data, null];
};
