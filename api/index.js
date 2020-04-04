import express from "express";
import { PostgresInterface } from "./postgresInterface";
import { connectionString } from "../config";

const router = express.Router();
const pgi = new PostgresInterface(connectionString);

router.get("/", (req, res) => {
  res.send(["hello", "world"]);
});

router.get("/browseBooks", async (req, res) => {
  const data = await pgi.browseBook();
  res.send(data);
});

router.get("/viewAll/:table", async (req, res) => {
  const data = await pgi.viewAll(req.params.table);
  res.send({ data: data });
});

router.get("/searchBook/:search/:by", async (req, res) => {
  const { search, by } = req.params;
  const results = await pgi.searchBook(search, by);
  console.table(results);
  res.send(results);
});

router.get("/authenticateLogin/:user/:pass", async (req, res) => {
  const { user, pass } = req.params;
  const results = await pgi.authenticateLogin("patron", user, null, pass);
  console.log(results);
  res.send(results);
});

export default router;
