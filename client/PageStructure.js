const createTag = (type, className, id, parentNode) => {
  let element = document.createElement(`${type}`);
  element.setAttribute('class', `${className}`);
  element.setAttribute('id', `${id}`);
  parentNode.appendChild(element);
  return element;
};
const createTagBefore = (type, className, id, parentNode, beforeChild) => {
  let element = document.createElement(`${type}`);
  element.setAttribute('class', `${className}`);
  element.setAttribute('id', `${id}`);
  parentNode.insertBefore(element, beforeChild);
  return element;
};
const adminOptions = (perms) => {
  if (perms > 0) {
    let adminPages = createTagBefore(
      'div',
      'admin_pages',
      'adminPages',
      navBar,
      welcome
    );

    let adminOrder = createTag('div', 'tab', 'admin_tab', adminPages);
    let admOrderIc = createTag('img', 'icon', 'adminOrderIc', adminOrder);
    admOrderIc.setAttribute('src', './assets/admin_order_icon.png');
    let admOrderP = createTag('p', 'tabText', 'adminOrderP', adminOrder);
    admOrderP.innerHTML = 'Manage Orders';
    adminOrder.addEventListener('click', () => {
      location.href = './adminOrders.html';
    });

    let adminUser = createTag('div', 'tab', 'admin_tab', adminPages);
    let admUserIc = createTag('img', 'icon', 'adminUserIc', adminUser);
    admUserIc.setAttribute('src', './assets/admin_user_icon.png');
    let admUserP = createTag('p', 'tabText', 'adminUserP', adminUser);
    admUserP.innerHTML = 'Manage Users';
    adminUser.addEventListener('click', () => {
      location.href = './adminUser.html';
    });
  }
};
export { createTag, createTagBefore, adminOptions };
