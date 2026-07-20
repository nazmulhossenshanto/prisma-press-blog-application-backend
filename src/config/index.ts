import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(process.cwd(), '.env')
});

export default{
    port: Number(process.env.PORT) || 5000,
    database_url: process.env.DATABASE_URL!,
    app_url: process.env.APP_URL!,
    bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUND)!,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
    jwt_refrest_secret: process.env.JWT_REFRESH_SECRET!,
    jwt_access_expires_in: process.env.JWT_ACCESS_SECRET_EXPIRES_IN!,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_SECRET_EXPIRES_IN!
};