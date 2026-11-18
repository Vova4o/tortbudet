"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, CalendarCheck, Check, CircleCheck, Heart, X } from "lucide-react";
import event from "@/config/event.json";
import { readRsvp, saveRsvp, type GuestResponse, type RsvpErrors } from "@/lib/rsvp.mjs";

const emptyResponse: GuestResponse = { name: "", attendance: "yes", guests: 1, comment: "" };

export function Rsvp() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const reducedMotion = useReducedMotion();
  const [response, setResponse] = useState<GuestResponse>(emptyResponse);
  const [saved, setSaved] = useState<GuestResponse | null>(null);
  const [errors, setErrors] = useState<RsvpErrors>({});
  const [storageError, setStorageError] = useState("");
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const previous = readRsvp(window.localStorage, event.rsvpStorageKey, event.maxGuests);
      if (previous) { setSaved(previous); setResponse(previous); }
    } catch {
      setStorageError("Браузер запретил сохранение. Разреши хранение данных для этого сайта и попробуй снова.");
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  function openDialog() {
    setSuccess(false);
    setErrors({});
    setResponse(saved ?? emptyResponse);
    dialogRef.current?.showModal();
    setOpen(true);
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function submitResponse(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setStorageError("");
    try {
      const result = saveRsvp(window.localStorage, event.rsvpStorageKey, response, event.maxGuests);
      if (!result.ok) {
        setErrors(result.errors);
        if (result.errors.name) nameRef.current?.focus();
        return;
      }
      setSaved(result.value);
      setResponse(result.value);
      setErrors({});
      setSuccess(true);
    } catch {
      setStorageError("Не получилось сохранить ответ. Разреши хранение данных в браузере и попробуй ещё раз.");
    }
  }

  return (
    <div id="rsvp" className="rsvp-block">
      <motion.button ref={buttonRef} className="rsvp-button" type="button" onClick={openDialog} whileHover={reducedMotion ? undefined : { scale: 1.035, y: -2 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }}>
        {saved ? <CircleCheck size={23} aria-hidden="true" /> : <CalendarCheck size={23} aria-hidden="true" />}
        <span>{saved ? "ИЗМЕНИТЬ ОТВЕТ (RSVP)" : "ПОДТВЕРДИТЬ УЧАСТИЕ (RSVP)"}</span>
        <ArrowRight size={21} aria-hidden="true" />
      </motion.button>
      <p className="rsvp-note"><Heart size={13} aria-hidden="true" /> Очень жду тебя. Без тебя будет не то!</p>

      <dialog ref={dialogRef} className="rsvp-dialog" aria-labelledby="rsvp-title" onClose={() => { setOpen(false); buttonRef.current?.focus(); }} onClick={(clickEvent) => {
        const bounds = clickEvent.currentTarget.getBoundingClientRect();
        if (clickEvent.target === clickEvent.currentTarget && (clickEvent.clientX < bounds.left || clickEvent.clientX > bounds.right || clickEvent.clientY < bounds.top || clickEvent.clientY > bounds.bottom)) closeDialog();
      }}>
        <button className="dialog-close" type="button" onClick={closeDialog} aria-label="Закрыть форму"><X size={21} aria-hidden="true" /></button>
        <AnimatePresence mode="wait" initial={false}>
          {success ? (
            <motion.div key="success" className="success-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.2 }}>
              <span className="success-icon"><Check size={34} aria-hidden="true" /></span>
              <h2 id="rsvp-title">{response.attendance === "yes" ? "Ты в деле!" : "Будем скучать!"}</h2>
              <p>{response.attendance === "yes" ? `${response.name}, оставим тебе кусочек торта.` : `${response.name}, спасибо, что предупредил(а).`}</p>
              <p className="storage-notice">Твой ответ сохранён в этом браузере. Чтобы организатор узнал о нём, напиши ему лично.</p>
              <button className="form-submit" type="button" onClick={closeDialog}>Отлично <Heart size={18} aria-hidden="true" /></button>
            </motion.div>
          ) : (
            <motion.form key="form" noValidate onSubmit={submitResponse} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.2 }}>
              <span className="dialog-sticker" aria-hidden="true"><CalendarCheck size={27} /></span>
              <h2 id="rsvp-title">Ну что, ты с нами?</h2>
              <p className="dialog-subtitle">Дай знать, чтобы торта хватило всем.</p>
              <div className="form-field">
                <label htmlFor="guest-name">Как тебя зовут?</label>
                <input ref={nameRef} id="guest-name" name="name" autoComplete="given-name" autoFocus required maxLength={80} placeholder="Твоё имя" value={response.name} onChange={(e) => setResponse({ ...response, name: e.target.value })} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
                {errors.name && <p className="field-error" id="name-error">{errors.name}</p>}
              </div>
              <fieldset className="attendance-field"><legend>Получится прийти?</legend>
                <div className="attendance-options">
                  <label className={response.attendance === "yes" ? "selected" : ""}><input type="radio" name="attendance" value="yes" checked={response.attendance === "yes"} onChange={() => setResponse({ ...response, attendance: "yes", guests: response.guests || 1 })} /><Check size={17} aria-hidden="true" /> Конечно, приду!</label>
                  <label className={response.attendance === "no" ? "selected" : ""}><input type="radio" name="attendance" value="no" checked={response.attendance === "no"} onChange={() => setResponse({ ...response, attendance: "no" })} />Не смогу</label>
                </div>
              </fieldset>
              {response.attendance === "yes" && <div className="form-field"><label htmlFor="guest-count">Сколько вас будет, включая тебя?</label><select id="guest-count" name="guests" value={response.guests} onChange={(e) => setResponse({ ...response, guests: Number(e.target.value) })} aria-invalid={Boolean(errors.guests)} aria-describedby={errors.guests ? "guests-error" : undefined}>{Array.from({ length: event.maxGuests }, (_, i) => <option value={i + 1} key={i + 1}>{i === 0 ? "Только я" : i + 1}</option>)}</select>{errors.guests && <p className="field-error" id="guests-error">{errors.guests}</p>}</div>}
              <div className="form-field"><label htmlFor="guest-comment">Хочешь что-нибудь добавить? <span>необязательно</span></label><textarea id="guest-comment" name="comment" maxLength={500} rows={3} placeholder="Например, про аллергию или любимый трек" value={response.comment} onChange={(e) => setResponse({ ...response, comment: e.target.value })} aria-invalid={Boolean(errors.comment)} aria-describedby={errors.comment ? "comment-error" : undefined} />{errors.comment && <p className="field-error" id="comment-error">{errors.comment}</p>}</div>
              {storageError && <p className="field-error storage-error" role="alert">{storageError}</p>}
              <p className="storage-notice">Ответ сохраняется на этом устройстве. Не забудь сообщить организатору лично.</p>
              <button className="form-submit" type="submit">Сохранить ответ <ArrowRight size={19} aria-hidden="true" /></button>
            </motion.form>
          )}
        </AnimatePresence>
      </dialog>
    </div>
  );
}
