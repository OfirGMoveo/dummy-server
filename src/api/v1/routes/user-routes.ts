import {UserController} from './../controllers/user-controller';
import {UserValidator} from './../validators/user-validator';
import { Router } from 'express';

const userController = new UserController();
const userValidator = new UserValidator();

const userRoutes = Router();

userRoutes.post('/sign', userValidator.validateAuthUser, userController.signUser);
userRoutes.get('/profile-data', userValidator.validateAuthUser, userController.signUser);
export { userRoutes }