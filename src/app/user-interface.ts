import { Role } from "@/entity/enum";

export interface UserProfile {
    user: {
      role: Role;
    };
  }