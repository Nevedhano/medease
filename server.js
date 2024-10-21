const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an instance of express
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/medease', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("db connected");
    })
    .catch((err) => {
        console.log(err);
    });

// Define the schema
const billschema = new mongoose.Schema({
    patientName: String,
    prescription: String,
    registrationNumber: String,
    scanType: String,  // Store the selected scan type here
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the model
const Bill = mongoose.model('Bill', billschema);

// Route to store patient details (Step 1)
app.post('/billing', async (req, res) => {
    const { patientName, prescription, registrationNumber } = req.body;

    try {
        const newBill = new Bill({
            patientName,
            prescription,
            registrationNumber,
            scanType: ''  // Initially empty, will be updated later
        });
        await newBill.save();
        res.status(201).json({ billId: newBill._id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Route to update scan type (Step 2)
app.post('/submitScan', async (req, res) => {
    const { billId, scanType } = req.body;

    if (!billId || !scanType) {
        return res.status(400).json({ message: 'Bill ID and scan type are required' });
    }

    try {
        const updatedBill = await Bill.findByIdAndUpdate(billId, { scanType }, { new: true });
        res.status(200).json(updatedBill);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to update scan type' });
    }
});


// Start the server


// Route to fetch all bills (ensure `Bill` is used instead of `billmodel`)
app.get('/billing', async (req, res) => {
  try {
    const bills = await Bill.find();  // Fetch all bills from the database
    res.json(bills);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
