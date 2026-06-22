"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shippingConfigController = void 0;
const shipping_config_repository_1 = require("./shipping-config.repository");
const http_errors_1 = require("../../shared/errors/http.errors");
exports.shippingConfigController = {
    getAll: async (_req, res, next) => {
        try {
            const configs = await shipping_config_repository_1.shippingConfigRepository.findAll();
            res.json({ success: true, data: configs });
        }
        catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const config = await shipping_config_repository_1.shippingConfigRepository.findById(id);
            if (!config)
                throw new http_errors_1.NotFoundError('ShippingConfig');
            res.json({ success: true, data: config });
        }
        catch (error) {
            next(error);
        }
    },
    getByProvinces: async (req, res, next) => {
        try {
            const { baseProvince, destinationProvince } = req.query;
            const config = await shipping_config_repository_1.shippingConfigRepository.findByProvinces(baseProvince, destinationProvince);
            if (!config)
                throw new http_errors_1.NotFoundError('ShippingConfig');
            res.json({ success: true, data: config });
        }
        catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const config = await shipping_config_repository_1.shippingConfigRepository.create(req.body);
            res.status(201).json({ success: true, data: config });
        }
        catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const existing = await shipping_config_repository_1.shippingConfigRepository.findById(id);
            if (!existing)
                throw new http_errors_1.NotFoundError('ShippingConfig');
            const config = await shipping_config_repository_1.shippingConfigRepository.update(id, req.body);
            res.json({ success: true, data: config });
        }
        catch (error) {
            next(error);
        }
    },
    remove: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const existing = await shipping_config_repository_1.shippingConfigRepository.findById(id);
            if (!existing)
                throw new http_errors_1.NotFoundError('ShippingConfig');
            await shipping_config_repository_1.shippingConfigRepository.remove(id);
            res.json({ success: true, message: 'ShippingConfig deleted' });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=shipping-config.controller.js.map