const productList = document.querySelector('div#productList');
const cartListBox = document.querySelector('div#cartListBox');
const buyBtn = document.querySelector('div#pushCart');

const navBar = document.querySelector('div#navBar');
const shopTab = document.querySelector('div#shop_tab');
const cartTab = document.querySelector('div#cart_tab');
const logOutTab = document.querySelector('div#logout_tab');
const welcome = document.querySelector('span#welcome');

import { createTag, createTagBefore, adminOptions } from './PageStructure.js';
const server = `http://localhost:4000`;
const accessToken = localStorage.getItem('accessToken');
const perms = localStorage.getItem('permLevel');
const allItems = [];
const cart = [];

welcome.innerHTML = `Welcome, ${localStorage.getItem('username')}`;
adminOptions(perms);
if (!accessToken) {
  location.href = './login.html';
}

const generateList = (allProducts) => {
  allProducts.forEach((product) => {
    let box = createTag('div', 'productBox requestBox', product, productList);
    let itemNameDiv = createTag('div', 'itemName', `itemName_${product}`, box);
    let itemNameP = createTag(
      'p',
      'itemNameP',
      `itemNameP_${product}`,
      itemNameDiv
    );
    itemNameP.innerHTML = product;
    let qtyEdit = createTag('div', 'qtyEdit', `qtyEdit_${product}`, box);
    let minus = createTag('button', 'less', `less_${product}`, qtyEdit);
    minus.innerHTML = '-';
    let qty = createTag('p', 'quantity', `quantity_${product}`, qtyEdit);
    qty.innerHTML = 0;
    let plus = createTag('button', 'more', `more_${product}`, qtyEdit);
    plus.innerHTML = '+';
    let addCart = createTag('button', 'addCart', `addCart_${product}`, qtyEdit);
    addCart.innerHTML = 'Add to cart';

    minus.addEventListener('click', () => {
      if (qty.innerHTML > 0) {
        qty.innerHTML -= 1;
      }
    });
    plus.addEventListener('click', () => {
      qty.innerHTML = Number(qty.innerHTML) + 1;
    });
    addCart.addEventListener('click', () => {
      if (qty.innerHTML > 0) {
        addToCart(product, qty.innerHTML);
      }
    });
  });
};
const getItems = async (cb) => {
  return fetch(`${server}`)
    .then((res) => res.json())
    .then((data) => {
      cb(data);
    });
};
getItems((data) => {
  data.forEach((element) => {
    allItems.push(element.name);
  });
  generateList(allItems);
});

const addToCart = (item, amount) => {
  if (document.querySelector(`div#C${item}`)) {
    window.alert('This item is already in your shopping cart');
  } else {
    cart.push({
      [`${item}`]: amount,
    });

    let box = createTagBefore(
      'div',
      'requestBox cartBox cartRemove',
      `C${item}`,
      cartListBox,
      buyBtn
    );
    let itemNameDiv = createTag(
      'div',
      'itemName cartRemove',
      `CitemName_${item}`,
      box
    );
    let itemNameP = createTag(
      'p',
      'itemNameP cartRemove',
      `CitemNameP_${item}`,
      itemNameDiv
    );
    itemNameP.innerHTML = item;
    let qtyEdit = createTag(
      'div',
      'qtyEdit cartRemove',
      `CqtyEdit_${item}`,
      box
    );
    let minus = createTag(
      'button',
      'less cartRemove',
      `Cless_${item}`,
      qtyEdit
    );
    minus.innerHTML = '-';
    let qty = createTag(
      'p',
      'quantity cartRemove',
      `Cquantity_${item}`,
      qtyEdit
    );
    qty.innerHTML = amount;
    let plus = createTag('button', 'more cartRemove', `Cmore_${item}`, qtyEdit);
    plus.innerHTML = '+';

    minus.addEventListener('click', () => {
      const found = cart.find((e) => {
        let key = Object.keys(e);
        return item == key[0];
      });
      if (qty.innerHTML == 1) {
        let index = cart.findIndex((e) => {
          let key = Object.keys(e);
          return item == key[0];
        });
        box.remove();
        itemNameDiv.remove();
        itemNameP.remove();
        qtyEdit.remove();
        minus.remove();
        qty.remove();
        plus.remove();
        cart.splice(index, 1);
      } else if (qty.innerHTML > 0) {
        qty.innerHTML -= 1;
        found[item] = qty.innerHTML;
      }
    });
    plus.addEventListener('click', () => {
      const found = cart.find((e) => {
        let key = Object.keys(e);
        return item == key[0];
      });
      qty.innerHTML = Number(qty.innerHTML) + 1;
      found[item] = qty.innerHTML;
    });
  }
};
const sendOrder = async (body, auth) => {
  return fetch(`${server}/order`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${auth}`,
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
    body: body,
    cache: 'default',
  });
};
const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('username');
  localStorage.removeItem('permLevel');
  location.href = './login.html';
};

buyBtn.addEventListener('click', async () => {
  if (cart.length == 0) {
    alert('The cart is Empty');
  } else {
    let postReq = JSON.stringify(cart);
    const res = await (await sendOrder(postReq, accessToken)).json();
    alert(res.msg);
    cart.length = 0;
    let remove = document.querySelectorAll('.cartRemove');
    remove.forEach((e) => {
      e.remove();
    });
  }
});
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
