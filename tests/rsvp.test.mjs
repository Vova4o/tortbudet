import test from "node:test";
import assert from "node:assert/strict";
import { readRsvp, saveRsvp, validateRsvp } from "../lib/rsvp.mjs";

const response = { name: "  Саша  ", attendance: "yes", guests: 2, comment: "  Без орехов  " };

test("normalizes a valid attending guest response", () => {
  assert.deepEqual(validateRsvp(response), { ok: true, value: { name: "Саша", attendance: "yes", guests: 2, comment: "Без орехов" } });
});

test("rejects an empty guest name", () => {
  assert.deepEqual(Object.keys(validateRsvp({ ...response, name: "   " }).errors), ["name"]);
});

test("rejects an unsupported attendance value", () => {
  assert.deepEqual(Object.keys(validateRsvp({ ...response, attendance: "maybe" }).errors), ["attendance"]);
});

for (const guests of [0, -1, 1.5, 11, NaN, Infinity, "invalid"]) {
  test(`rejects invalid guest count ${guests}`, () => {
    assert.deepEqual(Object.keys(validateRsvp({ ...response, guests }).errors), ["guests"]);
  });
}

test("uses the configured guest limit", () => {
  assert.equal(validateRsvp({ ...response, guests: 4 }, 3).ok, false);
});

test("stores zero guests when declining the invitation", () => {
  assert.equal(validateRsvp({ ...response, attendance: "no", guests: 8 }).value.guests, 0);
});

test("rejects comments longer than 500 characters", () => {
  assert.deepEqual(Object.keys(validateRsvp({ ...response, comment: "я".repeat(501) }).errors), ["comment"]);
});

test("rejects names longer than 80 characters", () => {
  assert.deepEqual(Object.keys(validateRsvp({ ...response, name: "я".repeat(81) }).errors), ["name"]);
});

test("treats absent browser data as an empty response", () => {
  assert.equal(readRsvp({ getItem: () => null }, "rsvp"), null);
});

test("ignores corrupted browser data", () => {
  assert.equal(readRsvp({ getItem: () => "{broken" }, "rsvp"), null);
});

test("ignores saved responses that fail validation", () => {
  assert.equal(readRsvp({ getItem: () => JSON.stringify({ name: "" }) }, "rsvp"), null);
});

test("round-trips a guest response through storage", () => {
  const entries = new Map();
  const storage = { getItem: (key) => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value) };
  const saved = saveRsvp(storage, "rsvp", response);
  assert.equal(saved.ok, true);
  assert.deepEqual(readRsvp(storage, "rsvp"), saved.value);
});

test("does not write invalid responses to storage", () => {
  let writes = 0;
  const result = saveRsvp({ setItem: () => { writes++; } }, "rsvp", { ...response, name: "" });
  assert.equal(result.ok, false);
  assert.equal(writes, 0);
});

test("surfaces browser write failures for the UI to handle", () => {
  const storage = { setItem: () => { throw new Error("storage unavailable"); } };
  assert.throws(() => saveRsvp(storage, "rsvp", response), /storage unavailable/);
});

test("surfaces browser read failures for the UI to handle", () => {
  const storage = { getItem: () => { throw new Error("storage unavailable"); } };
  assert.throws(() => readRsvp(storage, "rsvp"), /storage unavailable/);
});
