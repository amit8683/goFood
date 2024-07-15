const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const mysql = require("mysql2");
const port = 3000;

const app = express();

app.use(cors());

app.use(express.json());


//create a new connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "fooddeliveryupdate",
});

db.connect((err) => {
  if (err) throw err;
  else console.log("connecting to database");
});



app.use(express.urlencoded({ extended: false }));



app.use(express.json());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, address, pinCode, phoneNumber, email, password, role } = req.body;



  // Check email across relevant tables
  const checkEmailQuery = `
    SELECT email FROM (
      SELECT email FROM customer
      UNION ALL
      SELECT email FROM admin
      UNION ALL
      SELECT email FROM restaurant
    ) AS all_emails
    WHERE email = ?
  `;

  db.query(checkEmailQuery, [email], async (err, results) => {
    if (err) {
      console.error("Error checking email:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results && results.length > 0) {
      return res.status(400).json({ message: "That email is already in use" });
    }

    // Hash the password securely (using at least 12 rounds of salting)
    const hashPassword = await bcrypt.hash(password, 12);

    let insertQuery;
    const insertValues = {
      firstName: firstName,
      lastName: lastName,
      address: address,
      zipcode: pinCode,
      password: hashPassword,
      email: email,
      role: "0"
    };

    switch (role) {
      case "0":
        insertQuery = `INSERT INTO customer SET ?`;
        break;
      case "1":
        return res.status(403).json({ message: "Unauthorized signup for admin role" });
      case "2":
        return res.status(403).json({ message: "Unauthorized signup for restaurant role" });
    }

    db.query(insertQuery, insertValues, (err, results) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      res.json({ message: "User registered successfully" });
    });
  });
});


app.post("/login", async (req, res) => {
  let success = false;
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ success, errors: "Please enter the email" });
    }

    if (!password) {
      return res.status(400).json({ success, errors: "Please enter the password" });
    }

    // Check email in both customer and admin tables using UNION ALL
    const checkEmailQuery = `
      SELECT *
      FROM (
        SELECT  email, password, role
        FROM customer
        UNION ALL
        SELECT  email, password, role
        FROM admin
      ) AS users
      WHERE email = ?
    `;

    db.query(checkEmailQuery, [email], async (err, results) => {
      if (err) {
        console.error("Error checking email:", err);
        return res.status(500).json({ success, errors: "Internal server error" });
      }

      if (!results || results.length === 0) {
        // No matching user found
        return res.status(401).json({ success, errors: "Email or password is incorrect" });
      }

      const user = results[0]; // Assuming the first result is the matching user

      if (!(await bcrypt.compare(password, user.password))) {
        // Password doesnt match
        return res.status(401).json({ success, errors: "Email or password is incorrect" });
      }

      success = true;
      const id = user.custId; // Assuming user has an `id` field

      // Generate JWT token based on user role (enhance security)
      const token = jwt.sign({ id, role: user.role }, "mysupersecretpassword", {
        expiresIn: "90d",
      });

      console.log("The token is:", token);

      const cookieOptions = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        httpOnly: true,
      };

      res.cookie("token", token, cookieOptions);
      res.json({ success, token });
      console.log("Login completed");
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ success, errors: "Internal server error" });
  }
});


//Getting all restaurant
app.get("/getrest", (req, res) => {
  var query = "select * from restaurant";
  db.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});



