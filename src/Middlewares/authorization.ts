import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { SECRET } from "../global";
import { role } from "@prisma/client";

interface jwtPayload {
  id: string;
  nama: string;
  password: string;
  role: string;
}

export const verifyToken = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token) {
    return response
      .status(403)
      .json({ message: `Akses ditolak, tidak ada token yang disediakan` });
  }

  try {
    const secretKey = SECRET || "";
    const decoded = verify(token, secretKey);
    request.body.user = decoded as jwtPayload;
    next();
  } catch (error) {
    return response.status(401).json({ message: `Token tidak valid` });
  }
};

export const verifyRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    
    // console.log(user.role)

    if (!user) {
      return res
        .status(403)
        .json({ message: `Tidak ada informasi pengguna yang tersedia` });
    }

    // Debugging - Periksa isi user
    // console.log("User yang terautentikasi:", user);

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message: `Akses ditolak. Membutuhkan salah satu roles yang ada: ${allowedRoles.join(
          ", "
        )}`,
      });
    }
    next();
  };
};
