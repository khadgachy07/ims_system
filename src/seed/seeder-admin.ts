import { AppDataSource } from "@/db/data-source";
import { Role } from "@/entity/enum";
import { User } from "@/entity/users";
import hashPassword from "@/helpers/password";
import { NextResponse } from "next/server";

export async function seedAdmin() {
  const userRepository = AppDataSource.getRepository(User);
  const existingAdmin = await userRepository.find({ where: { role: Role.SYSTEM_ADMIN } });
  if (existingAdmin.length > 0) {
    return new NextResponse("Admin already exists", { status: 400 });
  }
  const admin = new User();
  admin.name = "Admin";
  admin.email = "admin@admin.com";
  const hashedPassword = await hashPassword('admin12')
  admin.encryptedPassword = hashedPassword;
  admin.role = Role.SYSTEM_ADMIN;
  await userRepository.save(admin);
  return new NextResponse("Admin seeded successfully", { status: 200 });
}