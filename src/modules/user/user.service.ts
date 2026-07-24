import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { ICreateUserPayload } from "./user.interface";

const createUserIntoDB = async(payload: ICreateUserPayload)=>{
const {name, email, password, profilePhoto} = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {email}
  });
  if(isUserExist){
    throw new Error("User with this email already exist")
  };
  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profile: {
        create: {profilePhoto}
      }
    },
    
  });
//   await prisma.profile.create({
//     data: {
//       userId : user.id,
//       profilePhoto: profilePhoto
//     }
//   });

  const createdUser = await prisma.user.findUnique({
    where: {
      id: user.id,
      email: user.email || email
    }
  });
  return createdUser
};


export const userService = {
    createUserIntoDB
}