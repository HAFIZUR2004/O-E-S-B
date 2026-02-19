const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // REGISTER (already আছে)
  router.post('/register', async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Missing fields" });
      }

      let collection =
        role === "student"
          ? db.collection("students")
          : db.collection("teachers");

      const existingUser = await collection.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "User already exists" });

      await collection.insertOne({
        name,
        email,
        password,
        role,
        createdAt: new Date()
      });

      res.json({ message: "Registered Successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ================= LOGIN ROUTE =================
  router.post('/login', async (req, res) => {
    try {
      const { email, password, role } = req.body;

      if (!email || !password || !role) {
        return res.status(400).json({ message: "Missing fields" });
      }

      let collection =
        role === "student"
          ? db.collection("students")
          : db.collection("teachers");

      const user = await collection.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      if (user.password !== password) {
        return res.status(400).json({ message: "Wrong password" });
      }

      res.json({
        message: "Login successful",
        user: {
          name: user.name,
          email: user.email,
          role: user.role
        }
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
// jdfkffjdlk