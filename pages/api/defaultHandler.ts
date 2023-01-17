// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse } from "next";

export function wrongMethod(res: NextApiResponse<any>) {
  res.status(403).json({ error: "Wrong method" });
}

export function serverError(res: NextApiResponse<any>, e: string | Error) {
  res.status(500).json({ error: e });
}

export function forbidden(res: NextApiResponse<any>, e: string | Error) {
  res.status(403).json({ error: e });
}

export function succed(res: NextApiResponse<any>, e: string) {
  res.status(200).json({ message: e });
}

export function notFound(res: NextApiResponse<any>, e: string) {
  res.status(404).json({ message: e + " not found" });
}
