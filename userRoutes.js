const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const router = express.Router();

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = 'ICT035WebCreation';

async function connectToCollection() {
  await client.connect();
  const db = client.db(dbName);
  return db.collection('Users');
}

// Create User (POST /api/Users)
router.post('/Users', async (req, res) => {
  const { name, email } = req.body;

  try {
    const collection = await connectToCollection();
    const result = await collection.insertOne({ name, email });

    if (result.insertedId) {
      res.status(201).json({ message: 'User added successfully', data: { name, email, _id: result.insertedId } });
    } else {
      res.status(500).json({ message: 'Failed to add user, no insertedId' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to add user', error: err.message });
  }
});

// Read All Users (GET /api/Users)
router.get('/Users', async (req, res) => {
  try {
    const collection = await connectToCollection();
    const users = await collection.find({}).toArray();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

// Read a Single User (GET /api/Users/:id)
router.get('/Users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const collection = await connectToCollection();
    const user = await collection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
});

// Update User (PUT /api/Users/:id)
router.put('/Users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const collection = await connectToCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, email } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
});

// Delete User (DELETE /api/Users/:id)
router.delete('/Users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const collection = await connectToCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
});

module.exports = router;
