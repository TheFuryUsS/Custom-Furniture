// Fitxer principal que arrenca el servidor

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const designRoutes = require('./routes/designRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/designs', designRoutes);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Servidor funcionant al port ${PORT}`));