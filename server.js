const express = require("express");
const app = express();
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
const cors = require("cors");
app.use(cors());
require("dotenv/config");
const jwt = require("jsonwebtoken");

const users = [
  {
    id: 1234,
    userName: "mahesh",
    password: "Passd@1234",
  },
];

app.post("/login", (req, res) => {
  const { userName = "", password = "" } = req.body;

  const user = users.find((user) => {
    return user.userName === userName && user.password === password;
  });

  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m", // Access token expires in 15 minutes
    }
  );

  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "48h" }
  );

  res.status(200).json({ accessToken, refreshToken });
});

// Middleware to check if the request has a valid access token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.sendStatus(401);

  jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post("/renewAccessToken", (req, res) => {
  const refreshToken = req.headers["refreshtoken"];
  console.log("🚀 ~ app.post ~ refreshToken:", refreshToken);

  if (!refreshToken) return res.status(401).send("Invalid refresh token.");

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid refresh token.");

    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.json({ accessToken });
  });
});

app.listen(process.env.PORT || 3000);
