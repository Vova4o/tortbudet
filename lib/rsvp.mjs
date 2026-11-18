/** Validate and normalize a guest response before it reaches browser storage. */
export function validateRsvp(input, maxGuests = 10) {
  const errors = {};
  const name = typeof input?.name === "string" ? input.name.trim() : "";
  const attendance = input?.attendance;
  const comment = typeof input?.comment === "string" ? input.comment.trim() : "";
  const guests = attendance === "no" ? 0 : Number(input?.guests);

  if (!name || name.length > 80) errors.name = "Напиши имя: от 1 до 80 символов.";
  if (attendance !== "yes" && attendance !== "no") errors.attendance = "Выбери, сможешь ли ты прийти.";
  if (attendance === "yes" && (!Number.isInteger(guests) || guests < 1 || guests > maxGuests)) {
    errors.guests = `Укажи от 1 до ${maxGuests} гостей, включая тебя.`;
  }
  if (comment.length > 500) errors.comment = "Сократи комментарий до 500 символов.";

  return Object.keys(errors).length
    ? { ok: false, errors }
    : { ok: true, value: { name, attendance, guests, comment } };
}

/** Read only valid responses; damaged or outdated data is treated as empty. */
export function readRsvp(storage, key, maxGuests = 10) {
  const raw = storage.getItem(key);
  if (!raw) return null;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  const result = validateRsvp(parsed, maxGuests);
  return result.ok ? result.value : null;
}

/** Persist a validated response; let the caller handle unavailable storage. */
export function saveRsvp(storage, key, input, maxGuests = 10) {
  const result = validateRsvp(input, maxGuests);
  if (!result.ok) return result;
  storage.setItem(key, JSON.stringify(result.value));
  return result;
}
