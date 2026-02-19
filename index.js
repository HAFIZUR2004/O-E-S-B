const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();   // ✅ আগে app declare
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@cluster0.vhuhoc2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB ✅");

    const db = client.db(process.env.DB_NAME);

    const authRoutes = require('./routes/authRoutes')(db);

    app.use('/api/auth', authRoutes); // ✅ final route হবে /api/auth/register

    app.get('/', (req, res) => {
      res.send('Server Running ✅');
    });

  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

run();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
