import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';

// forcing nodejs to use google or cloudflare's dns server
import dns from "dns";
import userRouter from './routes/user.routes.js';
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is live...');
});

// ROUTES
app.use('/api/user', userRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App is running on PORT: ${PORT}`);
    connectDB();
});

