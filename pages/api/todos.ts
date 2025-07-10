import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebaseAdmin";

type Todo = {
  id: string;
  title: string;
  createdAt: Date;
};

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Todo[] | Todo | ErrorResponse>
) {
  try {
    const todosRef = db.collection("todos");

    if (req.method === "GET") {
      const snapshot = await todosRef.orderBy("createdAt", "desc").get();

      const todos: Todo[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          createdAt: data.createdAt.toDate?.() ?? new Date(),
        };
      });

      return res.status(200).json(todos);
    }

    if (req.method === "POST") {
      const { title } = req.body;
      if (!title || typeof title !== "string") {
        return res.status(400).json({ message: "Invalid title" });
      }

      const docRef = await todosRef.add({
        title,
        createdAt: new Date(),
      });

      return res.status(201).json({
        id: docRef.id,
        title,
        createdAt: new Date(),
      });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("🔥 API /api/todos error:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "Unknown server error" });
  }
}
