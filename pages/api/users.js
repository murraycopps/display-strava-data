//posts.js

import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("strava");

  const bodyObject = typeof req.body === "string" && req.body ? JSON.parse(req.body) : req.body;

  switch (req.method) {
    case "POST":
      await db.collection("users").insertOne(bodyObject);
      res.json({ status: 200, data: "posted" });
      break;
    case "GET":
      const allPosts = await db.collection("users").find({}).toArray();
      res.json({ status: 200, data: allPosts });
      break;
    case "DELETE":
      await db.collection("users").deleteOne({ "_id": new ObjectId(bodyObject._id) });
      res.json({ status: 200, data: "deleted" });
      break;
    case "PUT":
      const { _id, ...rest } = bodyObject;
      await db.collection("users").updateOne({ "_id": new ObjectId(_id) }, { $set: { ...rest } });
      res.json({ status: 200, data: "updated" });
      break;
  }
}
