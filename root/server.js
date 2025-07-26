require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
  });

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

app.get("/api/service", (req, res) => {
    const { type } = req.query;

    if (!type) {
        return res.status(400).json();
    }

    db.query("SELECT * FROM service WHERE service_type_id = ?", [type], (err, results) => {
        if (err) {
            return res.status(500).json();
        }
        res.json(results);
    });
});

app.get("/api/service/:serviceId", (req, res) => {
    const serviceId = req.params.serviceId;

    db.query("SELECT * FROM service WHERE service_id = ?", [serviceId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "ฐานข้อมูลมีปัญหา" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "ไม่เจอ Service" });
        }

        res.json(results[0]);
    });
});

app.post("/api/bookings", (req, res) => {
    const { user_id, service_id,booking_date, booking_time, status } = req.body;
    if (!user_id || !service_id ||!booking_date || !booking_time, status === undefined) {
        return res.status(400).json({ error: "ข้อมูลไม่ครบ" });
    }

    
    createBookingId((booking_id) => {
        const query = `INSERT INTO bookings (booking_id, user_id, service_id,booking_date, booking_time,status) VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(query, [booking_id, user_id, service_id,booking_date, booking_time,status], (err, results) => {
            if (err) {
                console.error("ฐานข้อมูลมีปัญหา:", err);
                return res.status(500).json({ error: "Error" });
            }

            res.status(201).json({ message: "เพิ่มข้อมูลสำเร็จ", booking_id: booking_id });
        });
    });
});

function createBookingId(callback) {
    const query = "SELECT MAX(booking_id) AS last_id FROM bookings";

    db.query(query, (err, results) => {
        if (err) {
            console.error("ฐานข้อมูลมีปัญหา:", err);
            return callback(1);
        }
        let lastId = results[0].last_id;
        let newId = lastId ? lastId + 1 : 1;
        callback(newId);
    });
}

app.get("/api/bookings/user/:userId", (req, res) => {
    const userId = req.params.userId;

    db.query(
        "SELECT b.*, s.service_name, s.price FROM bookings b JOIN service s ON b.service_id = s.service_id WHERE b.user_id = ?",
        [userId],
        (err, results) => {
            if (err) {
                console.error("ฐานข้อมูลมีปัญหา:", err);
                return res.status(500).json({ error: "ฐานข้อมูลมีปัญหา" });
            }
            res.json(results);
        }
    );
});

app.post(
  "/api/login",
  [body("user_name").notEmpty().withMessage("กรุณาใส่ชื่อผู้ใช้"),body("password").notEmpty().withMessage("กรุณาใส่รหัสผ่าน"),],
  async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }
      const { user_name, password } = req.body;
      try {
          db.query("SELECT * FROM user WHERE user_name = ?", [user_name], async (err, results) => {
              if (err) {
                  console.error("Database error:", err);
                  return res.status(500).json({ error: "Database error" });
              }

              if (results.length === 0) {
                  return res.status(401).json({ error: "ชื่อผู้ใช้ไม่ถูกต้อง" });
              }

              const user = results[0];

              if (password !== user.password) {
                  return res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
              }
              const userId = user.user_id;
              console.log("JWT_SECRET:", process.env.JWT_SECRET);
              const token = jwt.sign(
                { userId: userId },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            res.json({ 
                message: "เข้าสู่ระบบสำเร็จ", 
                token: token, 
                user_id: user.user_id, 
                user_name: user.user_name});
          });
      } catch (error) {
          console.error("Error:", error);
          res.status(500).json({ error: "เกิดข้อผิดพลาดในการล็อกอิน" });
      }
  }
);


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});