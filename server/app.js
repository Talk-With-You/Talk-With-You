const express = require('express');
const cors = require('cors');
const app = express();

const config = require("./config");
const post = require("./router/post");
const reply = require('./router/reply');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/post", post);
app.use("/reply", reply);
app.listen(config.port, "127.0.0.1", () => {
    console.log("http://127.0.0.1:8011");
})