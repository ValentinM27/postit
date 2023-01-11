// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { user } from "../../model-ts";

import { isAuthentificated } from "../auth/auth";
import { wrongMethod } from "../defaultHandler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<user>
) {
  switch (req.method) {
    case "GET":
      getUser(req, res);
      break;
    default:
      wrongMethod(res);
  }
}

async function getUser(req: NextApiRequest, res: NextApiResponse<user>) {
  res.status(200).json((await isAuthentificated(req, res)) as user);
}
