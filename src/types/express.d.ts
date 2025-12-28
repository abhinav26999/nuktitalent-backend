import { JwtPayload } from "../interfaces/auth/jwt-payload.interface";
import { Role } from "@prisma/client";


declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        role?: Role;
        email?: string;
      };
    }
  }
}

export {};
