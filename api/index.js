import express from "express";
import { PostgresInterface } from "./postgresInterface";
import { connectionString } from "../config";

const router = express.Router();
const pgi = new PostgresInterface(connectionString);

router.get("/:table", async (req, res) => {
  const data = await pgi.viewAll(req.params.table);
  res.send({ data: data });
});

router.get("/:search/:by", async (req, res) => {
  const { search, by } = req.params;
  const results = await pgi.searchBook(search, by);
  console.log(results);
  res.send(results);
});

export default router;
