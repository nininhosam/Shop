const content = document.querySelector('div#content');
const mainSection = document.querySelector('div#users');
const navBar = document.querySelector('div#navBar');
const shopTab = document.querySelector('div#shop_tab');
const cartTab = document.querySelector('div#cart_tab');
const logOutTab = document.querySelector('div#logout_tab');
const welcome = document.querySelector('span#welcome');

import { createTag, adminOptions } from './PageStructure.js';
const accessToken = localStorage.getItem('accessToken');
const perms = localStorage.getItem('permLevel');
const server = `http://localhost:4000`;

const users = [];

welcome.innerHTML = `Welcome, ${localStorage.getItem('username')}`;
adminOptions(perms);
if (accessToken == null || perms == null) {
  location.href = './login.html';
}
const setPerm = async (auth, username, permLevel, cb) => {
  let body = {
    username: username,
    perm_level: permLevel,
  };

  return fetch(`${server}/set_perm`, {
    method: 'PUT',
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
const deleteUser = async (auth, username, cb) => {
  return fetch(`${server}/${username}`, {
    method: 'DELETE',
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
const loadUsers = (allUsers) => {
  allUsers.forEach(async (user) => {
    let permission = '';
    let userBox = createTag(
      `div`,
      `singleUser`,
      `userBox_${user.id}`,
      mainSection
    );
    switch (user.perm_level) {
      default:
        permission = 'user';
        break;
      case 1:
        permission = 'admin';
        userBox.style.backgroundColor = 'rgb(100, 108, 252)';
        break;
      case 2:
        permission = 'head admin';
        userBox.style.backgroundColor = 'rgb(255, 112, 112)';
        break;
    }

    let userInfo = createTag(`div`, `userInfo`, `userInfo_${user.id}`, userBox);
    let userInfoName = createTag(
      `div`,
      `userInfoName`,
      `userInfoName_${user.id}`,
      userInfo
    );
    let userInfoId = createTag(
      `div`,
      `userInfoTxt`,
      `userInfoId_${user.id}`,
      userInfo
    );
    let userInfoOrders = createTag(
      `div`,
      `userInfoTxt`,
      `userInfoOrder_${user.id}`,
      userInfo
    );
    let userInfoPerms = createTag(
      `div`,
      `userInfoTxt`,
      `userInfoPerms_${user.id}`,
      userInfo
    );

    if (perms > 1) {
      let admOptions = createTag(
        `div`,
        `admOptions`,
        `admOptions_${user.id}`,
        userBox
      );
      if (user.id != 0) {
        let confirmBtn = createTag(
          'img',
          'confirmBtn admBtn',
          `confirmBtn_${user.id}`,
          admOptions
        );
        let denyBtn = createTag(
          'img',
          'denyBtn admBtn',
          `denyBtn_${user.id}`,
          admOptions
        );
        let deleteBtn = createTag(
          'img',
          'deleteBtn admBtn',
          `deleteBtn_${user.id}`,
          admOptions
        );

        confirmBtn.setAttribute('src', './assets/admin_perm_icon.png');
        denyBtn.setAttribute('src', './assets/admin_unperm_icon.png');
        deleteBtn.setAttribute('src', './assets/delete_icon.png');

        confirmBtn.addEventListener('click', async () => {
          if (user.perm_level < 2)
            await setPerm(
              accessToken,
              user.username,
              user.perm_level + 1,
              (response) => {
                refreshUsers();
              }
            );
        });
        denyBtn.addEventListener('click', async () => {
          if (user.perm_level > 0) {
            await setPerm(
              accessToken,
              user.username,
              user.perm_level - 1,
              (response) => {
                refreshUsers();
              }
            );
          }
        });
        deleteBtn.addEventListener('click', async () => {
          await deleteUser(accessToken, user.username, (data) => {
            console.log(data.msg);
            refreshUsers();
          });
        });
      } else {
        let selfBtn = createTag('img', 'selfBtn admBtn', `selfBtn`, admOptions);
        selfBtn.setAttribute('src', './assets/self_icon2.png');
      }
    }

    userInfoName.innerHTML = `${user.username}`;
    userInfoId.innerHTML = `User ID: ${user.id}`;
    userInfoOrders.innerHTML = `Orders: ${user.orders}`;
    userInfoPerms.innerHTML = `Perms: ${permission} (${user.perm_level})`;
  });
};
const getUsers = async (auth, cb) => {
  return fetch(`${server}/users`, {
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
const refreshUsers = () => {
  mainSection.innerHTML = '';
  users.length = 0;
  getUsers(accessToken, (data) => {
    data.forEach((user) => {
      users.push(user);
    });
    loadUsers(users);
  });
};
refreshUsers();

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

const register = async (body, cb) => {
  return fetch(`${server}/register`, {
    method: 'POST',
    headers: {
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
//Head Admin - Create New User
if (perms > 1) {
  let newField = createTag('div', 'newField', 'newField', content);
  let newInfo = createTag('div', 'newInfo', 'newInfo', newField);

  let newUsernameField = createTag(
    'div',
    'newField',
    'newUsernameField',
    newInfo
  );
  let nameSpan = createTag('span', 'nameSpan', 'nameSpan', newUsernameField);
  nameSpan.innerHTML = 'Username: ';
  let nameInput = createTag(
    'input',
    'newInput',
    'newUsernameInput',
    newUsernameField
  );
  nameInput.setAttribute('type', 'text');

  let newPasswordField = createTag(
    'div',
    'newField',
    'newPasswordField',
    newInfo
  );
  let passSpan = createTag('span', 'passSpan', 'passSpan', newPasswordField);
  passSpan.innerHTML = 'Password: ';
  let passInput = createTag(
    'input',
    'newInput',
    'newPasswordInput',
    newPasswordField
  );
  passInput.setAttribute('type', 'text');

  let newPermsField = createTag('div', 'newField', 'newPermsField', newInfo);
  let newPermsInput = createTag(
    'input',
    'newCheckbox',
    'newAdmin',
    newPermsField
  );
  newPermsInput.setAttribute('type', 'checkbox');
  let PermsSpan = createTag('span', 'permsSpan', 'permsSpan', newPermsField);
  PermsSpan.innerHTML = 'Administrator';

  let addUser = createTag('button', 'addUserBtn', 'addUser', newField);
  addUser.innerHTML = 'Add new User';
  addUser.addEventListener('click', async () => {
    let usernameVal = nameInput.value;
    let passwordVal = passInput.value;
    if (usernameVal == 0 || passwordVal == 0) {
      window.alert('Please fill out all the fields');
    } else {
      let request = {
        username: usernameVal,
        password: passwordVal,
      };
      await register(request, async () => {
        if (newPermsInput.checked == true) {
          await setPerm(accessToken, usernameVal, 1, (response) => {
            refreshUsers();
          });
        } else {
          refreshUsers();
        }
      });
    }
  });
}
