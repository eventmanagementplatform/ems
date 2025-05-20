const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Route files
const userRoutes = require('./routes/userRoutes');
const organizerRoutes = require('./routes/organizerRoutes');
const loginRoutes = require('./routes/loginRoutes');
const orgloginUser=require('./routes/orgloginRoutes');


dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/organizers', organizerRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/orgauth', orgloginUser);


// Static route for accessing uploaded files
app.use('/uploads/logos', express.static('uploads/logos'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



