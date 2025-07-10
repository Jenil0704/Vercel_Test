import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Type guard to ensure `id` is a string
  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const todoRef = db.collection("todos").doc(id);

  try {
    if (req.method === "PUT") {
      const { title } = req.body;
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ message: "Invalid title" });
      }
      await todoRef.update({ title });
      return res.status(200).json({ id, title });
    }

    if (req.method === "DELETE") {
      await todoRef.delete();
      return res.status(200).json({ id });
    }

    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
