// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// Default handler
import { wrongMethod, serverError, forbidden } from "../defaultHandler";
// Database
import clientPromise from "../../../lib/mongodb";
// Bcrypt && conf
import bcrypt from "bcrypt";
import { User } from "../model-ts";
// JWT
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("Please add a JWT_SECRET to .env.local");
}

const JWT_SECRET: string = process.env.JWT_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  switch (req.method) {
    case "POST":
      signin(req, res);
      break;
    default:
      wrongMethod(res);
  }
}

async function signin(req: NextApiRequest, res: NextApiResponse<any>) {
  const client = await clientPromise;
  const db = client.db("the_archiver");

  // Validate user data
  try {
    User.parse(req.body);
  } catch (e: any) {
    serverError(res, e);
  }

  const existingUser = await db
    .collection("users")
    .findOne({ login: req.body.login });

  if (!existingUser) {
    forbidden(res, "Wrong credentials");
    return;
  }
  bcrypt
    .compare(req.body.password, existingUser.password)
    .then((valid: boolean) => {
      if (!valid) {
        forbidden(res, "Wrong credentials");
        return;
      }

      res.status(200).json({
        message: "Connection succed",
        user: {
          _id: existingUser._id,
          login: existingUser.login,
        },
        token: jwt.sign({ userId: existingUser._id }, JWT_SECRET, {
          expiresIn: "12h",
        }),
      });
    })
    .catch((e: Error) => {
      serverError(res, e);
    });
}
