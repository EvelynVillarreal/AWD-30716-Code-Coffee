"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const categoryRouter = (0, express_1.Router)();
categoryRouter.get('/', category_controller_1.categoryController.getAll);
categoryRouter.get('/:id', category_controller_1.categoryController.getById);
categoryRouter.post('/', category_controller_1.categoryController.create);
categoryRouter.put('/:id', category_controller_1.categoryController.update);
categoryRouter.delete('/:id', category_controller_1.categoryController.remove);
exports.default = categoryRouter;
//# sourceMappingURL=category.routes.js.map