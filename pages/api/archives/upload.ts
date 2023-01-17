// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse, PageConfig } from "next";
import { Book } from "../model-ts";

// Database
import clientPromise from "../../../lib/mongodb";

import { isAuthentificated } from "../auth/auth";
import { wrongMethod, serverError, forbidden, succed } from "../defaultHandler";

// File handling
import { IncomingForm } from "formidable";
import { promises as fs } from "fs";

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  switch (req.method) {
    case "POST":
      uploadBook(req, res);
      break;
    default:
      wrongMethod(res);
  }
}

async function uploadBook(req: NextApiRequest, res: NextApiResponse<any>) {
  const currentUser = await isAuthentificated(req, res);

  const data: any = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  try {
    const client = await clientPromise;
    const db = client.db("the_archiver");
    let ObjectId = require("mongodb").ObjectId;

    // Validate data
    try {
      Book.parse(data.fields);
    } catch (e: any) {
      serverError(res, e);
      return;
    }

    // Save the book
    const bookFile = data.files.bookFile;
    const bookPath = bookFile.filepath;
    const pathToWriteBook =
      `public/` + Date.now() + bookFile.newFilename + ".epub";
    const book = await fs.readFile(bookPath);
    await fs.writeFile(pathToWriteBook, book);

    // Insert into the db
    await db.collection("books").insertOne({
      title: data.fields.title,
      ownerId: new ObjectId(currentUser?._id),
      filePath: pathToWriteBook,
      uploadDate: Date.now(),
      shared: false,
    });

    succed(res, "book uploaded!");
  } catch (error: any) {
    serverError(res, error);
  }
}
