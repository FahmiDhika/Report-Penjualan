import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { SECRET } from "../global";

interface jwtPayload {
  id: string;
  nama: string;
  password: string;
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
    request.body.admin = decoded as jwtPayload;
    next();
  } catch (error) {
    return response.status(401).json({ message: `Token tidak valid` });
  }
};