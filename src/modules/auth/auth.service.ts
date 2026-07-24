import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IUserLogin } from "./auth.interface";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { SignOptions } from "jsonwebtoken";

const loginUserIntoDB = async(payload: IUserLogin)=>{

    const {email, password} = payload;
    const user = await prisma.user.findUnique({
        where: {email}
    });
    if(!user){
        throw new Error("User not found !")
    };
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if(!isPasswordMatched){
        throw new Error("Invalid credentials!")
    };
   const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
   };

   const accessToken =  jwtUtils.createToken(jwtPayload, config.jwt_access_secret,  config.jwt_access_expires_in as SignOptions);
   const refreshToken =  jwtUtils.createToken(jwtPayload, config.jwt_refrest_secret,  config.jwt_refresh_expires_in as SignOptions);

   return {
    accessToken, 
    refreshToken
   }

};


export const authService = {
    loginUserIntoDB,
}