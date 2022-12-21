const { Router } = require('express');
const routes = Router();
const ShopController = require('./controllers/ShopController');
const AccountController = require('./controllers/AccountController')

routes.get(`/`, ShopController.getAllProducts);
routes.get(`/myCarts`, AccountController.authenticateToken, ShopController.getUserCarts);
routes.post(`/order`, AccountController.authenticateToken, ShopController.pushCart);

routes.get(`/allCarts`, AccountController.authenticateToken, ShopController.getAllCarts);
routes.post(`/completeOrder`, AccountController.authenticateToken, ShopController.finishOrder)
routes.post(`/denyOrder`, AccountController.authenticateToken, ShopController.denyOrder)

routes.get(`/users`, AccountController.authenticateToken, AccountController.getUsers)
routes.put(`/set_perm`, AccountController.authenticateToken, AccountController.setPerms)
routes.delete(`/:id`, AccountController.authenticateToken, AccountController.delUser)
routes.post(`/register`, AccountController.register)
routes.post(`/login`, AccountController.login)
module.exports = routes;
