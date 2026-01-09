import { Role } from "@prisma/client";
export interface RegisterRequestBody {
    name: string;
    email: string;
    password: string;
    role:Role;
}
