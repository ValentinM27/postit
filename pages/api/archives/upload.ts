// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse, PageConfig } from "next";
import { book, Book } from "../../model-ts";

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
    const bookFile = data.files.bookFile;
    const bookPath = bookFile.filepath;
    const pathToWriteBook =
      `public/books/` + Date.now() + bookFile.newFilename + ".epub";
    const book = await fs.readFile(bookPath);
    await fs.writeFile(pathToWriteBook, book);
    //store path in DB
    succed(res, "book uploaded!");
  } catch (error: any) {
    serverError(res, error);
  }
}
