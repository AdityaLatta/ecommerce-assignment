import { z } from "zod";
import { env } from "~/env";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import nodemailer from "nodemailer";
import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';


const auth = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: env.MAIL_EMAIL,
    pass: env.MAIL_PASS,
  }
})


export const userRouter = createTRPCRouter({
  getUser: publicProcedure
    .query(async ({ctx}) => {

      interface JwtPayload {
        id: string;
      }

      const token = cookies().get('token');   
      
      if (!token || token == null) return;

        const res = jwt.verify(token.value, env.JWT_SECRET_KEY) as JwtPayload;

        const user = await ctx.db.user.findFirst({
          where: {
            id: Number(res.id)
          },
          select: {
            id: true,
            name: true,
            email: true,
            isVerified: true
          }
        })


        return user;
    }),

    getUserEmail: publicProcedure
    .input(z.object({id: z.number()}))
    .query(async ({ctx, input}) => {
        const res = ctx.db.user.findFirst({
          where: {
            id: input.id,
          },
          select: {
            email: true,
          }
        })

        return res;
    }),
    

    getCategories: publicProcedure
    .input(z.object({ page: z.number()}))
    .mutation(async ({ctx, input}) => {

      const res = await ctx.db.category.findMany({ take: 6 , skip: (input.page - 1) * 6});

      return res;
    }),

    createUserCategory: publicProcedure
    .input(z.object({ userId: z.number(), categoryId: z.number()}))
    .mutation(async ({ctx, input}) => {
        
     const res = await ctx.db.userCategory.create({
        data: {
          userId: input.userId,
          categoryId: input.categoryId,
        }
      })

      return res;
    }),


    deleteUserCategory: publicProcedure
    .input(z.object({ userId: z.number(), categoryId: z.number()}))
    .mutation(async ({ctx, input}) => {
        
     const res = await ctx.db.userCategory.deleteMany({
      where:{
        userId: input.userId,
        categoryId: input.categoryId,
      }
     })

      return res;
    }),

  getUserCategories: publicProcedure
  .input(z.object({id: z.number()}))
  .mutation(async({ctx, input}) => {

    const res = await ctx.db.userCategory.findMany({
      where: {
        userId: input.id,
      }
    })

    const arr = [];    

    for (const i of res) {
      arr.push(i.categoryId);
    }

    return arr;
  }),

  create: publicProcedure
    .input(z.object({ name: z.string() , email: z.string(), password: z.string()}))
    .mutation(async ({ ctx, input }) => {
      const otp = Math.floor(10000000 + Math.random() * 90000000).toString().padStart(8, '0');
      
      const receiver = {
        from: "lattaji72@gmail.com",
        to: input.email,
        subject: "Otp Verification for ecommerce",
        text: `Your Otp Verification Code is - ${otp}`
      }
    
      auth.sendMail(receiver, (err) => {
        if (err) {
          console.log(err);
        }
    
        console.log("success");
      })

      const hasedPass = await bcrypt.hash(input.password, 10);

      return ctx.db.user.create({
        data: {
            name: input.name,
            email: input.email,
            password: hasedPass,
            otp: otp
        }
      })
    }),

  login: publicProcedure
   .input(z.object({email: z.string(), password: z.string()}))
   .mutation(async ({ctx, input}) => {

    interface userObj {
      id: number,
      password: string,
      isVerified: boolean
    }    
    
    const user = await ctx.db.user.findFirst({
      where: {
        email: input.email,
      },
      select: {
        id: true,
        password: true,
        isVerified: true,
      }
    }) as userObj

    if (!user) throw new TRPCError({code: "NOT_FOUND", message: "Invalid Credentials"});

    const decodePass = await bcrypt.compare(input.password, user.password);

    if (!decodePass) throw new TRPCError({code: "NOT_FOUND", message: "Invalid Credentials"});
        
    const token = jwt.sign({ id: user?.id }, env.JWT_SECRET_KEY);

    return {
      id: user.id,
      isVerified: user.isVerified,
      token: token,
    };
   }),

   verifyUser: publicProcedure
   .input(z.object({id: z.number(), clientOtp: z.string()}))
   .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.user.findFirst({
        where: {
          id : input.id
        },
        select: {
          otp: true,
          isVerified: true
        }
      })

      if (res?.otp !== input.clientOtp) throw new TRPCError({code: "UNAUTHORIZED", message: "Wrong Otp"});

      await ctx.db.user.update({
        where: {
          id: input.id
        },
        data: {
          isVerified: true
        }
      })

      const token = jwt.sign({id: input.id}, env.JWT_SECRET_KEY);

      return token;
      
   }),
});
