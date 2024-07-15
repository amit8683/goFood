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
require("../config/config");


//signup user
const registerController=async(req,res) =>{
  try{
  console.log("register")
    const {firstName,lastName,address,pinCode,phonenumber,email,password} = req.body;
    db.query("select email from customer where email=?",[email],async (err, results) => {
        if (err) {
        console.log("error");
        } else {
        if (results && results.length > 0) {
            res.json({
            errors: "That email is already in use ",
            });
        } else {
          // Hash the password only if the email is not in use and passwords match
          let hashPassword = await bcrypt.hash(password, 8); // encrypting the password using bcrypt

          // it doesnt matter what is the order of keys just key should match with the column name
            db.query( "insert into customer set ?",{first_name: firstName,last_name: lastName,address: address,
                zip_code: pinCode,phone_number: phonenumber,password: hashPassword,email: email,role: role,
            },
            (err, results) => {
                if (err) {
                console.log(err);
                } else {
                res.json({
                    message: "user registered",
                });
            }
            }
          );
        }
      }
    }
  )
  }catch (err) {
      
  }
};

module.exports={registerController}