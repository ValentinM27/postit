// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// Default handler
import { wrongMethod, serverError, forbidden } from "../defaultHandler";
// Database
import clientPromise from "../../../lib/mongodb";
// Bcrypt && conf
import bcrypt from "bcrypt";
const bcryptSaltRound = 10;
// Validation
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
      await signup(req, res);
      break;
    default:
      wrongMethod(res);
  }
}

async function signup(req: NextApiRequest, res: NextApiResponse<any>) {
  const client = await clientPromise;
  const db = client.db("the_archiver");

  // Validate user data
  try {
    User.parse(req.body);
  } catch (e: any) {
    serverError(res, e);
  }

  // Check if login unique
  const existingUser = await db
    .collection("users")
    .findOne({ login: req.body.login });

  if (existingUser) {
    forbidden(res, "This login is already used ");
    return;
  }

  if (
    req.body.password !== req.body.confirmPassword ||
    !req.body.confirmPassword
  ) {
    forbidden(res, "Confirm your password");
    return;
  }

  // Hash password and create user
  bcrypt
    .hash(req.body.password, bcryptSaltRound)
    .then(async function (hash: string) {
      const newUser = {
        login: req.body.login,
        password: hash,
      };
      let createdUser = await db.collection("users").insertOne(newUser);

      res.status(200).json({
        message: "Connection succed",
        user: {
          _id: createdUser.insertedId,
          login: newUser.login,
        },
        token: jwt.sign({ userId: createdUser.insertedId }, JWT_SECRET, {
          expiresIn: "12h",
        }),
      });
    })
    .catch((e: any) => {
      serverError(res, e);
    });
}
