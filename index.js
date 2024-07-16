const express = require("express");

const app = express();

const MongoClient = require("mongodb");

const port = 5000;

app.use(express.json());

const { ObjectId } = require("mongodb");

require("dotenv").config();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  next();
});

const mongo_url = process.env.mongo_url;
console.log(mongo_url)

async function main() {
  const client = new MongoClient.MongoClient(mongo_url);
  await client.connect();
  console.log("Connected successfully to server");
  return client;
}

// Root (homepage) GET method
app.get("/", function (req, res) {
  res.send("ABC SCHOOL STUDENT REGISTRATION");
});

app.get("/home/", async (req, res) => {
  const client = await main();
  const stuData = await client
    .db("new-mongo1")
    .collection("students")
    .find()
    .toArray();
  res.send(stuData);
  client.close();
});

app.post("/home/", async (req, res) => {
  const client = await main();
  const stuData = await client
    .db("new-mongo1")
    .collection("students")
    .insertOne(req.body);
  console.log(stuData);
  res.send(stuData);
  client.close();
});

app.post("/update/", async (req, res) => {
  const client = await main();
  /*  console.log(req.body)
  const stuData = await client.db("new-mongo1").collection("students").find({"_id":req.body._id}).toArray() */
  const id = new ObjectId(req.body._id);
  delete req.body._id;
  const result = await client
    .db("new-mongo1")
    .collection("students")
    .updateOne({ _id: id }, { $set: req.body });
  if (result.modifiedCount === 0) {
    return res.status(404).send({ message: "Document not found" });
  }
  res.send("student detail updated successfully");
  /* console.log(stuData);
  res.send(stuData); */
  client.close();
});

app.delete("/home/", async (req, res) => {
  const client = await main();
  // const id = req.params.id;
  const deleteDetail = await client
    .db("new-mongo1")
    .collection("students")
    .findOneAndDelete(req.body);
  deleteDetail
    ? res.send("student detail deleted successfully")
    : res.send("detail not found");
  client.close();
});

app.listen(port, () => console.log("Server started on port:", port));
