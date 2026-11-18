"use client";

import { motion, useReducedMotion } from "motion/react";
import { Crown, Sparkles } from "lucide-react";

export function HeroHeading() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div className="heading-wrap" initial={false} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 130, damping: 22 }}>
      <Crown className="hero-crown" size={54} strokeWidth={2.3} aria-hidden="true" />
      <Sparkles className="heading-sparkle" size={31} aria-hidden="true" />
      <h1 className={`hero-title${reducedMotion ? " no-motion" : ""}`}>
        <span className="title-invite">ПРИГЛАШАЮ ТЕБЯ</span>
        <span className="title-small">НА МОЙ</span>
        <span className="birthday-banner"><span>ДЕНЬ РОЖДЕНИЯ!</span></span>
      </h1>
      <span className="title-rays" aria-hidden="true"><i /><i /><i /></span>
    </motion.div>
  );
}
