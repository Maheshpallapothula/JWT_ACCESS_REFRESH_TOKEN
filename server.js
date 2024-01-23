const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv/config');
const bodyParser = require('body-parser');


/* Intializing Cors */
const cors = require('cors');
app.use(cors());

/* body-parser */
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.listen(process.env.port);

//**configuring users for logging. */
const users = [{
    userName: 'mahesh',
    password: "Passd@1234"
}];


// Middleware to check if the request has a valid access token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
  
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
};

// Login endpoint to issue initial access and refresh tokens
app.post('/login', (req, res) => {
    console.log("loginnnn");
    const { userName, password } = req.body;
  
    const user = users.find((u) => u.userName === userName && u.password === password);

    console.log("userbnsgfbfbfb", user);
  
    // if (!user) return res.status(401).send("Failure to get user's.");
  
    const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m', // Access token expires in 15 minutes
    });
  
    const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '48h'});
  
    res.status(200).json({ accessToken, refreshToken });
});


app.get("", (res,req) => {
    console.log("Hii Jwt is On Up.!");
    
})


app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

