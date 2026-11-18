"use client";

import { useEffect, useId, useRef } from "react";
import { motion, useMotionTemplate, useSpring } from "motion/react";

const artwork = "/images/party-scene.webp";
const gazeOrigin = { x: 1334, y: 324 };
const leftEye = "M1299 317 Q1301 310 1308 309.5 Q1314 308 1316 314 Q1318 320 1311 323.8 Q1304 327 1300 322.5 Q1298.5 320 1299 317Z";
const rightEye = "M1346.5 335.5 Q1351 328.5 1358.7 325.4 Q1368.5 322.8 1372.7 334.8 Q1368 341 1360.5 341.2 Q1352 341 1346.5 335.5Z";

export function PartyArtwork() {
  const id = useId();
  const sceneRef = useRef<SVGSVGElement>(null);
  const dogRef = useRef<SVGGElement>(null);
  const gazeX = useSpring(0, { duration: 0.5, bounce: 0.2 });
  const gazeY = useSpring(0, { duration: 0.5, bounce: 0.2 });
  const pupilTransform = useMotionTemplate`translate(${gazeX}px, ${gazeY}px)`;

  useEffect(() => {
    const scene = sceneRef.current;
    const dog = dogRef.current;
    if (!scene || !dog) return;

    const hasFinePointer = window.matchMedia("(any-hover: hover) and (any-pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let tracking = false;
    let frame = 0;
    let clientX = 0;
    let clientY = 0;

    const resetGaze = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!tracking) return;
      tracking = false;
      scene.removeAttribute("data-tracking");
      gazeX.set(0);
      gazeY.set(0);
    };

    const updateGaze = () => {
      frame = 0;
      const transform = dog.getScreenCTM();
      if (!transform) return;
      const point = new DOMPoint(clientX, clientY).matrixTransform(transform.inverse());
      const dx = point.x - gazeOrigin.x;
      const dy = point.y - gazeOrigin.y;
      const distance = Math.max(Math.hypot(dx, dy), 160);

      gazeX.set((dx / distance) * 5.5);
      gazeY.set((dy / distance) * 4.4);
      if (!tracking) {
        tracking = true;
        scene.setAttribute("data-tracking", "");
      }
    };

    const followPointer = (event: PointerEvent) => {
      if (!visible || !hasFinePointer.matches || reducedMotion.matches || event.pointerType !== "mouse") return;
      clientX = event.clientX;
      clientY = event.clientY;
      if (!frame) frame = requestAnimationFrame(updateGaze);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      scene.toggleAttribute("data-in-view", visible);
      if (!visible) resetGaze();
    });
    observer.observe(scene);
    window.addEventListener("pointermove", followPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", resetGaze);
    window.addEventListener("blur", resetGaze);
    reducedMotion.addEventListener("change", resetGaze);
    hasFinePointer.addEventListener("change", resetGaze);

    return () => {
      observer.disconnect();
      resetGaze();
      window.removeEventListener("pointermove", followPointer);
      document.documentElement.removeEventListener("pointerleave", resetGaze);
      window.removeEventListener("blur", resetGaze);
      reducedMotion.removeEventListener("change", resetGaze);
      hasFinePointer.removeEventListener("change", resetGaze);
    };
  }, [gazeX, gazeY]);

  const photo = `#${id}-photo`;
  const url = (name: string) => `url(#${id}-${name})`;

  return (
    <svg ref={sceneRef} className="party-artwork" width="1536" height="1024" viewBox="0 0 1536 1024" aria-hidden="true" focusable="false">
      <defs>
        <image id={`${id}-photo`} href={artwork} width="1536" height="1024" />
        <filter id={`${id}-feather`} x="-12%" y="-12%" width="124%" height="124%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <filter id={`${id}-detail-feather`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id={`${id}-muzzle-feather`} x="-24%" y="-15%" width="148%" height="130%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <mask id={`${id}-left-cat`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="295" width="470" height="729">
          <path fill="white" filter={url("feather")} d="M-65 315H102C150 318 166 383 171 416C191 452 276 438 321 477C363 524 364 586 397 655C432 729 416 815 407 894C398 966 347 980 270 960L-65 994Z" />
        </mask>
        <mask id={`${id}-right-cat`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="1070" y="477" width="466" height="547">
          <path fill="white" filter={url("feather")} d="M1600 490H1520C1493 534 1407 528 1372 533C1327 511 1288 485 1248 493C1192 495 1214 572 1173 611C1127 655 1102 725 1105 815C1107 922 1167 976 1227 965L1600 1000Z" />
        </mask>
        <mask id={`${id}-dog`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="1184" y="108" width="352" height="440">
          <path fill="white" filter={url("feather")} d="M1340 124C1380 120 1432 115 1453 148C1475 180 1451 222 1465 240C1495 256 1483 316 1483 357C1485 414 1495 480 1436 498C1372 516 1296 513 1246 493C1209 480 1208 459 1218 413C1226 377 1226 329 1244 286C1257 259 1290 233 1299 194C1307 155 1322 133 1340 124Z" />
        </mask>
        <clipPath id={`${id}-cup-and-paw`}>
          <path d="M236 733C228 716 252 712 281 719C326 725 376 743 379 762C381 769 376 775 369 778L314 901C304 915 247 899 225 886C195 903 163 910 140 907C115 900 111 878 132 857C151 836 187 820 214 805C220 800 226 797 231 796Z" />
        </clipPath>
        <mask id={`${id}-cup-space`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="174" y="693" width="230" height="240">
          <path fill="white" filter={url("detail-feather")} d="M225 728C224 709 251 706 286 713C337 721 388 741 386 766C385 777 376 782 368 794L320 905C306 921 246 906 221 891C202 887 189 867 189 850C189 823 208 810 221 799Z" />
        </mask>
        <clipPath id={`${id}-cup-space-fur`}>
          <path d="M178 703H359C347 735 343 761 343 790C337 819 340 846 350 876C358 901 352 923 336 941H178Z" />
        </clipPath>
        <mask id={`${id}-mouth-space`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="1247" y="649" width="183" height="244">
          <path fill="white" filter={url("muzzle-feather")} d="M1293 679C1305 669 1359 669 1377 677C1398 691 1399 726 1392 763C1388 796 1387 843 1367 863C1345 885 1308 876 1292 856C1277 832 1278 785 1277 750C1277 721 1276 693 1293 679Z" />
        </mask>
        <clipPath id={`${id}-upper-mouth`}><rect x="1247" y="680" width="183" height="117" /></clipPath>
        <clipPath id={`${id}-lower-mouth`}><rect x="1247" y="795" width="183" height="88" /></clipPath>
        <clipPath id={`${id}-left-eye`}><path d={leftEye} /></clipPath>
        <clipPath id={`${id}-right-eye`}><path d={rightEye} /></clipPath>
        <radialGradient id={`${id}-sclera`} cx="50%" cy="47%" r="68%">
          <stop stopColor="#f2d9bd" />
          <stop offset=".68" stopColor="#b9a396" />
          <stop offset="1" stopColor="#62524d" />
        </radialGradient>
        <radialGradient id={`${id}-iris`} cx="52%" cy="45%" r="54%">
          <stop offset=".28" stopColor="#0a0606" />
          <stop offset=".72" stopColor="#261715" />
          <stop offset=".89" stopColor="#3e2b23" />
          <stop offset="1" stopColor="#100a09" />
        </radialGradient>
      </defs>

      <use href={photo} />
      <g className="party-meme-layer" mask={url("left-cat")}>
        <g className="party-animated party-meme-left">
          <use href={photo} />
          <g className="party-animated party-sip-cover" mask={url("cup-space")}>
            <use href={photo} transform="translate(-170 100)" />
            <g clipPath={url("cup-space-fur")}>
              <use href={photo} transform="matrix(1.45 0 0 2.3 -142.5 -736)" />
            </g>
            <path d="M359 703C347 735 343 761 343 790C337 819 340 846 350 876C358 901 352 923 336 941" fill="none" stroke="#fff3ed" strokeWidth="5" />
          </g>
          <g className="party-animated party-sip-cup">
            <g clipPath={url("cup-and-paw")}><use href={photo} /></g>
          </g>
        </g>
      </g>
      <g className="party-meme-layer" mask={url("right-cat")}>
        <g className="party-animated party-meme-right">
          <use href={photo} />
          <g mask={url("mouth-space")}>
            {/* Both slices share a moving seam so the chin follows the closing mouth. */}
            <g className="party-animated party-mouth-upper">
              <g clipPath={url("upper-mouth")}><use href={photo} /></g>
            </g>
            <g className="party-animated party-mouth-lower">
              <g clipPath={url("lower-mouth")}><use href={photo} /></g>
            </g>
            <path className="party-animated party-mouth-lip" d="M1312 686C1322 688 1329 692 1338 688C1347 691 1357 690 1364 687" fill="none" stroke="#67403b" strokeLinecap="round" strokeWidth="2" />
          </g>
        </g>
      </g>
      <g className="party-meme-layer" mask={url("dog")}>
        <g ref={dogRef} className="party-animated party-meme-dog">
          <use href={photo} />
          <g className="party-dog-eyes">
            <g clipPath={url("left-eye")}>
              <path d={leftEye} fill={url("sclera")} />
              <motion.g className="party-pupil" style={{ transform: pupilTransform }}>
                <ellipse cx="1309.5" cy="316.4" rx="7.7" ry="8.1" fill={url("iris")} />
                <ellipse cx="1308.1" cy="313.4" rx="1.15" ry=".84" fill="#fff4e6" opacity=".89" />
              </motion.g>
            </g>
            <g clipPath={url("right-eye")}>
              <path d={rightEye} fill={url("sclera")} />
              <motion.g className="party-pupil" style={{ transform: pupilTransform }}>
                <ellipse cx="1361.9" cy="335.3" rx="9.7" ry="8.6" fill={url("iris")} />
                <ellipse cx="1360.4" cy="331.9" rx="1.35" ry=".92" fill="#fff4e6" opacity=".89" />
              </motion.g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
