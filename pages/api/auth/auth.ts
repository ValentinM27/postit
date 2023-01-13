import type { NextApiRequest, NextApiResponse } from "next";
import { serverError, forbidden } from "../defaultHandler";

// Database
import clientPromise from "../../../lib/mongodb";
import { user } from "../../model-ts";

// JWT conf
const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
  throw new Error("Please add a JWT_SECRET to .env.local");
}

const JWT_SECRET: string = process.env.JWT_SECRET;

/**
 * Permet de définir si l'utilisateur est authentifié
 * @return Return current user if authentification confirmed
 */
export async function isAuthentificated(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Récupération du token
    const token: string = req?.headers?.authorization?.split(" ")[1] || "";
    const decodedToken: any = jwt.verify(token, JWT_SECRET);

    if (decodedToken?.userId === undefined) {
      forbidden(res, "Wrong JWT format");
    }

    const userId = decodedToken.userId;

    // Récupération de l'utilisateur en base
    const client = await clientPromise;
    const db = client.db("postit");
    let ObjectId = require("mongodb").ObjectId;

    const existingUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!existingUser) {
      forbidden(res, "Wrong credentials");
      return;
    }

    return {
      _id: existingUser._id,
      firstname: existingUser.firstname,
      lastname: existingUser.lastname,
      email: existingUser.email,
    };
  } catch (e: any | string) {
    serverError(res, e);
  }
}
