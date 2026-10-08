/* ============================================================
   E-Commers Tecnm — script.js
   Maneja: navbar activa, toast, registro, carrito, busqueda,
           catalogo (agregar al carrito), quienes somos, carrito
   ============================================================ */

/* --- Utilidades -------------------------------------------- */

function showToast(message, icon) {
  icon = icon || 'ok';
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = '<span class="toast-icon">' + icon + '</span><span>' + message + '</span>';
  container.appendChild(toast);

  setTimeout(function () {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', function () { toast.remove(); });
  }, 3200);
}

function setActiveNavLink() {
  const links = document.querySelectorAll('.nav-menu a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(function (link) {
    const href = link.getAttribute('href').split('/').pop();
    if (href === current) link.classList.add('active');
    else link.classList.remove('active');
  });
}

/* --- Carrito (contador global) ----------------------------- */
function getCartCount() {
  return parseInt(localStorage.getItem('E-Commers Tecnm_cart_count') || '0', 10);
}

function setCartCount(n) {
  localStorage.setItem('E-Commers Tecnm_cart_count', n);
  updateCartBadge();
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.nav-cart-badge');
  const count = getCartCount();
  badges.forEach(function (badge) {
    badge.textContent = count;
    if (count > 0) {
      badge.classList.add('bump');
      setTimeout(function () { badge.classList.remove('bump'); }, 400);
    }
  });
}

/* --- Pagina: INICIO ---------------------------------------- */
function initIndex() {
  document.querySelectorAll('.btn-add-to-cart').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const name = btn.dataset.name || 'Producto';
      setCartCount(getCartCount() + 1);
      showToast('"' + name + '" agregado al carrito');
    });
  });
}

/* --- Pagina: CATALOGO -------------------------------------- */
function initCatalog() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.catalog-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(function (card) {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          card.style.animation = 'fadeUp 0.35s ease both';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  document.querySelectorAll('.btn-add-to-cart').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const name = btn.dataset.name || 'Producto';
      setCartCount(getCartCount() + 1);
      showToast('"' + name + '" agregado al carrito');

      const original = btn.innerHTML;
      btn.innerHTML = 'Agregado!';
      btn.disabled = true;
      setTimeout(function () {
        btn.innerHTML = original;
        btn.disabled = false;
      }, 1800);
    });
  });
}

/* --- Pagina: REGISTRO -------------------------------------- */
function initRegister() {
  const form = document.getElementById('register-form');
  const submitBtn = document.getElementById('btn-submit-register');
  const checkbox = document.getElementById('terms-checkbox');
  const alertOk = document.getElementById('alert-success');
  const alertErr = document.getElementById('alert-error');

  if (!form) return;

  checkbox.addEventListener('change', function () {
    submitBtn.disabled = !checkbox.checked;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const nombre = document.getElementById('reg-nombre').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    const nacim = document.getElementById('reg-nacimiento').value;
    const telefono = document.getElementById('reg-telefono').value.trim();

    let valid = true;

    if (!nombre) { showError('err-nombre', 'El nombre es obligatorio.'); valid = false; }
    if (!email) { showError('err-email', 'El correo es obligatorio.'); valid = false; }
    if (!password) { showError('err-password', 'La contrasena es obligatoria.'); valid = false; }
    if (!confirm) { showError('err-confirm', 'Confirma tu contrasena.'); valid = false; }
    if (!nacim) { showError('err-nacimiento', 'La fecha de nacimiento es obligatoria.'); valid = false; }
    if (!telefono) { showError('err-telefono', 'El telefono es obligatorio.'); valid = false; }

    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailRegex.test(email)) {
      showError('err-email', 'Ingresa un correo electronico valido.'); valid = false;
    }

    if (password && confirm && password !== confirm) {
      showError('err-confirm', 'Las contrasenas no coinciden.'); valid = false;
    }

    if (password && password.length < 8) {
      showError('err-password', 'La contrasena debe tener al menos 8 caracteres.'); valid = false;
    }

    const telRegex = /^[0-9]{10}$/;
    if (telefono && !telRegex.test(telefono)) {
      showError('err-telefono', 'El telefono debe tener 10 digitos numericos.'); valid = false;
    }

    if (!valid) {
      alertErr.classList.add('visible');
      alertErr.querySelector('span').textContent = 'Por favor corrige los errores del formulario.';
      alertOk.classList.remove('visible');
      return;
    }

    alertOk.classList.add('visible');
    alertErr.classList.remove('visible');
    form.reset();
    submitBtn.disabled = true;
    showToast('Registro exitoso! Bienvenido a E-Commers Tecnm');
  });

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.add('visible'); }
  }

  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(function (el) {
      el.classList.remove('visible');
    });
  }
}

