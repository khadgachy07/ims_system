import { DataSource } from "typeorm";
import { User } from "@/entity/users";
import { Incentives } from "@/entity/incentives";
import { Idea } from "@/entity/ideas";
import { Submission } from "@/entity/submission";
import { join } from "path";
import { seedAdmin } from "@/seed/seeder-admin";

let appDataSource: DataSource;

if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
  appDataSource = new DataSource({
    type: "postgres",
    host: process.env.NEXT_PUBLIC_DB_HOST,
    port: Number(process.env.NEXT_PUBLIC_DB_PORT),
    username: process.env.NEXT_PUBLIC_DB_USER,
    password: process.env.NEXT_PUBLIC_DB_PASSWORD,
    database: process.env.NEXT_PUBLIC_DB_NAME,
    synchronize: false,
    logging: false,
    entities: [User, Incentives, Idea, Submission],
  });
} else {
  appDataSource = new DataSource({
    type: "postgres",
    host: process.env.NEXT_PUBLIC_DB_HOST,
    port: Number(process.env.NEXT_PUBLIC_DB_PORT),
    username: process.env.NEXT_PUBLIC_DB_USER,
    password: process.env.NEXT_PUBLIC_DB_PASSWORD,
    database: process.env.NEXT_PUBLIC_DB_NAME,
    synchronize: true,
    logging: true,
    entities: [User, Incentives, Idea, Submission],
    migrations: [join(__dirname, '../migrations/', '*.{ts,js}')],
    migrationsRun: true,
    ssl: process.env.APP_ENV === 'production' ? true : false,
  });
}

export const AppDataSource = appDataSource;

// Function to initialize the database connection
export async function initializeDatabase() {
  try {
    if (!appDataSource.isInitialized) {
      await appDataSource.initialize();
      await seedAdmin();
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}