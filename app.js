const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(express.json());

var corsOptions = {
    origin: '*',
    credentials: true };

app.use(cors(corsOptions));
app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.post("/user/add", (req, res) => {
  const existUsers = getUserData();

  const userData = req.body;

  const findExist = existUsers.find(
    (user) => user.name === userData.name
  );
  if (findExist) {
    return res.status(409).send({ error: true, msg: "username already exist" });
  }

  existUsers.push(...userData);

  saveUserData(existUsers);
  res.send({ success: true, msg: "User data added successfully" });
});

app.get("/user/list", (req, res) => {
  const users = getUserData();
  res.send(users);
});

app.patch("/user/update/:id", (req, res) => {
  const id = req.params.id;

  const userData = req.body;

  const existUsers = getUserData();

  const findExist = existUsers.find((user) => user.id === id);
  if (!findExist) {
    return res.status(409).send({ error: true, msg: "username not exist" });
  }

  const updateUser = existUsers.filter((user) => user.id !== id);

  updateUser.push(userData);

  saveUserData(updateUser);

  res.send({ success: true, msg: "User data updated successfully" });
});

app.delete("/user/delete/:id", (req, res) => {
  const id = req.params.id;

  const existUsers = getUserData();

  const filterUser = existUsers.filter((user) => user.id !== id);

  if (existUsers.length === filterUser.length) {
    return res
      .status(409)
      .send({ error: true, msg: "username does not exist" });
  }

  saveUserData(filterUser);

  res.send({ success: true, msg: "User removed successfully" });
});

/* util functions */

const saveUserData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("users.json", stringifyData);
};

const getUserData = () => {
  const jsonData = fs.readFileSync("users.json");
  return JSON.parse(jsonData);
};

/* util functions ends */

app.listen(3001, () => {
  console.log("Server runs on port 3001");
});
