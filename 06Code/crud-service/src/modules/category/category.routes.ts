import { Router } from 'express';
import { categoryController } from './category.controller';

const categoryRouter = Router();

categoryRouter.get('/', categoryController.getAll);
categoryRouter.get('/:id', categoryController.getById);
categoryRouter.post('/', categoryController.create);
categoryRouter.put('/:id', categoryController.update);
categoryRouter.delete('/:id', categoryController.remove);

export default categoryRouter;
