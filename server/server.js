const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require("./config/dbconnection")

//const migratePasswords = require('./utils/hashPasswords');
//migratePasswords();


const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const requestRoutes = require('./routes/requestRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());// Middleware to parse JSON requests
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000; // Define port

// Connect to MongoDB
db.dbconnect()




// Basic route
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

//routes


app.use('/user', userRoutes);
app.use('/transaction', transactionRoutes);
app.use('/request', requestRoutes);

// Centralized error handler (should be last)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) });