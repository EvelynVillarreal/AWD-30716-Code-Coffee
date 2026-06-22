"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_photo_controller_1 = require("./product-photo.controller");
const productPhotoRouter = (0, express_1.Router)();
productPhotoRouter.get('/product/:productId', product_photo_controller_1.productPhotoController.getByProductId);
productPhotoRouter.post('/', product_photo_controller_1.productPhotoController.create);
productPhotoRouter.delete('/:id', product_photo_controller_1.productPhotoController.remove);
exports.default = productPhotoRouter;
//# sourceMappingURL=product-photo.routes.js.map