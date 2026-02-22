import express from 'express';
import { getUserById, login, register } from '../controllers/user.controller.js';
const userRouter = express.Router();
import isAuthenticated from '../middlewares/isAuthenticated.js'

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/data', isAuthenticated, getUserById);

export default userRouter;