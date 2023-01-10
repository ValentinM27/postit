// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// Default handler
import { wrongMethod, serverError } from "../defaultHandler";
// Database
import clientPromise from "../../../lib/mongodb";
// Bcrypt && conf
import bcrypt from "bcrypt";
const bcryptSaltRound = 10;
// Validation
import { User } from "../../model-ts";

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
  const db = client.db("postit");

  // Validate user data
  try {
    User.parse(req.body);
  } catch (e: any) {
    serverError(res, e);
  }

  // Check if email unique
  const existingUser = await db
    .collection("users")
    .findOne({ email: req.body.email });

  if (existingUser) {
    res.status(403).json({ error: "This email is already used " });
    return;
  }

  // Hash password and create user
  bcrypt
    .hash(req.body.password, bcryptSaltRound)
    .then(async function (hash: string) {
      const newUser = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash,
      };
      let createdUser = await db.collection("users").insertOne(newUser);
      res.json(createdUser);
    })
    .catch((e: Error) => {
      serverError(res, e);
    });
}
