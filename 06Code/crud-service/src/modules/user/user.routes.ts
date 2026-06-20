import { Router } from 'express';
import { userController } from './user.controller';

const userRouter = Router();

userRouter.get('/', userController.getAll);
userRouter.get('/email/:email', userController.getByEmail);
userRouter.get('/:id', userController.getById);
userRouter.post('/', userController.create);
userRouter.put('/:id', userController.update);
userRouter.delete('/:id', userController.remove);

export default userRouter;
