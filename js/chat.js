(function () {
  const ANSWERS = [
    { k: ['buffet', '1199', 'price', 'rate', 'cost', 'charges', 'kitna', 'kitne'],
      a: 'The buffet is <b>Rs.1199 + tax</b> per person. 40+ dishes: live BBQ, desi, Chinese, a salad bar and desserts.' },
    { k: ['timing', 'timings', 'time', 'open', 'hours', 'close', 'closing', 'when', 'hi-tea', 'hitea', 'tea'],
      a: '<b>Hi-Tea</b> (Fri–Sun): 4:30–6:30 pm<br><b>Dinner</b>: 7:00–9:00 pm or 9:30–11:30 pm' },
    { k: ['location', 'address', 'where', 'directions', 'reach', 'map', 'kahan'],
      a: 'Rooftop of <b>Double Cheeze</b>, Sharah-e-Sher Shah Suri, Block D, North Nazimabad. Opposite Saima Paari Mall.' },
    { k: ['book', 'booking', 'reserve', 'reservation', 'table', 'seat'],
      a: 'Use the booking form near the bottom of the page. It sends your booking to us on WhatsApp. Or call <b>0331 6237717</b>.' },
    { k: ['menu', 'order', 'food', 'dish', 'dishes', 'eat'],
      a: 'BBQ, desi mains, Chinese, appetizers, soups, salads and desserts. It\'s all in the Menu section, and you can order from there.' },
    { k: ['deliver', 'delivery', 'home'],
      a: 'Yes. Add dishes to your cart, pick Delivery at checkout, and the order goes to us on WhatsApp.' },
    { k: ['phone', 'call', 'contact', 'number', 'whatsapp'],
      a: 'Call or WhatsApp <b>0331 6237717</b>.' },
    { k: ['bbq', 'grill', 'kebab', 'tikka', 'boti', 'seekh'],
      a: 'The grill runs all through dinner: malai boti, seekh kebab and tikka, cooked to order.' },
    { k: ['birthday', 'event', 'party', 'celebrate', 'anniversary', 'group'],
      a: 'Birthdays and group dinners are welcome. Mention it in the notes when you book, or call us to plan it.' },
    { k: ['veg', 'vegetarian', 'halal'],
      a: 'All our food is halal. Vegetarian options include dal makhani, salads and soups.' },
    { k: ['instagram', 'insta', 'social'],
      a: 'We\'re <b>@7spicepk</b> on Instagram.' },
    { k: ['thank', 'thanks', 'shukriya', 'jazakallah'],
      a: 'Anytime. See you at 7 Spice.' },
    { k: ['salam', 'assalam', 'aoa', 'assalamualaikum'],
      a: 'Walaikum assalam! Ask about the buffet, menu, timings or booking.' },
    { k: ['hi', 'hello', 'hey'],
      a: 'Hi! Ask about the buffet, menu, timings or booking.' },
  ];
  const QUICK = ['Buffet price', 'Timings', 'Location', 'Book a table'];
  const FALLBACK = 'I don\'t have an answer for that one. Call or WhatsApp <b>0331 6237717</b> and the team will help.';

  const fab = $('#chatFab'), panel = $('#chatPanel'), body = $('#chatBody'), input = $('#chatInput');
  let started = false;

  function answer(q) {
    const text = ' ' + q.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ') + ' ';
    let best = null, score = 0;
    for (const item of ANSWERS) {
      const hits = item.k.filter(k => k.length <= 3 ? text.includes(` ${k} `) : text.includes(` ${k}`)).length;
      if (hits > score) { score = hits; best = item.a; }
    }
    return best || FALLBACK;
  }
  function add(html, who) {
    const m = document.createElement('div');
    m.className = 'msg ' + who;
    m.innerHTML = html;
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
  }
  function ask(q) {
    q = q.trim();
    if (!q) return;
    add(esc(q), 'user');
    input.value = '';
    const typing = document.createElement('div');
    typing.className = 'chat-typing show';
    typing.innerHTML = '<i></i><i></i><i></i>';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;
    setTimeout(() => { typing.remove(); add(answer(q), 'bot'); }, 450);
  }
  function setOpen(open) {
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', !open);
    fab.hidden = open;
    if (open && !started) {
      started = true;
      $('#chatQuick').innerHTML = QUICK.map(q => `<button type="button">${q}</button>`).join('');
      add('Assalam-o-Alaikum. I can answer quick questions about the buffet, menu, timings and bookings.', 'bot');
    }
    if (open && matchMedia('(pointer: fine)').matches) setTimeout(() => input.focus(), 80);
  }

  fab.addEventListener('click', () => setOpen(true));
  $('#chatClose').addEventListener('click', () => setOpen(false));
  $('#chatQuick').addEventListener('click', e => { if (e.target.tagName === 'BUTTON') ask(e.target.textContent); });
  $('#chatForm').addEventListener('submit', e => { e.preventDefault(); ask(input.value); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) setOpen(false); });
})();
