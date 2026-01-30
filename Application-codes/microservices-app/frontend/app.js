const apiUrl = '/api';

document.getElementById('loadUsers').addEventListener('click', loadUsers);
document.getElementById('loadProducts').addEventListener('click', loadProducts);
document.getElementById('loadOrders').addEventListener('click', loadOrders);

async function loadUsers() {
  try {
    const response = await fetch(`${apiUrl}/users`);
    const users = await response.json();
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach(user => {
      const li = document.createElement('li');
      li.textContent = `${user.name} - ${user.email}`;
      userList.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

async function loadProducts() {
  try {
    const response = await fetch(`${apiUrl}/products`);
    const products = await response.json();
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    products.forEach(product => {
      const li = document.createElement('li');
      li.textContent = `${product.name} - $${product.price}`;
      productList.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

async function loadOrders() {
  try {
    const response = await fetch(`${apiUrl}/orders`);
    const orders = await response.json();
    const orderList = document.getElementById('orderList');
    orderList.innerHTML = '';
    orders.forEach(order => {
      const li = document.createElement('li');
      li.textContent = `Order ${order.id} - User: ${order.user_id}, Product: ${order.product_id}, Quantity: ${order.quantity}`;
      orderList.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading orders:', error);
  }
}
