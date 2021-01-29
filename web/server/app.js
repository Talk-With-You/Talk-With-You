const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.listen(8011, "192.168.0.102", () => {
    console.log("http://192.168.0.102:8011");
})