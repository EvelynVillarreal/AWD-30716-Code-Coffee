"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const userRouter = (0, express_1.Router)();
userRouter.get('/', user_controller_1.userController.getAll);
userRouter.get('/email/:email', user_controller_1.userController.getByEmail);
userRouter.get('/:id', user_controller_1.userController.getById);
userRouter.post('/', user_controller_1.userController.create);
userRouter.put('/:id', user_controller_1.userController.update);
userRouter.delete('/:id', user_controller_1.userController.remove);
exports.default = userRouter;
//# sourceMappingURL=user.routes.js.map