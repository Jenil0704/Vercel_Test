import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const todosRef = db.collection("todos");

    if (req.method === "GET") {
      const snapshot = await todosRef.orderBy("createdAt", "desc").get();
      const todos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return res.status(200).json(todos);
    }

    if (req.method === "POST") {
      const { title } = req.body;
      if (!title || typeof title !== "string") {
        return res.status(400).json({ message: "Invalid title" });
      }
      const doc = await todosRef.add({
        title,
        createdAt: new Date(),
      });
      return res.status(201).json({ id: doc.id, title });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error: any) {
    console.error("🔥 API /api/todos error:", error);
    return res.status(500).json({ message: error.message });
  }
}