/* --- Pagina: QUIENES SOMOS --------------------------------- */
function initAbout() {
  const toggleBtn = document.getElementById('btn-ver-mas');
  const panel = document.getElementById('extra-info-panel');

  if (!toggleBtn || !panel) return;

  toggleBtn.addEventListener('click', function () {
    const isVisible = panel.classList.contains('visible');
    panel.classList.toggle('visible');
    toggleBtn.textContent = isVisible ? 'Ver mas informacion' : 'Ocultar informacion';
  });
}

/* --- Pagina: CARRITO --------------------------------------- */
function initCart() {
  function recalculate() {
    let subtotal = 0;
    const rows = document.querySelectorAll('.cart-row');
    rows.forEach(function (row) {
      const price = parseFloat(row.dataset.price || 0);
      const qtyInput = row.querySelector('.qty-input');
      const qty = Math.max(0, parseInt(qtyInput.value) || 0);

      const lineTotal = row.querySelector('.line-total');
      if (lineTotal) lineTotal.textContent = '$' + (price * qty).toLocaleString('es-MX', { minimumFractionDigits: 2 });
      subtotal += price * qty;
    });

    const shipping = subtotal > 0 ? 149 : 0;
    const total = subtotal + shipping;

    const elSubtotal = document.getElementById('cart-subtotal');
    const elShipping = document.getElementById('cart-shipping');
    const elTotal = document.getElementById('cart-total');

    if (elSubtotal) elSubtotal.textContent = '$' + subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 });
    if (elShipping) elShipping.textContent = shipping > 0 ? '$' + shipping.toLocaleString('es-MX', { minimumFractionDigits: 2 }) : 'Gratis';
    if (elTotal) elTotal.textContent = '$' + total.toLocaleString('es-MX', { minimumFractionDigits: 2 });
  }

  document.querySelectorAll('.qty-input').forEach(function (input) {
    input.addEventListener('input', function () {
      input.value = input.value.replace(/[^0-9]/g, '');
      if (parseInt(input.value) < 1 || input.value === '') input.value = 1;
      recalculate();
    });

    input.addEventListener('keydown', function (e) {
      const allowed = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete'];
      if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
        e.preventDefault();
      }
    });
  });

  document.querySelectorAll('.qty-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const row = btn.closest('.cart-row');
      const input = row.querySelector('.qty-input');
      let val = parseInt(input.value) || 1;
      if (btn.dataset.action === 'plus') val++;
      if (btn.dataset.action === 'minus') val = Math.max(1, val - 1);
      input.value = val;
      recalculate();
    });
  });

  document.querySelectorAll('.btn-remove-item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const row = btn.closest('.cart-row');
      row.style.animation = 'fadeUp 0.3s reverse ease';
      setTimeout(function () { row.remove(); recalculate(); }, 280);
    });
  });

  const checkoutBtn = document.getElementById('btn-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
      showToast('Pedido procesado! Recibiras un correo de confirmacion');
    });
  }

  recalculate();
}

