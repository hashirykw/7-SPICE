(function () {
  const form = $('#resForm');
  const dateInput = form.date;
  const today = new Date();
  dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    const check = (name, cond) => {
      form[name].closest('.field').classList.toggle('err', !cond);
      if (!cond) ok = false;
    };
    check('name', form.name.value.trim().length > 1);
    check('phone', /^[0-9+\-\s]{10,}$/.test(form.phone.value.trim()));
    check('date', form.date.value !== '');
    check('time', form.time.value !== '');
    check('guests', form.guests.value !== '');
    if (!ok) return form.querySelector('.err input, .err select')?.focus();

    const date = new Date(form.date.value + 'T00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    const lines = [
      'Table booking from the 7 Spice website',
      '',
      `Name: ${form.name.value.trim()}`,
      `Phone: ${form.phone.value.trim()}`,
      `Date: ${date}`,
      `Slot: ${form.time.value}`,
      `Guests: ${form.guests.value}`,
      `Seating: ${form.seating.value}`,
      ...(form.notes.value.trim() ? [`Notes: ${form.notes.value.trim()}`] : []),
    ];
    openWhatsApp(lines.join('\n'));

    const done = $('#resOk');
    done.classList.add('show');
    done.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  });

  form.addEventListener('input', e => e.target.closest('.field')?.classList.remove('err'));
})();
