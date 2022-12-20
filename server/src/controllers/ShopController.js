const db = require('../database');

async function getSingleProduct(product) {
  return new Promise((resolve, reject) => {
    db.query(
      `select * 
      from products 
      left join carts 
      on products.name = carts.product 
      where name like '${product}';`,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
  });
}
async function checkProducts(arr) {
  let checkExists = true;
  for (i = 0; i < arr.length; i++) {
    const key = Object.keys(arr[i]);
    const prod = await getSingleProduct(key[0]);
    if (prod == 0) {
      checkExists = false;
      console.log(`${key[0]} does not exist`);
    }
  }
  return checkExists;
}
async function getLastCartId() {
  return new Promise((resolve, reject) => {
    db.query(
      `select * from carts order by cart_id desc limit 1;`,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
  });
}

const ShopController = {
  async getAllProducts(req, res) {
    db.query(`select * from products;`, (err, result) => {
      if (err) res.status(500).send({ msg: 'An error has occurred.' });
      res.send(result);
    });
  },
  async pushCart(req, res) {
    const cart = req.body;
    const userId = req.user.id;

    const checked = await checkProducts(cart);
    if (checked == true) {
      const lastId = await getLastCartId();
      let id = 0;
      if (lastId == 0) {
        id = 1;
      } else {
        id = lastId[0].cart_id + 1;
      }
      cart.forEach((product) => {
        const key = Object.keys(product);
        db.query(
          `insert into carts (cart_id, product, amount, user_id) values (${id}, '${key}', ${product[key]}, '${userId}');`,
          (err) => {
            if (err) {
              res.status(500).send({ msg: err });
            }
          }
        );
      });
      res.status(201).send({ msg: 'Cart added' });
    } else {
      res.status(400).send({ msg: "One or more items don't exist" });
    }
  },
  async getUserCarts(req, res) {
    const id = req.user.id;
    db.query(`select * from carts where user_id = ${id};`, (err, result) => {
      if (err) res.status(500).send({ msg: 'An error has occurred.' });
      res.send(result);
    });
  },
  async getAllCarts(req, res) {
    if (req.user.perms > 0) {
      db.query(`select * from carts;`, (err, result) => {
        if (err) res.status(500).send({ msg: 'An error has occurred.' });
        res.send(result);
      });
    }
  },
  async finishOrder(req, res) {
    const cartId = req.body.cartId;
    if (req.user.perms > 0) {
      db.query(
        `update carts
      set finished = 1
      where cart_id = ${cartId};`,
        (err, result) => {
          if (err) res.status(500).send({ msg: err});
          else res.send({"msg": "Marked as finished"})
        }
      );
    }
  },
  async denyOrder(req, res) {
    const cartId = req.body.cartId;
    if (req.user.perms > 0) {
      db.query(
        `update carts
      set finished = -1
      where cart_id = ${cartId};`,
        (err, result) => {
          if (err) res.status(500).send({ msg: err})
          else res.send({"msg": "Order denied"})
        }
      );
    }
  },
};

module.exports = ShopController;
