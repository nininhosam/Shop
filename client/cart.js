const mainSection = document.querySelector('div#orders');
const shopTab = document.querySelector('div#shop_tab');
const cartTab = document.querySelector('div#cart_tab');
const logOutTab = document.querySelector('div#logout_tab');
const welcome = document.querySelector('span#welcome');

import { createTag, adminOptions } from './PageStructure.js';
const accessToken = localStorage.getItem('accessToken');
const perms = localStorage.getItem('permLevel');
const server = `http://localhost:4000`;
const orders = [];

welcome.innerHTML = `Welcome, ${localStorage.getItem('username')}`;
adminOptions(perms);
if (accessToken == null) {
  location.href = './login.html';
}

const loadOrders = (allOrders) => {
  allOrders.forEach((order) => {
    if (!document.querySelector(`div#singleOrder_${order.cart_id}`)) {
      let box = createTag(
        'div',
        'singleOrder',
        `singleOrder_${order.cart_id}`,
        mainSection
      );
      switch (order.finished) {
        case 1:
          box.style.backgroundColor = 'rgb(179, 233, 126)';
          break;
        case -1:
          box.style.backgroundColor = 'rgb(255, 140, 140)';
          break;
      }

      let cartId = createTag('div', 'cartId', `cartId_${order.cart_id}`, box);
      let idTxt = createTag('p', 'idTxt', `idTxt_${order.cart_id}`, cartId);
      idTxt.innerHTML = `Order #${order.cart_id}`;
      let products = createTag(
        'div',
        'products',
        `products_${order.cart_id}`,
        box
      );
      let productTxt = createTag(
        'div',
        'productTxt',
        `${order.cart_id}_${order.product}`,
        products
      );
      productTxt.innerHTML = `x${order.amount} ${order.product}`;
    } else {
      let productTxt = createTag(
        'div',
        'productTxt',
        `${order.cart_id}_${order.product}`,
        document.querySelector(`div#products_${order.cart_id}`)
      );
      productTxt.innerHTML = `x${order.amount} ${order.product}`;
    }
  });
};
const getOrders = async (auth, cb) => {
  return fetch(`${server}/myCarts`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${auth}`,
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
    cache: 'default',
  })
    .then((res) => res.json())
    .then((data) => {
      cb(data);
    });
};
getOrders(accessToken, (data) => {
  data.forEach((element) => {
    orders.push(element);
  });
  loadOrders(orders);
});
const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('username');
  localStorage.removeItem('permLevel');
  location.href = './login.html';
};
shopTab.addEventListener('click', () => {
  location.href = './shop.html';
});
cartTab.addEventListener('click', () => {
  location.href = './cart.html';
});
logOutTab.addEventListener('click', logout);

document.querySelectorAll('.tab').forEach((element) => {
  element.addEventListener('mousedown', () => {
    element.style.boxShadow = 'inset 0.8vmin 1vmin 0 rgb(62, 62, 62)';
  });
  element.addEventListener('mouseup', () => {
    element.style.boxShadow = '0.8vmin 1vmin 0 rgb(62, 62, 62)';
  });
});