app.post('/product', async (req, res) => {
  const id = req.body.id;

  const sql1 = `
    SELECT fi.*, r.*
    FROM restaurant_has_food rhf
    JOIN fooditem fi ON rhf.ItemId = fi.itemId
    JOIN restaurant r ON rhf.rId = r.rId
    WHERE rhf.rId = ?
  `;

  const sql2 = `
    SELECT DISTINCT fi.categoryName
    FROM restaurant_has_food rhf
    JOIN fooditem fi ON rhf.ItemId = fi.itemId
    WHERE rhf.rId = ?
  `;

  try {
    // Execute both queries concurrently
    const [foodItemsResult, categoriesResult] = await Promise.all([
      executeQuery(sql1, [id]),
      executeQuery(sql2, [id])
    ]);

    // Map results to desired format
    const foodItems = foodItemsResult.map(item => ({
      itemId: item.itemId,
      categoryName: item.categoryName,
      name: item.foodname,
      small: item.small,
      medium: item.medium,
      imagePath : item.imagePath
    }));


    const categories = categoriesResult.map(category => ({
      categoryName: category.categoryName,
    }));

    // Send separate arrays in response
    res.json([ foodItems, categories]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to execute SQL query
function executeQuery(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}


app.post("/myorderData", (req, res) => {
  let email = req.body.email;
  let orderData = req.body.order_data;
  let rId = req.body.rId;
  let custId;
  let orderID;

  // Query to get customer ID
  let query = "SELECT custId FROM customer WHERE email = ?";
  
  // Query to insert order
  let query1 = "INSERT INTO orders (custId, amount) VALUES (?, ?)";

  // Query to get order ID after insertion
  let query2 = "SELECT LAST_INSERT_ID() AS order_id";

  // Query to insert into orders_has_fooditem
  let query3 = "INSERT INTO orders_has_fooditem (itemId, order_id) VALUES (?, ?)";

  // Query to insert into orders_has_restaurant
  let query4 = "INSERT INTO orders_has_restaurant (rId, order_id) VALUES (?, ?)";

  db.query(query, [email], (err, results) => {
    if (!err) {
      custId = results[0].custId;
      let totalAmount = orderData.reduce((acc, item) => acc + item.price * item.qty, 0);

      db.query(query1, [custId, totalAmount], (err1, result1) => {
        if (err1) {
          console.error(err1);
          return res.status(500).json(err1);
        } else {
          db.query(query2, (err2, result2) => {
            if (err2) {
              console.error(err2);
              return res.status(500).json(err2);
            } else {
              orderID = result2[0].order_id;

              // Insert each food item into orders_has_fooditem
              let promises = orderData.map(item => {
                return new Promise((resolve, reject) => {
                  db.query(query3, [item.id, orderID], (err3, result3) => {
                    if (err3) {
                      console.error(err3);
                      reject(err3);
                    } else {
                      resolve();
                    }
                  });
                });
              });

              // Execute all promises for orders_has_fooditem
              Promise.all(promises)
                .then(() => {
                  // Insert into orders_has_restaurant
                  db.query(query4, [rId, orderID], (err4, result4) => {
                    if (err4) {
                      console.error(err4);
                      return res.status(500).json(err4);
                    } else {
                      // Send both custId and orderID in the response
                      return res.status(200).json({ message: "Order placed successfully!", custId: custId, orderID: orderID });
                    }
                  });
                })
                .catch(err => {
                  console.error(err);
                  return res.status(500).json(err);
                });
            }
          });
        }
      });
    } else {
      return res.status(500).json(err);
    }
  });
});



//---------------------payment-----------------\\ 


// Create Razorpay Order
const razorpay = new Razorpay({
  key_id: "rzp_test_Lvp0HfnQVczPpS",
  key_secret: "6nYojJ4y6x1O46QKSoGgz7zf",
});

//Payment API endpoint
app.post("/order", async (req, res) => {
  try {
    const { amount, currency, customer_id, receipt, orderID, rId } = req.body;

    const options = {
      amount,
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ error: "Failed to create order" });
    }

    const insertOrderQuery = `
      INSERT INTO payment (custId, amount, order_id, rId)
      VALUES (?, ?, ?, ?)
    `;
    const insertOrderValues = [
      customer_id,
      amount,
      orderID,
      rId,
    ];

    db.query(insertOrderQuery, insertOrderValues, (error, result) => {
      if (error) {
        console.error("Failed to save order to MySQL:", error);
        return res.status(500).json({ error: "Failed to save order to MySQL" });
      }
      res.json(order);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});



//check validation razorpay
app.post("/order/validate", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
 // Fetch order details 
  const getOrderQuery = "SELECT * FROM payment WHERE order_id = ?";
  db.query(getOrderQuery, [razorpay_order_id], async (error, results) => {
    if (error) {
      console.error("Error retrieving order details from MySQL:", error);
      return res.status(500).json({ msg: "Error validating transaction" });
    }

    if (results.length === 0) {
      return res.status(400).json({ msg: "Order not found" });
    }

    const { order_id, amount} = results[0];

    // Validate signature
    const sha = crypto.createHmac("sha256", "6nYojJ4y6x1O46QKSoGgz7zf");
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");
    if (digest !== razorpay_signature) {
      return res.status(400).json({ msg: "Transaction is not legit!" });
    }

    // Respond with success
    res.json({
      msg: "success",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount,
    });
  });
});


//----------------------------------------------\\

app.listen(3000, () => {
  console.log("Server running on port 3000");
});





