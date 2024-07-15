const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const mysql = require("mysql2");
const moragan = require("morgan");


//create a new connection


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "gofood",
});

db.connect((err) => {
  if (err) throw err;
  else console.log("connecting to database");
});



module.exports = db;