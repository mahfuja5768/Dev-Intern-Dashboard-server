const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const projectCollection = client
      .db("Dev-Intern-Dashboard")
      .collection("projects");

    //post project
    app.post("/projects", async (req, res) => {
      try {
        const project = req.body;
        const result = await projectCollection.insertOne(project);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    //get projects
    app.get("/projects", async (req, res) => {
      try {
        const result = await projectCollection
          .find()
          .sort({ date: -1 })
          .toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    //get a project
    app.get("/projects/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await projectCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    //update a projects
    app.patch("/update-project/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const project = req.body;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            project_name: project.project_name,
            download_url: project.download_url,
            author: project.author,
          },
        };
        console.log(updatedDoc);
        const result = await projectCollection.updateOne(filter, updatedDoc);
        console.log(result);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    //delete projects
    app.delete("/projects/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await projectCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Dev-Intern-Dashboard is running....");
});

app.listen(port, (req, res) => {
  console.log(`Dev-Intern-Dashboard is running on ${port}`);
});
