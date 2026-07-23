import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({origin: config.app_url , credentials: true}));

app.get('/', async(req: Request, res: Response) => {
  const user = await prisma.user.findMany();
  console.log(user);
  res.send('Hello prisma!')
})

app.post('/api/users/register', async(req:Request, res:Response)=>{
  const {name, email, password, profilePhoto} = req.body;
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
      password: hashedPassword
    }
  });
  await prisma.profile.create({
    data: {
      userId : user.id,
      profilePhoto: profilePhoto
    }
  });
  const createdUser = await prisma.user.findUnique({
    where: {
      id: user.id,
      email: user.email || email
    }
  });

  res.status(201).json({
    success: true,
    statuscode: 201,
    message: "User registered successfully!",
    data : {createdUser}
  })
})




export default app;
