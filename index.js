const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

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
let client;

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log("Connected successfully to MongoDB server");
  }
  return client;
}

app.get("/", (req, res) => {
  res.send("ABC SCHOOL STUDENT REGISTRATION");
});

app.get("/home/", async (req, res) => {
  try {
    const client = await connectToMongo();
    const stuData = await client.db("new-mongo1").collection("students").find().toArray();
    res.send(stuData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post("/home/", async (req, res) => {
  try {
    const client = await connectToMongo();
    const stuData = await client.db("new-mongo1").collection("students").insertOne(req.body);
    res.send(stuData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post("/update/", async (req, res) => {
  try {
    const client = await connectToMongo();
    const id = new ObjectId(req.body._id);
    delete req.body._id;
    const result = await client.db("new-mongo1").collection("students").updateOne({ _id: id }, { $set: req.body });
    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: "Document not found" });
    }
    res.send({ message: "Student detail updated successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete("/home/", async (req, res) => {
  try {
    const client = await connectToMongo();
    const deleteDetail = await client.db("new-mongo1").collection("students").findOneAndDelete(req.body);
    if (!deleteDetail.value) {
      return res.status(404).send({ message: "Detail not found" });
    }
    res.send({ message: "Student detail deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.listen(port, () => console.log("Server started on port:", port));
