const fs = require("fs/promises");
const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");

const app = express();
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.get("/users", async (req, res) => {
  try {
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

// GET ME
app.get("/users/me", async (req, res) => {
  res.send({
    user: users[0],
  });
});

// GET PROJECTS
app.get("/projects", async (req, res) => {
  try {
    res.send(projects);
  } catch (e) {
    res.status(500).send(e);
  }
});

// CREATE
app.post("/projects", express.json(), async (req, res) => {
  try {
    const project = projects.find((project) => project.id === req.body.id);

    if (project) {
      //  project already exists
      res.status(404).send();
    }
    const newProject = req.body;
    projects.push(newProject);
    res.send({ project: newProject });
  } catch (e) {
    res.status(500).send(e);
  }
});

// DELETE
app.delete("/projects/:id", async (req, res) => {
  try {
    const project = projects.find(
      (project) => project.id === Number(req.params.id)
    );
    if (!project) {
      res.status(404).send();
    }
    projects = projects.filter((p) => p.id !== project.id);
    res.send(project);
  } catch (e) {
    res.status(500).send(e);
  }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`api running... (${PORT})`));

const users = [
  { id: 1, name: "Tommy", age: "31" },
  { id: 2, name: "Mike", age: "27" },
  { id: 3, name: "Donald", age: "73" },
  { id: 4, name: "Bill", age: "64" },
];

let projects = [
  { id: 1, name: "Project 1", status: "IN_PROGRESS" },
  { id: 2, name: "Project 2", status: "FAILED" },
  { id: 3, name: "Project 3", status: "IN_PROGRESS" },
  { id: 4, name: "Project 4", status: "DONE" },
];
