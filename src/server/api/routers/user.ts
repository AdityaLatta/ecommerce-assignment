import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import nodemailer from "nodemailer";

const auth = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "lattaji72@gmail.com",
    pass: "lkycnioucobnnhjf"
  }
})


export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string() , email: z.string(), password: z.string()}))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      const otp = Math.floor(10000000 + Math.random() * 90000000).toString().padStart(8, '0');
          
      const receiver = {
        from: "lattaji72@gmail.com",
        to: input.email,
        subject: "Otp Verification for ecommerce",
        text: `Your Otp Verification Code is - ${otp}`
      }
    
      auth.sendMail(receiver, (err, emailResponse) => {
        if (err) {
          console.log(err);
        }
    
        console.log("success");
      })

      return ctx.db.user.create({
        data: {
            name: input.name,
            email: input.email,
            password: input.password,
            otp: otp
        }
      })
    }),

  login: publicProcedure
   .input(z.object({email: z.string(), password: z.string()}))
   .mutation(async ({ctx, input}) => {
    
    return await ctx.db.user.findFirst({
      where: {
        email: input.email,
        password: input.password
      },
      select: {
        otp: false
      }
    })
   }),

   getOtp: publicProcedure
   .input(z.object({id: z.number()}))
   .query(async ({ ctx, input }) => {
      const otp = await ctx.db.user.findFirst({
        where: {
          id : input.id
        },
        select: {
          otp: true,
          isVerified: true,
          email: true       
        }
      })

      return otp;
   }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" }
    });
  }),
});
