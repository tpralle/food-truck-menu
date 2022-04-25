var cart = {
  hPdt: null,
  hItems: null,
  items: {},
  iURL: 'images/default-icons/',

  // save cart to local storage
  save: () => {
    localStorage.setItem('cart', JSON.stringify(cart.items));
  },

  // load cart from local storage
  load: () => {
    cart.items = localStorage.getItem('cart');
    if (cart.items == null) {
      cart.items = {};
    } else {
      cart.items = JSON.parse(cart.items);
    }
  },

  // empty cart
  nuke: () => {
    if (confirm('Empty cart?')) {
      cart.items = {};
      localStorage.removeItem('cart');
      cart.list();
    }
  },

  // Begin Order
  init: () => {
    cart.hPdt = document.getElementById('product-list');
    cart.hItems = document.getElementById('cart-list');

    // Render Product List
    cart.hPdt.innerHTML = '';
    let template = document.getElementById('product-template').content,
      p,
      item;

    for (let id in products) {
      p = products[id];
      item = template.cloneNode(true);
      item.querySelector('.product-img').src = cart.iURL + p.img;
      item.querySelector('.product-name').textContent = p.name;
      item.querySelector('.product-price').textContent =
        '$' + p.price.toFixed(2);
      item.querySelector('.product-button').onclick = () => {
        cart.add(id);
      };
      cart.hPdt.appendChild(item);
    }

    // Load order from previous session
    cart.load();

    // List current order
    cart.list();
  },

  // Render current order in HTML
  list: () => {
    // Reset
    cart.hItems.innerHTML = '';
    let item,
      part,
      pdt,
      empty = true;

    for (let key in cart.items) {
      if (cart.items.hasOwnProperty(key)) {
        empty = false;
        break;
      }
    }

    // No Order
    if (empty) {
      item = document.createElement('div');
      item.innerHTML = 'No Order Started';
      cart.hItems.appendChild(item);
    }

    // List Order Items
    else {
      let template = document.getElementById('cart-template').content,
        p,
        total = 0,
        subtotal = 0;

      for (let id in cart.items) {
        // Order Item
        p = products[id];
        item = template.cloneNode(true);
        item.querySelector('.cart-del').onclick = () => {
          cart.remove(id);
        };
        item.querySelector('.cart-name').textContent = p.name;
        item.querySelector('.cart-qty').value = cart.items[id];
        item.querySelector('.cart-qty').onchange = function () {
          cart.change(id, this.value);
        };
        cart.hItems.appendChild(item);

        // Subtotal
        // TODO (tpralle): Implement subtotal display
        subtotal = cart.items[id] * p.price;
        total += subtotal;
      }

      // Display Total
      item = document.createElement('div');
      item.className = 'cart-total';
      item.id = 'cart-total';
      item.innerHTML = 'TOTAL: $' + total;
      cart.hItems.appendChild(item);

      // Checkout
      item = document.getElementById('cart-checkout').content.cloneNode(true);
      cart.hItems.appendChild(item);
    }
  },

  // Add item to cart
  add: (id) => {
    if (cart.items[id] == undefined) {
      cart.items[id] = 1;
    } else {
      cart.items[id]++;
    }
    cart.save();
    cart.list();
  },

  // Change Qty
  change: (pid, qty) => {
    // Remove Item
    if (qty <= 0) {
      cart.remove(pid);
    }

    // Update Total
    else {
      cart.items[pid] = qty;
      var total = 0;
      for (let id in cart.items) {
        total += cart.items[id] * products[id].price;
        document.getElementById('cart-total').innerHTML = 'TOTAL: $' + total;
      }
    }
  },

  // Remove Item
  remove: (id) => {
    delete cart.items[id];
    cart.save();
    cart.list();
  },

  // Checkout
  checkout: () => {
    // TODO (tpralle): design and implement next steps after checkout button pressed.
    alert('TO DO');
  },
};
window.addEventListener('DOMContentLoaded', cart.init);
