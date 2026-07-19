const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const interviewRoutes = require('./routes/interview');
connectDB();
const app = express();
app.use(cors({
	origin: '*'
}));
app.use(express.json());
app.use('/api/interview/', interviewRoutes);
app.use('/api/auth/', authRoutes);
app.get('/test', (req, res) => {
	res.json({message: 'Server is working'});
});
app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`)
})
