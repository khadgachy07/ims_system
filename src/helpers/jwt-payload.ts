import { Role } from "@/entity/enum";

export interface IJwtPayload {
    sub: number;
    email: string;
    role: Role;
  }