const DISHES = Object.fromEntries(Object.values(MENU).flat().map(d => [d.id, d]));
let activeCat = Object.keys(MENU)[0];
let cart = [];
let payMethod = 'Cash on delivery';

// menu
function renderCats() {
  $('#cats').innerHTML = Object.keys(MENU).map(c => `
    <button class="cat${c === activeCat ? ' active' : ''}" type="button" role="tab"
      aria-selected="${c === activeCat}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
}
function renderMenu() {
  $('#menuGrid').innerHTML = MENU[activeCat].map((d, i) => `
    <article class="dish" data-reveal style="--i:${i}">
      <div class="dish-img"><img src="${d.img}" alt="${esc(d.n)}" loading="lazy" decoding="async" width="400" height="300"></div>
      <div class="dish-body">
        ${d.tag ? `<span class="dish-tag">${esc(d.tag)}</span>` : ''}
        <h3>${esc(d.n)}</h3>
        <p class="desc">${esc(d.d)}</p>
        <div class="dish-foot">
          <span class="price">${money(d.p)}</span>
          <button class="add-btn" type="button" data-add="${d.id}">+ Add</button>
        </div>
      </div>
    </article>`).join('');
  observeReveals($('#menuGrid'));
}
$('#cats').addEventListener('click', e => {
  const b = e.target.closest('[data-cat]');
  if (!b || b.dataset.cat === activeCat) return;
  activeCat = b.dataset.cat;
  renderCats(); renderMenu();
});
$('#menuGrid').addEventListener('click', e => {
  const b = e.target.closest('[data-add]');
  if (b) addToCart(b.dataset.add);
});

// cart
const count = () => cart.reduce((s, i) => s + i.q, 0);
const subtotal = () => cart.reduce((s, i) => s + i.p * i.q, 0);

function addToCart(id) {
  const ex = cart.find(i => i.id === id);
  if (ex) ex.q++; else cart.push({ ...DISHES[id], q: 1 });
  updateCart();
  showToast(`${DISHES[id].n} added`);
}
function changeQty(id, delta) {
  const it = cart.find(i => i.id === id);
  if (!it) return;
  it.q += delta;
  if (it.q <= 0) cart = cart.filter(i => i.id !== id);
  updateCart();
}
function updateCart() {
  const n = count();
  const cc = $('#cartCount');
  cc.textContent = n;
  cc.classList.toggle('show', n > 0);
  $('#cartBtn').setAttribute('aria-label', n ? `Open cart, ${n} item${n > 1 ? 's' : ''}` : 'Open cart');

  const foot = $('#cartFoot');
  if (!cart.length) {
    $('#cartItems').innerHTML = '<div class="cart-empty"><p>Nothing here yet.<br>Add dishes from the menu.</p></div>';
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  $('#cartItems').innerHTML = cart.map(i => `
    <div class="c-item">
      <img src="${i.img}" alt="" width="60" height="60" loading="lazy">
      <div class="ci-body">
        <h3>${esc(i.n)}</h3>
        <div class="ci-price">${money(i.p * i.q)}</div>
        <button class="ci-remove" type="button" data-remove="${i.id}">Remove</button>
      </div>
      <div class="qty">
        <button type="button" data-qty="${i.id}" data-d="-1" aria-label="One less ${esc(i.n)}">−</button>
        <span>${i.q}</span>
        <button type="button" data-qty="${i.id}" data-d="1" aria-label="One more ${esc(i.n)}">+</button>
      </div>
    </div>`).join('');
  $('#cartTotal').textContent = money(subtotal());
}
$('#cartItems').addEventListener('click', e => {
  const q = e.target.closest('[data-qty]');
  if (q) return changeQty(q.dataset.qty, +q.dataset.d);
  const r = e.target.closest('[data-remove]');
  if (r) changeQty(r.dataset.remove, -Infinity);
});

const drawer = $('#cartDrawer');
function openCart() {
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  $('#overlayBg').classList.add('show');
  lockScroll(true);
  setTimeout(() => $('.close-x', drawer).focus(), 50);
}
function closeCart() {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  $('#overlayBg').classList.remove('show');
  lockScroll(false);
}
$('#cartBtn').addEventListener('click', openCart);
$('#overlayBg').addEventListener('click', closeCart);
$('[data-close-cart]').addEventListener('click', closeCart);
$('#checkoutBtn').addEventListener('click', openCheckout);

// checkout
const modal = $('#checkoutModal');
const card = $('#checkoutCard');

function totals(type) {
  const sub = subtotal();
  const tax = Math.round(sub * SITE.taxRate);
  const delivery = type === 'Pickup' ? 0 : SITE.deliveryFee;
  return { sub, tax, delivery, total: sub + tax + delivery };
}
function renderSummary() {
  const type = $('[name=ctype]', card)?.value;
  const t = totals(type);
  $('#coSummary').innerHTML = `
    ${cart.map(i => `<div class="row"><span>${esc(i.n)} × ${i.q}</span><span>${money(i.p * i.q)}</span></div>`).join('')}
    <div class="row"><span>Tax (${Math.round(SITE.taxRate * 100)}%)</span><span>${money(t.tax)}</span></div>
    <div class="row"><span>Delivery</span><span>${t.delivery ? money(t.delivery) : 'None'}</span></div>
    <div class="row tot"><span>Estimated total</span><span>${money(t.total)}</span></div>`;
}
function openCheckout() {
  if (!cart.length) return showToast('Your cart is empty');
  closeCart();
  card.innerHTML = $('#checkoutTpl').innerHTML;
  payMethod = 'Cash on delivery';
  renderSummary();
  modal.classList.add('show');
  lockScroll(true);
  setTimeout(() => $('#c-name').focus({ preventScroll: true }), 60);
}
function closeCheckout() {
  modal.classList.remove('show');
  lockScroll(false);
}
modal.addEventListener('click', e => {
  if (e.target.closest('[data-close-checkout]')) return closeCheckout();
  const opt = e.target.closest('.pay-opt');
  if (opt) {
    $$('.pay-opt', card).forEach(o => o.setAttribute('aria-checked', o === opt));
    payMethod = opt.dataset.pay;
  }
});
modal.addEventListener('input', e => e.target.closest('.co-field')?.classList.remove('err'));
modal.addEventListener('change', e => {
  e.target.closest('.co-field')?.classList.remove('err');
  if (e.target.name !== 'ctype') return;
  $('#addrField').hidden = e.target.value === 'Pickup';
  renderSummary();
});

const validPhone = v => /^[0-9+\-\s]{10,}$/.test(v.trim());

modal.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  let ok = true;
  const check = (name, cond) => {
    f.querySelector(`[name=${name}]`).closest('.co-field').classList.toggle('err', !cond);
    if (!cond) ok = false;
  };
  const isDelivery = f.ctype.value === 'Delivery';
  check('cname', f.cname.value.trim().length > 1);
  check('cphone', validPhone(f.cphone.value));
  check('ctype', f.ctype.value !== '');
  check('caddr', !isDelivery || f.caddr.value.trim().length >= 5);
  if (!ok) return f.querySelector('.err input, .err select, .err textarea')?.focus();

  const t = totals(f.ctype.value);
  const lines = [
    'New order from the 7 Spice website',
    '',
    ...cart.map(i => `${i.q} x ${i.n} - ${money(i.p * i.q)}`),
    '',
    `Subtotal: ${money(t.sub)}`,
    `Tax: ${money(t.tax)}`,
    `Delivery: ${t.delivery ? money(t.delivery) : 'None (pickup)'}`,
    `Estimated total: ${money(t.total)}`,
    '',
    `Name: ${f.cname.value.trim()}`,
    `Phone: ${f.cphone.value.trim()}`,
    `Type: ${f.ctype.value}`,
    ...(isDelivery ? [`Address: ${f.caddr.value.trim()}`] : []),
    `Payment: ${payMethod}`,
  ];
  openWhatsApp(lines.join('\n'));

  card.innerHTML = `
    <div class="order-done" role="status">
      <svg class="ic"><use href="#i-check"/></svg>
      <h2 id="coTitle">Almost done</h2>
      <p>Your order is filled in on WhatsApp. Hit send and we'll confirm it there. Nothing opened? Call ${SITE.phone}.</p>
      <button class="btn btn-gold" type="button" data-close-checkout>Close</button>
    </div>`;
  cart = [];
  updateCart();
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (modal.classList.contains('show')) closeCheckout();
  else if (drawer.classList.contains('open')) closeCart();
});

renderCats();
renderMenu();
updateCart();
