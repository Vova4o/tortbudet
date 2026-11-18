import { CalendarDays, CakeSlice, Clock3, Disc3, Heart, MapPin, PartyPopper, Sparkles, Wine } from "lucide-react";
import event from "@/config/event.json";
import { HeroHeading } from "@/components/hero-heading";
import { Navigation } from "@/components/navigation";
import { PartyArtwork } from "@/components/party-artwork";
import { PartyAtmosphere } from "@/components/party-atmosphere";
import { Rsvp } from "@/components/rsvp";

const programIcons = { cake: CakeSlice, wine: Wine, disc: Disc3 };

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">К приглашению</a>
      <Navigation title={event.title} />
      <main id="main">
        <section className="party-hero" id="about" aria-label="Приглашение на день рождения">
          <div className="hero-art" aria-hidden="true">
            <PartyArtwork />
          </div>
          <div className="hero-shade" aria-hidden="true" />
          <PartyAtmosphere />
          <div className="hero-content">
            <div className="invitation-tag"><span /> У тебя официальное приглашение <PartyPopper size={15} aria-hidden="true" /></div>
            <HeroHeading />
            <p className="hero-description">Будет торт, веселье, классная компания<br className="desktop-break" /> и ещё больше поводов для мемов!</p>
            <div className="mobile-party-scene" aria-hidden="true">
              <PartyArtwork />
              <span className="mobile-legendary-sticker">БУДЕТ<br /><strong>ЛЕГЕНДАРНО!</strong></span>
            </div>

            <section className="event-details" id="details" aria-label="Где и когда встречаемся">
              <div className="detail-card"><CalendarDays size={26} strokeWidth={1.7} aria-hidden="true" /><div><p>Когда?</p><h2>{event.date}</h2></div></div>
              <div className="detail-card"><Clock3 size={27} strokeWidth={1.7} aria-hidden="true" /><div><p>Во сколько?</p><h2>{event.time}</h2></div></div>
              <div className="detail-card location-card"><MapPin size={28} strokeWidth={1.7} aria-hidden="true" /><div><p>Где?</p><h2>{event.location}</h2><span>{event.locationNote}</span></div></div>
            </section>
            <Rsvp />
          </div>

          <div className="comic-bubble retirement-bubble" aria-hidden="true">Ещё один год<br />ближе к пенсии <span>😎</span></div>
          <div className="comic-bubble doge-bubble" aria-hidden="true">Такой день рождения<br />пропускать нельзя!</div>
          <div className="legendary-sticker" aria-hidden="true">БУДЕТ<br /><strong>ЛЕГЕНДАРНО!</strong><Sparkles size={22} /></div>
          <div className="party-caption" aria-hidden="true"><span /> хорошая компания, плохие танцы <span /></div>
        </section>

        <section className="program-section" id="program" aria-labelledby="program-title">
          <div className="program-shell">
            <div className="program-intro"><span className="small-star" aria-hidden="true">✳</span><h2 id="program-title">ПЛАН НА ВЕЧЕР?</h2><p>Всё, что мы любим.</p></div>
            <div className="program-items">
              {event.program.map((item) => {
                const Icon = programIcons[item.icon as keyof typeof programIcons];
                return <div className={`program-item program-${item.color}`} key={item.title}><span className="program-icon"><Icon size={29} strokeWidth={1.7} aria-hidden="true" /></span><div><h3>{item.title}</h3><p>{item.description}</p></div></div>;
              })}
            </div>
            <div className="program-note"><Heart size={16} aria-hidden="true" /><span>Главный ингредиент — ты.</span></div>
          </div>
        </section>
      </main>
      <footer className="site-footer"><a href="#about"><PartyPopper size={17} aria-hidden="true" /> {event.title}</a><p>Сделано с любовью. И немножко с мемами.</p><span>До встречи на вечеринке <Heart size={13} aria-hidden="true" /></span></footer>
    </>
  );
}
