// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
// Database
import clientPromise from "../../../lib/mongodb";
import { s3, bucketName, S3GetParams } from "../../../lib/s3config";

import { isAuthentificated } from "../auth/auth";
import {
  wrongMethod,
  serverError,
  notFound,
  forbidden,
  succed,
} from "../defaultHandler";

import { Epubcfi } from "../model-ts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  switch (req.method) {
    case "GET":
      getBook(req, res);
      break;
    case "DELETE":
      deleteBook(req, res);
      break;
    case "PUT":
      updateEpubcfi(req, res);
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

    // Retrieve from S3
    const paramS3: S3GetParams = {
      Bucket: bucketName,
      Key: bookRef?.filename,
    };

    s3.getObject(paramS3, (err: any, data: any) => {
      if (err) {
        serverError(res, err);
        return;
      }

      // Transfer the book
      res.setHeader("Content-Type", "application/epub+zip");
      res.setHeader("Content-Disposition", `attachment; filename=book.epub`);

      return res.status(200).send(data.Body);
    });
  } catch (error: any) {
    serverError(res, error);
  }
};

async function deleteBook(req: NextApiRequest, res: NextApiResponse<any>) {
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

    // Delete from MongoDB
    await db.collection("books").deleteOne({ _id: new ObjectId(bookRef._id) });

    // Delete from S3
    const paramS3: S3GetParams = {
      Bucket: bucketName,
      Key: bookRef?.filename,
    };

    s3.deleteObject(paramS3, (err: any, data: any) => {
      if (err) {
        serverError(res, err);
        return;
      }

      succed(res, "book deleted");
    });
  } catch (error: any) {
    serverError(res, error);
  }
}

async function updateEpubcfi(req: NextApiRequest, res: NextApiResponse<any>) {
  const currentUser = await isAuthentificated(req, res);
  const client = await clientPromise;
  const db = client.db("the_archiver");

  // Récupération des paramètres dans l'url de la requête
  const { query } = req;
  const { id } = query;

  try {
    let ObjectId = require("mongodb").ObjectId;

    // Validate book data
    try {
      Epubcfi.parse(req.body);
    } catch (e: any) {
      serverError(res, e);
    }

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

    // Update Epubcfi in mongo
    await db.collection("books").updateOne(
      { _id: new ObjectId(bookRef._id) },
      {
        $set: {
          epubcfi: req?.body?.epubcfi,
        },
      },
    );

    succed(res, "epubcfi updated");
  } catch (error: any) {
    serverError(res, error);
  }
}
