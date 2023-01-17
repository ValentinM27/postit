// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { book } from "../model-ts";

// Database
import clientPromise from "../../../lib/mongodb";

import { isAuthentificated } from "../auth/auth";
import { wrongMethod, serverError } from "../defaultHandler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  switch (req.method) {
    case "GET":
      getBooksRef(req, res);
      break;
    default:
      wrongMethod(res);
  }
}

async function getBooksRef(req: NextApiRequest, res: NextApiResponse<any>) {
  const currentUser = await isAuthentificated(req, res);
  const client = await clientPromise;
  const db = client.db("the_archiver");

  try {
    let ObjectId = require("mongodb").ObjectId;

    const booksRefArray = [] as book[];
    await db
      .collection("books")
      .find({ ownerId: new ObjectId(currentUser?._id) })
      .forEach(function (book) {
        booksRefArray.push(book as book);
      });

    res.status(200).json({ booksRef: booksRefArray });
  } catch (e: any) {
    serverError(res, e);
  }
}
