const productList = document.querySelector('div#productList');
const cartListBox = document.querySelector('div#cartListBox');
const buyBtn = document.querySelector('div#pushCart');

const navBar = document.querySelector('div#navBar');
const shopTab = document.querySelector('div#shop_tab');
const cartTab = document.querySelector('div#cart_tab');
const logOutTab = document.querySelector('div#logout_tab');
const welcome = document.querySelector('span#welcome');

const server = `http://localhost:4000`;
const accessToken = localStorage.getItem('accessToken');
const perms = localStorage.getItem('permLevel');
const allItems = [];
const cart = [];

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
if (!accessToken) {
  location.href = './login.html';
}
console.log(accessToken);
const generateList = (allProducts) => {
  allProducts.forEach((product) => {
    let box = document.createElement('div');
    box.setAttribute('class', 'productBox requestBox');
    box.setAttribute('id', `${product}`);
    productList.appendChild(box);

    let itemNameDiv = document.createElement('div');
    itemNameDiv.setAttribute('class', 'itemName');
    itemNameDiv.setAttribute('id', `itemName_${product}`);
    box.appendChild(itemNameDiv);

    let itemNameP = document.createElement('p');
    itemNameP.setAttribute('class', 'itemNameP');
    itemNameP.setAttribute('id', `itemNameP_${product}`);
    itemNameP.innerHTML = product;
    itemNameDiv.appendChild(itemNameP);

    let qtyEdit = document.createElement('div');
    qtyEdit.setAttribute('class', 'qtyEdit');
    qtyEdit.setAttribute('id', `qtyEdit_${product}`);
    box.append(qtyEdit);

    let minus = document.createElement('button');
    minus.setAttribute('class', 'less');
    minus.setAttribute('id', `less_${product}`);
    minus.innerHTML = '-';
    qtyEdit.appendChild(minus);

    let qty = document.createElement('p');
    qty.setAttribute('class', 'quantity');
    qty.setAttribute('id', `quantity_${product}`);
    qty.innerHTML = 0;
    qtyEdit.appendChild(qty);

    let plus = document.createElement('button');
    plus.setAttribute('class', 'more');
    plus.setAttribute('id', `more_${product}`);
    plus.innerHTML = '+';
    qtyEdit.appendChild(plus);

    let addCart = document.createElement('button');
    addCart.setAttribute('class', 'addCart');
    addCart.setAttribute('id', `addCart_${product}`);
    addCart.innerHTML = 'Add to cart';
    qtyEdit.appendChild(addCart);

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
    let box = document.createElement('div');
    box.setAttribute('class', 'requestBox cartBox cartRemove');
    box.setAttribute('id', `C${item}`);
    cartListBox.insertBefore(box, buyBtn);

    let itemNameDiv = document.createElement('div');
    itemNameDiv.setAttribute('class', 'itemName cartRemove');
    itemNameDiv.setAttribute('id', `CitemName_${item}`);
    box.appendChild(itemNameDiv);

    let itemNameP = document.createElement('p');
    itemNameP.setAttribute('class', 'itemNameP cartRemove');
    itemNameP.setAttribute('id', `CitemNameP_${item}`);
    itemNameP.innerHTML = item;
    itemNameDiv.appendChild(itemNameP);

    let qtyEdit = document.createElement('div');
    qtyEdit.setAttribute('class', 'qtyEdit cartRemove');
    qtyEdit.setAttribute('id', `CqtyEdit_${item}`);
    box.append(qtyEdit);

    let minus = document.createElement('button');
    minus.setAttribute('class', 'less cartRemove');
    minus.setAttribute('id', `Cless_${item}`);
    minus.innerHTML = '-';
    qtyEdit.appendChild(minus);

    let qty = document.createElement('p');
    qty.setAttribute('class', 'quantity cartRemove');
    qty.setAttribute('id', `Cquantity_${item}`);
    qty.innerHTML = amount;
    qtyEdit.appendChild(qty);

    let plus = document.createElement('button');
    plus.setAttribute('class', 'more cartRemove');
    plus.setAttribute('id', `Cmore_${item}`);
    plus.innerHTML = '+';
    qtyEdit.appendChild(plus);

    minus.addEventListener('click', () => {
      const found = cart.find((e) => {
        key = Object.keys(e);
        return item == key[0];
      });
      if (qty.innerHTML == 1) {
        let index = cart.findIndex((e) => {
          key = Object.keys(e);
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
        key = Object.keys(e);
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
    postReq = JSON.stringify(cart);
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
