// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { bookref, user } from "../model-ts";

import { isAuthentificated } from "../auth/auth";
import { wrongMethod, serverError, forbidden, succed } from "../defaultHandler";
// Database
import clientPromise from "../../../lib/mongodb";
import { s3, bucketName, S3GetParams } from "../../../lib/s3config";
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
    case "DELETE":
      deleteAccount(req, res);
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

async function deleteAccount(req: NextApiRequest, res: NextApiResponse<any>) {
  const currentUser = await isAuthentificated(req, res);

  try {
    const client = await clientPromise;
    const db = client.db("the_archiver");

    // Récupération de la liste des livres de l'utilisateur
    let usersBooksArray = [] as bookref[];

    const usersBooks = await db
      .collection("books")
      .find({ ownerId: currentUser?._id })
      .forEach(function (book) {
        usersBooksArray.push(book as bookref);
      });

    // delete book from S3
    usersBooksArray.forEach(async (b: bookref) => {
      const paramS3: S3GetParams = {
        Bucket: bucketName,
        Key: b?.filename || "",
      };

      try {
        await s3.deleteObject(paramS3).promise();
      } catch (err: any) {
        console.log(err);
      }
    });

    // delete from mongoDB
    await db.collection("books").deleteMany({ ownerId: currentUser?._id });
    await db.collection("users").deleteOne({ _id: currentUser?._id });

    succed(res, "Account deleted");
  } catch (error: any) {
    serverError(res, error);
  }
}
