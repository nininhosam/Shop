const mainSection = document.querySelector('div#orders');
const shopTab = document.querySelector('div#shop_tab');
const cartTab = document.querySelector('div#cart_tab');
const logOutTab = document.querySelector('div#logout_tab');
const welcome = document.querySelector('span#welcome');

const accessToken = localStorage.getItem('accessToken');
const perms = localStorage.getItem('permLevel');
const server = `http://localhost:4000`;
const orders = [];

welcome.innerHTML = `Welcome, ${localStorage.getItem('username')}`;
if (perms > 0) {
  let adminTab = document.createElement('div');
  adminTab.setAttribute('id', 'admin_tab');
  adminTab.setAttribute('class', 'tab');
  navBar.insertBefore(adminTab, welcome);

  let admIc = document.createElement('img');
  admIc.setAttribute('src', './src/admin_icon.png');
  admIc.setAttribute('alt', 'admin_tab');
  admIc.setAttribute('class', 'icon');
  adminTab.appendChild(admIc);

  let admP = document.createElement('p');
  admP.setAttribute('class', 'tabText');
  admP.innerHTML = 'Admin';
  adminTab.appendChild(admP);

  adminTab.addEventListener('click', () => {
    location.href = './adminOrders.html';
  });
}
if (perms <= 0 || perms == null) {
  location.href = './shop.html';
}
const sendPost = async (path, body, auth, cb) => {
  return fetch(`${server}/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${auth}`,
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'default',
  })
    .then((res) => res.json())
    .then((data) => {
      cb(data);
    });
};
const loadOrders = (allOrders) => {
  allOrders.forEach((order) => {
    if (!document.querySelector(`div#singleOrder_${order.cart_id}`)) {
      let box = document.createElement('div');
      box.setAttribute('class', 'singleOrder');
      box.setAttribute('id', `singleOrder_${order.cart_id}`);
      switch (order.finished) {
        case 1:
          box.style.backgroundColor = 'rgb(179, 233, 126)';
          break;
        case -1:
          box.style.backgroundColor = 'rgb(255, 140, 140)';
          break;
      }
      mainSection.appendChild(box);

      let cartId = document.createElement('div');
      cartId.setAttribute('class', 'cartId');
      cartId.setAttribute('id', `cartId_${order.cart_id}`);
      box.appendChild(cartId);

      let idTxt = document.createElement('p');
      idTxt.setAttribute('class', 'idTxt');
      idTxt.setAttribute('id', `idTxt_${order.cart_id}`);
      idTxt.innerHTML = `Order #${order.cart_id}`;
      cartId.appendChild(idTxt);

      let products = document.createElement('div');
      products.setAttribute('class', 'products');
      products.setAttribute('id', `products_${order.cart_id}`);
      box.appendChild(products);

      let productTxt = document.createElement('div');
      productTxt.setAttribute('class', 'productTxt');
      productTxt.setAttribute('id', `${order.cart_id}_${order.product}`);
      productTxt.innerHTML = `x${order.amount} ${order.product}`;
      products.appendChild(productTxt);

      let btnBox = document.createElement('div');
      btnBox.setAttribute('class', 'admOptions');
      btnBox.setAttribute('id', `admOptions_${order.cart_id}`);
      box.appendChild(btnBox);

      let confirm = document.createElement('img');
      confirm.setAttribute('src', './src/check.png');
      confirm.setAttribute('class', 'confirmBtn admBtn');
      confirm.setAttribute('id', `confirmBtn_${order.cart_id}`);
      btnBox.appendChild(confirm);

      let deny = document.createElement('img');
      deny.setAttribute('src', './src/uncheck.png');
      deny.setAttribute('class', 'denyBtn admBtn');
      deny.setAttribute('id', `denyBtn_${order.cart_id}`);
      btnBox.appendChild(deny);

      confirm.addEventListener('click', () => {
        let body = {
          cartId: `${order.cart_id}`,
        };
        sendPost('completeOrder', body, accessToken, () => {});
        box.style.backgroundColor = `rgb(179, 233, 126)`;
      });

      deny.addEventListener('click', () => {
        let body = {
          cartId: `${order.cart_id}`,
        };
        sendPost('denyOrder', body, accessToken, () => {});
        box.style.backgroundColor = `rgb(255, 140, 140)`;
      });
    } else {
      let productTxt = document.createElement('div');
      productTxt.setAttribute('class', 'productTxt');
      productTxt.setAttribute('id', `${order.cart_id}_${order.product}`);
      productTxt.innerHTML = `x${order.amount} ${order.product}`;
      document
        .querySelector(`div#products_${order.cart_id}`)
        .appendChild(productTxt);
    }
  });
};
const getOrders = async (auth, cb) => {
  return fetch(`${server}/allCarts`, {
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
