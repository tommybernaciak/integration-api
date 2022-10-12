const fs = require("fs/promises");
const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");

const auth = async (req, res, next) => {
  try {
    const login = req.header("X-User-Name");
    const token = req.header("X-User-Token");

    const user = users.find((u) => u.token === token);
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = login;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please login" });
  }
};

const app = express();
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

//  ---------- API
app.get("/users", auth, async (req, res) => {
  try {
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

// GET ME
app.get("/users/me", auth, async (req, res) => {
  try {
    const user = users.find((u) => u.token === req.token);
    if (!user) {
      res.status(404).send();
    }
    res.send({ user });
  } catch (e) {
    res.status(500).send(e);
  }
});

// GET PROJECTS
app.get("/projects", auth, async (req, res) => {
  try {
    res.send(projects);
  } catch (e) {
    res.status(500).send(e);
  }
});

// CREATE
app.post("/projects", [auth, express.json()], async (req, res) => {
  try {
    const project = projects.find((project) => project.id === req.body.id);

    if (project) {
      //  project already exists
      res.status(404).send();
    }
    const newProject = req.body;
    if (newProject) {
      projects.push(newProject);
      res.send({ project: newProject });
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

// DELETE
app.delete("/projects/:id", auth, async (req, res) => {
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

// LOGIN
app.post("/users/login", express.json(), async (req, res) => {
  try {
    const { token } = req.body;
    const currentUser = users.find((u) => u.token === token);

    console.log(currentUser);

    if (!currentUser) {
      res.status(404).send();
    }
    res.send({ user: currentUser });
  } catch (e) {
    res.status(500).send(e);
  }
});

// LOGOUT
app.post("/users/logout", auth, async (req, res) => {
  try {
    console.log("logout");
  } catch (e) {
    res.status(500).send(e);
  }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`api running... (${PORT})`));

// ------ DATA
const users = [
  { id: 1, name: "Tommy", age: "31", login: "tommy", token: "12341234tommy" },
  { id: 2, name: "Mike", age: "27", login: "mike", token: "12341234mike" },
  { id: 3, name: "John", age: "73", login: "john", token: "12341234john" },
  { id: 4, name: "Bill", age: "64", login: "bill", token: "12341234bill" },
];

let projects = [
  { id: 1, name: "Project 1", status: "IN_PROGRESS" },
  { id: 2, name: "Project 2", status: "FAILED" },
  { id: 3, name: "Project 3", status: "IN_PROGRESS" },
  { id: 4, name: "Project 4", status: "DONE" },
];
