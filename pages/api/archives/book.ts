// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { book } from "../../model-ts";

// Database
import clientPromise from "../../../lib/mongodb";

import { isAuthentificated } from "../auth/auth";
import {
  wrongMethod,
  serverError,
  notFound,
  forbidden,
} from "../defaultHandler";

import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  switch (req.method) {
    case "GET":
      getBook(req, res);
      break;
    default:
      wrongMethod(res);
  }
}

const getBook = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const currentUser = await isAuthentificated(req, res);
  const client = await clientPromise;
  const db = client.db("the_archiver");

  // Récupération des paramètres dans l'url de la requête
  const { query } = req;
  const { id } = query;

  try {
    let ObjectId = require("mongodb").ObjectId;

    const bookRef = await db
      .collection("books")
      .findOne({ _id: new ObjectId(id) });

    if (!bookRef) {
      notFound(res, "book");
      return;
    }

    if (!bookRef?.ownerId.equals(new ObjectId(currentUser?._id))) {
      forbidden(res, "Not allowed");
      return;
    }

    // Transfer the book
    const book = fs.readFileSync(bookRef?.filePath);
    res.setHeader("Content-Type", "application/epub+zip");
    res.setHeader("Content-Disposition", `attachment; filename=book.epub`);

    return res.status(200).send(book);
  } catch (error: any) {
    serverError(res, error);
  }
};
