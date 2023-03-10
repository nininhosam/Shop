const usernameInput = document.querySelector('input#username_textfield');
const passwordInput = document.querySelector('input#password_textfield');
const sendBtn = document.querySelector('button#send');
const changeBtn = document.querySelector('button#changeSend');
const server = `http://localhost:4000`;

const post = async (path, body, cb) => {
  return fetch(`${server}/${path}`, {
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

async function send(postPath, cb1) {
  let username = usernameInput.value;
  let password = passwordInput.value;
  if (username == 0 || password == 0) {
    window.alert('Please fill out all the fields');
  } else {
    let request = {
      username: `${username}`,
      password: `${password}`,
    };
    await post(`${postPath}`, request, (res) => {
      cb1(res);
    });
  }
}

async function register() {
  await send('register', (res) => {
    alert(res.msg);
  });
}
async function login() {
  await send('login', (res) => {
    if (res.accessToken == undefined) {
      alert(res.msg);
    } else {
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('permLevel', res.perms);
      localStorage.setItem('username', res.username);
      window.location.href = './shop.html';
    }
  });
}
sendBtn.addEventListener('click', login);

function toRegister() {
  sendBtn.innerHTML = 'Register';
  sendBtn.removeEventListener('click', login);
  sendBtn.addEventListener('click', register);

  changeBtn.innerHTML = 'Already have an account? Log in';
  changeBtn.removeEventListener('click', toRegister);
  changeBtn.addEventListener('click', toLogin);
}
function toLogin() {
  sendBtn.innerHTML = 'Log in';
  sendBtn.removeEventListener('click', register);
  sendBtn.addEventListener('click', login);

  changeBtn.innerHTML = "Don't have an account? Register";
  changeBtn.removeEventListener('click', toLogin);
  changeBtn.addEventListener('click', toRegister);
}
changeBtn.addEventListener('click', toRegister);
