// Mobile sidebar menu logic
const menuBtn = document.getElementById('menuBtn');
const closeMenu = document.getElementById('closeMenu');
const sidebar = document.getElementById('sidebarMenu');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const cartPanel = document.getElementById('cartPanel');
const overlay = document.getElementById('overlay');
const orderList = document.getElementById('orderList');
const cartList = document.getElementById('cartList');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');
const menuCards = document.querySelectorAll('.menu-card');
const cartItems = [];

function openSidebar() { sidebar.classList.add('open'); overlay.classList.add('show'); }
function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('show'); }
function openCart() { cartPanel.classList.add('open'); overlay.classList.add('show'); }
function closeCartPanel() { cartPanel.classList.remove('open'); overlay.classList.remove('show'); }

function addToOrder(name, price) {
  const item = document.createElement('li');
  item.textContent = `${name} — $${price.toFixed(2)}`;
  orderList.appendChild(item);
}

function addToCart(name, price) {
  const existing = cartItems.find((item) => item.name === name);
  if (existing) existing.quantity += 1;
  else cartItems.push({ name, price, quantity: 1 });
  renderCart();
}

function renderCart() {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;
  cartList.innerHTML = cartItems.length
    ? cartItems.map((item) => `
        <li>
          <div class="cart-item-row">
            <span>${item.name} × ${item.quantity}</span>
            <button class="remove-btn" data-name="${item.name}" type="button">Remove</button>
          </div>
          <small>$${(item.price * item.quantity).toFixed(2)}</small>
        </li>`).join('')
    : '<li>Your cart is empty.</li>';
}

function removeFromCart(name) {
  const index = cartItems.findIndex((item) => item.name === name);
  if (index !== -1) cartItems.splice(index, 1);
  renderCart();
}

menuBtn.addEventListener('click', openSidebar);
closeMenu.addEventListener('click', closeSidebar);
cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartPanel);
overlay.addEventListener('click', () => { closeSidebar(); closeCartPanel(); });
window.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeSidebar(); closeCartPanel(); } });
sidebar.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeSidebar));

cartList.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-name]');
  if (!btn) return;
  removeFromCart(btn.dataset.name);
});

checkoutBtn.addEventListener('click', () => {
  if (!cartItems.length) {
    alert('Your cart is empty.');
    return;
  }
  alert('Your order has been placed successfully!');
  cartItems.length = 0;
  orderList.innerHTML = '<li>No item selected yet.</li>';
  renderCart();
  closeCartPanel();
});

clearCartBtn.addEventListener('click', () => {
  cartItems.length = 0;
  orderList.innerHTML = '<li>No item selected yet.</li>';
  renderCart();
});

renderCart();

menuCards.forEach((card) => {
  const addItem = () => {
    const name = card.dataset.name;
    const price = Number(card.dataset.price);
    if (orderList.firstChild && orderList.firstChild.textContent === 'No item selected yet.') {
      orderList.innerHTML = '';
    }
    addToOrder(name, price);
    addToCart(name, price);
  };

  card.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') return;
    addItem();
  });

  card.querySelector('.order-btn-small').addEventListener('click', (event) => {
    event.stopPropagation();
    addItem();
  });
});
