// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { user } from "../model-ts";

import { isAuthentificated } from "../auth/auth";
import { wrongMethod, serverError, forbidden, succed } from "../defaultHandler";
// Database
import clientPromise from "../../../lib/mongodb";
// Bcrypt && conf
import bcrypt from "bcrypt";
const bcryptSaltRound = 10;

import { User } from "../model-ts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<user>
) {
  switch (req.method) {
    case "GET":
      getUser(req, res);
      break;
    case "POST":
      updatePassword(req, res);
      break;
    default:
      wrongMethod(res);
  }
}

async function getUser(req: NextApiRequest, res: NextApiResponse<any>) {
  res.status(200).json(await isAuthentificated(req, res));
}

async function updatePassword(req: NextApiRequest, res: NextApiResponse<any>) {
  const currentUser = await isAuthentificated(req, res);

  const client = await clientPromise;
  const db = client.db("the_archiver");

  // Validate user data
  try {
    User.parse(req.body);
  } catch (e: any) {
    serverError(res, e);
  }

  if (
    req.body.password !== req.body.confirmPassword ||
    !req.body.confirmPassword
  ) {
    forbidden(res, "Confirm your password");
    return;
  }

  bcrypt
    .hash(req.body.password, bcryptSaltRound)
    .then(async function (hash: string) {
      await db.collection("users").updateOne(
        { _id: currentUser?._id },
        {
          $set: {
            password: hash,
          },
        }
      );

      succed(res, "Password updated");
    })
    .catch((e: Error) => {
      serverError(res, e);
    });
}