/* --- Pagina: BUSQUEDA -------------------------------------- */
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('btn-search');
  const resultsQuery = document.getElementById('search-results-query');
  const resultsArea = document.getElementById('search-results-area');
  const placeholder = document.getElementById('search-placeholder');
  const resultsHeader = document.getElementById('results-header');

  /* Todos los productos REALES de la tienda */
  var allProducts = [
    { name: 'Audifonos ProSound X9', price: '$2,499', img: 'images/product_headphones.png', cat: 'Audio', keywords: ['audio', 'audifonos', 'auriculares', 'sonido', 'headphones', 'musica'] },
    { name: 'UltraBook Pro 14', price: '$18,999', img: 'images/product_laptop.png', cat: 'Laptops', keywords: ['laptop', 'computadora', 'portatil', 'ultrabook', 'notebook', 'pc'] },
    { name: 'FitPro Serie 5', price: '$3,299', img: 'images/product_smartwatch.png', cat: 'Wearables', keywords: ['smartwatch', 'reloj', 'wearable', 'fitpro', 'watch', 'pulsera'] },
    { name: 'Galaxy Z Ultra', price: '$24,999', img: 'images/product_phone.png', cat: 'Smartphones', keywords: ['smartphone', 'celular', 'telefono', 'galaxy', 'movil', 'samsung'] },
    { name: 'ViewMax Pro 11', price: '$8,499', img: 'images/product_tablet.png', cat: 'Tablets', keywords: ['tablet', 'ipad', 'pantalla', 'viewmax', 'tableta'] },
    { name: 'Camisa Casual', price: '$350', img: 'images/camisa.png', cat: 'Ropa', keywords: ['camisa', 'ropa', 'playera', 'camiseta', 'vestimenta', 'casual', 'tela'] },
    { name: 'Camisa Estampada', price: '$420', img: 'images/camisa 2.png', cat: 'Ropa', keywords: ['camisa', 'ropa', 'playera', 'camiseta', 'estampada', 'vestimenta', 'tela'] },
    { name: 'Sudadera con Capucha', price: '$680', img: 'images/sudadera.png', cat: 'Ropa', keywords: ['sudadera', 'hoodie', 'ropa', 'capucha', 'sueter', 'abrigo', 'frio'] },
    { name: 'Sudadera Oversize', price: '$590', img: 'images/sudadera 2.png', cat: 'Ropa', keywords: ['sudadera', 'hoodie', 'ropa', 'oversize', 'sueter', 'urbano', 'frio'] }
  ];

  /* Normaliza texto: minusculas sin acentos */
  function norm(str) {
    return str.toLowerCase()
      .replace(/[áàä]/g, 'a')
      .replace(/[éèë]/g, 'e')
      .replace(/[íìï]/g, 'i')
      .replace(/[óòö]/g, 'o')
      .replace(/[úùü]/g, 'u')
      .replace(/ñ/g, 'n');
  }

  function performSearch(query) {
    var q = norm(query.trim());
    if (!q) return;

    /* Filtrar productos que coincidan */
    var found = allProducts.filter(function (p) {
      if (norm(p.name).indexOf(q) !== -1) return true;
      if (norm(p.cat).indexOf(q) !== -1) return true;
      return p.keywords.some(function (k) {
        return norm(k).indexOf(q) !== -1 || q.indexOf(norm(k)) !== -1;
      });
    });

    /* Texto de resultados */
    resultsQuery.classList.add('visible');
    resultsQuery.innerHTML = 'Resultados para: <strong>"' + query + '"</strong>';

    /* Limpiar */
    resultsArea.innerHTML = '';

    if (found.length === 0) {
      resultsArea.innerHTML =
        '<div style="grid-column:1/-1;text-align:center;padding:3rem 1rem;color:#94a3b8">' +
        '<div style="font-size:3rem;margin-bottom:1rem">&#128577;</div>' +
        '<p style="font-size:1rem;margin-bottom:0.5rem">No encontramos "<strong>' + query + '</strong>"</p>' +
        '<p style="font-size:0.85rem">Intenta con: sudadera, camisa, laptop, audifonos, celular...</p>' +
        '</div>';
      if (resultsHeader) {
        resultsHeader.style.display = 'flex';
        resultsHeader.querySelector('span').textContent = '0 productos encontrados';
      }
    } else {
      found.forEach(function (p, i) {
        var card = document.createElement('div');
        card.className = 'product-card catalog-card';
        card.style.animationDelay = (i * 0.06) + 's';
        card.style.animation = 'fadeUp 0.4s ease both';
        card.innerHTML =
          '<div class="product-img-wrap">' +
          '<img src="' + p.img + '" alt="' + p.name + '" style="object-fit:contain;padding:0.5rem" />' +
          '</div>' +
          '<div class="product-info">' +
          '<span class="product-category">' + p.cat + '</span>' +
          '<p class="product-name">' + p.name + '</p>' +
          '<div class="product-price-row">' +
          '<span class="product-price">' + p.price + '</span>' +
          '<button class="btn btn-primary btn-sm btn-add-to-cart" data-name="' + p.name + '">' +
          'Agregar' +
          '</button>' +
          '</div>' +
          '</div>';
        resultsArea.appendChild(card);
      });

      if (resultsHeader) {
        resultsHeader.style.display = 'flex';
        var txt = found.length + ' producto' + (found.length !== 1 ? 's' : '') +
          ' encontrado' + (found.length !== 1 ? 's' : '');
        resultsHeader.querySelector('span').textContent = txt;
      }
    }

    /* Re-vincular botones de carrito */
    resultsArea.querySelectorAll('.btn-add-to-cart').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setCartCount(getCartCount() + 1);
        showToast('"' + btn.dataset.name + '" agregado al carrito');
      });
    });

    if (placeholder) placeholder.style.display = 'none';
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', function () {
      performSearch(searchInput.value);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') performSearch(searchInput.value);
    });
  }

  /* Tags de busqueda rapida */
  document.querySelectorAll('.search-tag').forEach(function (tag) {
    tag.addEventListener('click', function () {
      /* Quitar emojis y espacios extra del tag */
      var text = tag.textContent.replace(/[^\w\s]/g, '').trim();
      searchInput.value = text;
      performSearch(text);
    });
  });
}

/* --- Init global ------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  setActiveNavLink();
  updateCartBadge();

  var page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '') initIndex();
  if (page === 'catalogo.html') initCatalog();
  if (page === 'registro.html') initRegister();
  if (page === 'nosotros.html') initAbout();
  if (page === 'carrito.html') initCart();
  if (page === 'busqueda.html') initSearch();
});
