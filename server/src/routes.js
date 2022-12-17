const { Router } = require('express');
const routes = Router();
const ShopController = require('./controllers/ShopController');
const AccountController = require('./controllers/AccountController')

routes.get(`/`,ShopController.getAllProducts);
routes.post(`/order`, AccountController.authenticateToken, ShopController.pushCart);
routes.get(`/users`, AccountController.getUsers)
routes.post(`/register`, AccountController.register)
routes.post(`/login`, AccountController.login)
module.exports = routes;
