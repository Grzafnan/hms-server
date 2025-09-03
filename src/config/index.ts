import dotenv from "dotenv";
import path from "path";
import { Secret } from "jsonwebtoken";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET as string,
    refresh_secret: process.env.JWT_REFRESH_SECRET as string,
    expires_in: process.env.JWT_EXPIRES_IN as string,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN as string,
  },
};