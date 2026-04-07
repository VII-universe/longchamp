import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Timer, 
  MapPin, 
  Flag, 
  Heart, 
  Coffee,
  ChevronRight,
  Menu,
  X,
  CheckCircle2,
  List,
  ArrowRight
} from 'lucide-react';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// --- Custom Lottie Runner Cursor ---

const RunnerCursor = () => {
  const posRef = useRef({ x: -300, y: -300 });
  const rafRef = useRef<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          if (wrapRef.current) {
            // Runner sits to the LEFT and BELOW the cursor tip
            wrapRef.current.style.transform =
              `translate(${posRef.current.x - 60}px, ${posRef.current.y + 14}px)`;
          }
          rafRef.current = null;
        });
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 56,
        height: 56,
        pointerEvents: 'none',
        zIndex: 99999,
        willChange: 'transform',
        filter: 'invert(84%) sepia(32%) saturate(1076%) hue-rotate(98deg) brightness(102%) contrast(97%)',
      }}
    >
      <DotLottieReact
        src="https://lottie.host/659f7254-229a-4c4d-bf74-017e28599c72/YMCvFFpjuP.lottie"
        loop
        autoplay
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

// --- Helper Components ---

const Navbar = ({ onOpenReg }: { onOpenReg: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'O závodu', href: '#info' },
    { name: 'Trasy', href: '#races' },
    { name: 'Expo', href: '#expo' },
    { name: 'Merch', href: '#merch' },
    { name: 'Výhra', href: '#prize' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/assets/logo_2026.png" alt="Long Runners Champion 2026" className="h-10 lg:h-12 w-auto object-contain" />
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-bold uppercase tracking-widest hover:text-neon-green transition-colors">
              {link.name}
            </a>
          ))}
          <button 
            onClick={onOpenReg}
            className="bg-neon-green hover:bg-neon-hover text-black px-6 py-2 font-black uppercase text-sm skew-x-[-12deg] transition-all transform active:scale-95"
          >
            Registrovat se
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-asphalt-dark border-b border-white/10 p-8 flex flex-col gap-6 md:hidden"
          >
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-display font-bold uppercase">
                {link.name}
              </a>
            ))}
            <button 
              onClick={() => { onOpenReg(); setIsMobileMenuOpen(false); }}
              className="bg-neon-green text-black py-4 font-black uppercase italic"
            >
              Registrovat se
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2026-09-12T08:00:00');
    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const Item = ({ val, label }: { val: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="text-4xl md:text-6xl font-display font-black text-white tabular-nums">
        {val.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-neon-green font-bold">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex gap-6 md:gap-12 bg-black/40 backdrop-blur-sm p-6 md:p-8 border-l-4 border-neon-green skew-x-[-10deg]">
      <div className="flex gap-6 md:gap-12 skew-x-[10deg]">
        <Item val={timeLeft.days} label="Dny" />
        <Item val={timeLeft.hours} label="Hodiny" />
        <Item val={timeLeft.minutes} label="Minuty" />
        <Item val={timeLeft.seconds} label="Sekundy" />
      </div>
    </div>
  );
};

const Hero = ({ onOpenReg, onOpenMap }: { onOpenReg: () => void; onOpenMap: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.img 
          src="/assets/hero.png" 
          alt="Runner Runner" 
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-full h-full object-cover saturate-50 brightness-[0.5] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-asphalt-dark via-asphalt-dark/80 to-transparent"></div>
        <div className="absolute inset-0 bg-asphalt-texture opacity-30"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-9xl font-display font-black leading-[0.9] mb-4">
              PŘEKROČ <br />
              <span className="text-neon-green text-glow">SVŮJ LIMIT</span>
            </h1>
            <p className="max-w-lg text-lg text-gray-400 font-medium mb-8 border-l-2 border-white/20 pl-6">
              62 kilometrů skrze historické centrum, kopce a duši Prahy. Nejtěžší ultra-maraton, který vás buď zlomí, nebo z vás udělá šampiona.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={onOpenReg}
                className="bg-neon-green hover:bg-neon-hover text-black px-10 py-5 font-black uppercase text-xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3 group"
              >
                REGISTROVAT SE
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={onOpenMap}
                className="bg-white/5 hover:bg-white/10 border border-white/20 px-10 py-5 font-black uppercase text-xl transition-all"
              >
                TRASA ZÁVODU
              </button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Countdown />
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-10 right-10 hidden lg:block opacity-20">
         <span className="text-[12rem] font-display font-black italic stroke-white stroke-2 select-none" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', color: 'transparent' }}>
            PRAGUE 2026
         </span>
      </div>
    </section>
  );
};

const TextReveal = ({ text }: { text: string }) => {
  const words = text.split(" ");
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="inline-block"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          variants={{
            hidden: { opacity: 0, scale: 0.8, y: 20 },
            visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "backOut" } }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};

const SectionHeading = ({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) => (
  <div className="mb-16 block">
    {subtitle && <span className="text-neon-green font-black uppercase tracking-[0.3em] text-xs block mb-4">{subtitle}</span>}
    <h2 className="text-4xl md:text-6xl font-display font-black italic">
       {typeof children === 'string' ? <TextReveal text={children} /> : children}
    </h2>
    <motion.div 
      initial={{ scaleX: 0 }} 
      whileInView={{ scaleX: 1 }} 
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-24 h-1.5 bg-neon-green mt-4 origin-left"
    ></motion.div>
  </div>
);

// --- Main App ---

const App = () => {
  const [activeModal, setActiveModal] = useState<'registration' | 'map' | 'merch' | 'gdpr' | null>(null);
  const [selectedMerch, setSelectedMerch] = useState<any>(null);

  const infoRef = React.useRef(null);
  const { scrollYProgress: infoProgress } = useScroll({
    target: infoRef,
    offset: ["start end", "end start"]
  });
  const scrollX = useTransform(infoProgress, [0, 1], ["20%", "-40%"]);

  return (
    <div className="min-h-screen bg-asphalt-dark text-white selection:bg-neon-green selection:text-black">
      <RunnerCursor />
      <Navbar onOpenReg={() => setActiveModal('registration')} />
      
      <main>
        <Hero 
          onOpenReg={() => setActiveModal('registration')} 
          onOpenMap={() => setActiveModal('map')} 
        />
        
        {/* Professional Prize Teaser Showcase - Boxed Layout */}
        <section className="py-20 bg-asphalt-dark">
          <div className="container mx-auto px-6">
            <motion.div 
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 1 }}
               className="relative h-[600px] lg:h-[450px] overflow-hidden bg-asphalt border border-white/10 group shadow-2xl transition-colors duration-700 hover:bg-black cursor-pointer"
               onClick={() => document.getElementById('prize')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <div className="flex flex-col lg:flex-row h-full">
                 {/* Visual Panel - Cinematic Display */}
                 <div className="lg:w-[60%] relative h-full overflow-hidden bg-black/40">
                    <motion.div 
                      initial={{ scale: 1.05 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="w-full h-full"
                    >
                       <img 
                         src="/assets/enyaq.png" 
                         className="w-full h-full object-cover object-center saturate-50 group-hover:saturate-100 brightness-[0.5] group-hover:brightness-100 transition-all duration-1000" 
                         alt="Skoda Enyaq Prize" 
                       />
                    </motion.div>
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-asphalt/40 via-transparent to-transparent z-10 pointer-events-none"></div>
                    
                    {/* Technical Specifications Overlay */}
                    <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 z-20 flex gap-8">
                       {[
                         { label: 'RANGE', value: '540 KM' },
                         { label: 'BATTERY', value: '82 KWH' },
                         { label: 'POWER', value: '210 KW' }
                       ].map((spec, i) => (
                         <div key={i} className="space-y-0.5">
                            <p className="text-[8px] font-black text-neon-green/50 tracking-widest uppercase">{spec.label}</p>
                            <p className="text-lg font-display font-black italic text-white">{spec.value}</p>
                         </div>
                       ))}
                    </div>

                    {/* Decorative Background Text */}
                    <div className="absolute top-6 left-6 opacity-[0.03] pointer-events-none uppercase font-display font-black text-[10vw] italic leading-none select-none z-0">
                       2026
                    </div>
                 </div>

                 {/* Action Panel - Brutalist Card */}
                 <div className="lg:w-[40%] bg-asphalt relative flex flex-col justify-center p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-white/10 z-20">
                    <div className="space-y-6">
                       <div className="inline-flex items-center gap-3">
                          <div className="w-10 h-[2px] bg-neon-green"></div>
                          <span className="text-neon-green font-black uppercase text-[9px] tracking-[0.3em]">HLAVNÍ CENA</span>
                       </div>
                       
                       <div className="space-y-1">
                          <h2 className="text-4xl lg:text-5xl font-display font-black italic uppercase leading-[0.95] tracking-tighter">
                             VYHRAJ <br /> 
                             <span className="text-neon-green">ŠKODU ENYAQ</span>
                          </h2>
                       </div>

                       <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed max-w-xs">
                          Staň se šampionem nejdelší pražské trasy a získej klíče od tohoto elektrického skvostu.
                       </p>

                       <div className="flex items-center gap-6 group/btn">
                          <div className="w-12 h-12 bg-white flex items-center justify-center text-black group-hover:bg-neon-green transition-colors">
                             <ArrowRight size={20} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest border-b border-white/20 pb-1 group-hover:border-neon-green transition-colors">ZOBRAZIT SPECIFIKACI</span>
                       </div>
                    </div>

                    {/* Corner Branding */}
                    <div className="absolute top-6 right-6 text-[8px] font-black tracking-widest text-white/10 uppercase italic">
                       LRC CHAMPIONSHIP
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Basic Info */}
        <section id="info" ref={infoRef} className="py-32 bg-asphalt section-stars relative overflow-hidden">
          <motion.div 
            style={{ x: scrollX }}
            className="absolute top-1/2 left-0 -translate-y-1/2 opacity-[0.03] pointer-events-none uppercase font-display font-black text-[25vw] italic leading-none select-none whitespace-nowrap flex gap-[10vw]"
          >
             <span>LONG CHAMP</span>
             <span>LONG CHAMP</span>
          </motion.div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
              {[
                { icon: Flag, title: 'Termín', desc: '12. 9. 2026', meta: 'Start 06:00 ráno', align: 'left' },
                { icon: MapPin, title: 'Lokalita', desc: 'PRAHA', meta: 'Historické Centrum', align: 'center' },
                { icon: Timer, title: 'Limit', desc: '8 HODIN', meta: 'Tempo 7:45 min/km', align: 'right' },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="relative group h-[280px] flex flex-col justify-between p-8 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-neon-green/50 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-neon-green/20 group-hover:bg-neon-green transition-colors"></div>
                  
                  <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-neon-green tracking-[0.3em] block">{item.title}</span>
                        <item.icon className="w-8 h-8 text-white/20 group-hover:text-neon-green transition-colors" />
                     </div>
                     <span className="text-4xl font-display font-black italic text-white/5 select-none transition-opacity group-hover:opacity-20">{i + 1}</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-4xl md:text-5xl font-display font-black italic uppercase leading-none text-glow text-white group-hover:text-neon-green transition-colors">{item.desc}</h3>
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-[1px] bg-white/30"></div>
                       <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{item.meta}</p>
                    </div>
                  </div>

                  <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                     <item.icon size={150} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Races */}
        <section id="races" className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <SectionHeading subtitle="Najdi svou výzvu">ZÁVODNÍ KATEGORIE</SectionHeading>
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.2 } },
                hidden: {}
              }}
            >
              <motion.div 
                 variants={{
                   hidden: { opacity: 0, y: 80, scale: 0.95 },
                   visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } }
                 }}
                 className="relative group overflow-hidden bg-black h-[600px] border border-white/10"
              >
                <div className="absolute inset-0 z-0">
                  <img src="/assets/ultra_race.png" className="w-full h-full object-cover saturate-50 group-hover:saturate-100 brightness-50 group-hover:scale-105 transition-transform duration-700" alt="Ultra 62k" />
                </div>
                <div className="absolute inset-0 bg-asphalt/40 z-10"></div>
                <div className="relative z-30 h-full p-10 flex flex-col justify-end">
                  <span className="bg-neon-green text-black font-black px-3 py-1 text-xs w-fit mb-4 uppercase">ELITE</span>
                  <h3 className="text-5xl font-black mb-4 uppercase leading-none">62 KM <br />ULTRA</h3>
                  <button onClick={() => setActiveModal('map')} className="w-full py-4 border border-white/20 hover:bg-white hover:text-black font-black transition-all">DETAIL TRASY</button>
                </div>
              </motion.div>

              <motion.div 
                 variants={{
                   hidden: { opacity: 0, y: 80, scale: 0.95 },
                   visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } }
                 }}
                 className="relative group overflow-hidden bg-black h-[600px] border border-white/10"
              >
                <div className="absolute inset-0 z-0">
                  <img src="/assets/relay_race.png" className="w-full h-full object-cover saturate-50 group-hover:saturate-100 brightness-[0.4] group-hover:scale-105 transition-transform duration-700" alt="Relay" />
                </div>
                <div className="absolute inset-0 bg-asphalt/60 z-10"></div>
                <div className="relative z-30 h-full p-10 flex flex-col justify-end">
                  <h3 className="text-5xl font-black mb-4 uppercase leading-none">31+31 KM <br />ŠTAFETA</h3>
                  <button onClick={() => setActiveModal('registration')} className="w-full py-4 border border-white/20 hover:bg-neon-green hover:text-black font-black transition-all">REGISTROVAT TÝM</button>
                </div>
              </motion.div>

              <motion.div 
                 variants={{
                   hidden: { opacity: 0, y: 80, scale: 0.95 },
                   visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } }
                 }}
                 className="relative group overflow-hidden bg-black h-[600px] border border-white/10"
              >
                <div className="absolute inset-0 z-0">
                  <img src="/assets/charity_run.png" className="w-full h-full object-cover saturate-50 group-hover:saturate-100 brightness-50 group-hover:scale-105 transition-transform duration-700" alt="Charity" />
                </div>
                <div className="absolute inset-0 bg-neon-green/20 z-10"></div>
                <div className="relative z-30 h-full p-10 flex flex-col justify-end">
                  <Heart className="text-neon-green w-12 h-12 mb-6" />
                  <h3 className="text-5xl font-black mb-4 uppercase leading-none">CHARITA <br />5 KM</h3>
                  <button onClick={() => setActiveModal('registration')} className="w-full py-4 bg-white text-black font-black transition-all">PŘIPOJIT SE</button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Animated Marquee Ticker */}
        <div className="bg-neon-green py-4 overflow-hidden flex items-center border-y border-black">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
            className="flex gap-8 font-black uppercase tracking-widest text-black text-xl whitespace-nowrap"
          >
            {[...Array(8)].map((_, i) => (
              <span key={i} className="flex gap-8 items-center">
                <span>LONG RUNNERS CHAMPION 2026</span>
                <span>///</span>
                <span>CZECH REPUBLIC</span>
                <span>///</span>
                <span>THE ULTIMATE CHALLENGE</span>
                <span>///</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Expo */}
        <section id="expo" className="relative bg-asphalt-dark overflow-hidden min-h-[700px] flex items-center border-none">
          {/* Background Decoration - Vertical text */}
          <div className="absolute inset-y-0 left-0 w-32 opacity-[0.08] pointer-events-none uppercase font-display font-black text-[14vw] italic leading-none select-none flex items-center justify-center z-0">
             <div className="-rotate-90 whitespace-nowrap tracking-tighter text-white" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)', color: 'transparent' }}>
                HOLEŠOVICE — HOLEŠOVICE
             </div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center">
              {/* Left Info Panel */}
              <div className="lg:w-1/2 py-24 pr-0 lg:pr-20">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <SectionHeading subtitle="Registrace & Startovní čísla">EXPO PRAHA 2026</SectionHeading>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
                    {[
                      { day: 'PÁTEK', date: '11. Září', time: '12:00 — 20:00', icon: Timer },
                      { day: 'SOBOTA', date: '12. Září', time: '04:30 — 05:30', icon: Timer },
                    ].map((slot, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 p-6 space-y-4 hover:border-neon-green/30 transition-all group">
                         <div className="flex justify-between items-center">
                            <span className="text-neon-green font-black uppercase text-[10px] tracking-widest">{slot.day}</span>
                            <slot.icon size={16} className="text-white/20 group-hover:text-neon-green transition-colors" />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-2xl font-display font-black italic uppercase leading-none">{slot.date}</h4>
                            <p className="text-gray-400 font-bold text-xs uppercase">{slot.time}</p>
                         </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 p-6 border-l-4 border-neon-green bg-neon-green/5">
                     <h5 className="font-black uppercase text-sm mb-2 text-white">MÍSTO KONÁNÍ</h5>
                     <p className="text-gray-400 text-xs font-bold uppercase leading-relaxed max-w-md">
                        Výstaviště Praha Holešovice — Hala č. 4. Přijďte si pro své startovní balíčky, potkejte se s partnery závodu a nalaďte se na start.
                     </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right Cinematic Image Panel (Full Height - Absolute to Section Edge) */}
          <div className="lg:w-1/2 w-full h-[500px] lg:h-full absolute inset-y-0 right-0 overflow-hidden group border-none z-0">
             <motion.div 
               style={{
                 scale: useTransform(
                   useScroll({
                     target: { current: null },
                     offset: ["start end", "end start"]
                   }).scrollYProgress,
                   [0, 1],
                   [1.3, 1]
                 )
               }}
               className="w-full h-full relative"
             >
                <img 
                  src="/assets/expo_hall.png" 
                  className="w-full h-full object-cover saturate-50 group-hover:saturate-100 brightness-50 group-hover:brightness-110 transition-all duration-1000" 
                  alt="Expo Hall" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-asphalt-dark via-asphalt-dark/60 to-transparent lg:block hidden z-10"></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
             </motion.div>
             
             <div className="absolute inset-x-0 bottom-10 flex justify-center lg:justify-end lg:pr-20 z-20">
                <div className="text-right">
                   <span className="text-white/10 font-display font-black text-9xl italic uppercase leading-none select-none tracking-tighter">EXPO</span>
                </div>
             </div>
          </div>
        </section>

        {/* Merch */}
        <section id="merch" className="py-24 bg-asphalt section-stars">
          <div className="container mx-auto px-6">
            <SectionHeading subtitle="Limited Edition">SURVIVOR MERCH 2026</SectionHeading>
            
            <div className="flex flex-col lg:flex-row gap-8">
               {/* Long Feature Image */}
               <motion.div 
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 className="lg:w-1/3 h-[400px] lg:h-auto min-h-[500px] bg-black relative group overflow-hidden border border-white/10"
               >
                  <img 
                    src="/assets/merch_feature.png" 
                    className="absolute inset-0 w-full h-full object-cover saturate-50 group-hover:saturate-100 transition-all duration-1000 group-hover:scale-105" 
                    alt="Survivor Merch Feature" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                     <p className="text-neon-green font-black uppercase tracking-widest mb-2">COLLECTION 2026</p>
                     <h3 className="text-4xl font-display font-black italic uppercase leading-none">NO LIMITS <br/> GEAR</h3>
                  </div>
               </motion.div>

               {/* Product Grid */}
               <div className="lg:w-2/3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { name: 'Survivor Tee', price: '890 Kč', tag: 'Elite', img: '/assets/merch_tee.png', info: 'Funkční triko s antibakteriální úpravou a reflexními prvky.' },
                      { name: 'Finisher Hoodie', price: '1 590 Kč', tag: 'Preorder', img: '/assets/merch_hoodie.png', info: 'Těžká gramáž, vnitřní počes, neonové výšivky.' },
                      { name: 'Race Cap', price: '450 Kč', tag: 'Pro', img: '/assets/merch_cap.png', info: 'Ultra lehká, s odvětráváním a stavitelným páskem.' },
                      { name: 'Training Vest', price: '1 290 Kč', tag: 'New', img: '/assets/merch_vest.png', info: 'Větruodolná, s kapsou na mobil a gely.' },
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02, rotate: 1, y: -5, boxShadow: "0px 20px 40px rgba(106, 249, 169, 0.15)" }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="bg-white/5 border border-white/10 group overflow-hidden flex flex-col"
                      >
                        <div className="aspect-[4/3] bg-black overflow-hidden relative">
                           <img src={item.img} className="w-full h-full object-cover saturate-50 group-hover:saturate-100 group-hover:scale-110 transition-all duration-500" alt={item.name} />
                           <div className="absolute top-4 right-4 bg-neon-green text-black font-black px-2 py-1 text-[10px] uppercase skew-x-[-10deg]">{item.tag}</div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div className="mb-4">
                             <h4 className="font-bold uppercase text-lg mb-1">{item.name}</h4>
                             <p className="font-display font-black text-neon-green text-2xl italic mb-2">{item.price}</p>
                             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight line-clamp-2">{item.info}</p>
                          </div>
                          <button 
                            onClick={() => { setSelectedMerch(item); setActiveModal('merch'); }}
                            className="w-full bg-white/10 hover:bg-neon-green hover:text-black py-3 font-black uppercase text-xs transition-all border border-white/10 hover:border-neon-green"
                          >
                            KOUPIT
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Prize */}
        <section id="prize" className="pt-24 pb-32 bg-neon-green text-black relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none uppercase font-display font-black text-[20vw] italic leading-none select-none">
             CHAMPION
          </div>
          
          <div className="container mx-auto px-6 relative z-10 text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              <h2 className="text-6xl md:text-9xl font-display font-black italic mb-4 uppercase leading-[0.8]">VÝHRA PRO <br />ŠAMPIONA</h2>
              <p className="text-sm font-black uppercase tracking-[0.4em] text-black/60">HLAVNÍ CENA ZÁVODU: ŠKODA ENYAQ NA CELÝ ROK</p>
            </motion.div>
          </div>

          {/* Full Width Cinematic Prize Showcase with Scroll Zoom */}
          <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden mb-16 border-y-8 border-black group">
             <motion.div 
               style={{
                 scale: useTransform(
                   useScroll({
                     target: { current: null }, // This is a placeholder, usually we'd use a ref but for simplicity in this context we'll use a reliable motion approach
                     offset: ["start end", "end start"]
                   }).scrollYProgress,
                   [0, 1],
                   [1.2, 0.9]
                 )
               }}
               className="w-full h-full relative"
             >
                <img 
                  src="/assets/enyaq.png" 
                  className="w-full h-full object-cover transition-all duration-700" 
                  alt="Skoda Enyaq Full Color" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10"></div>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
             </motion.div>
             
             {/* Text Overlay on Image */}
             <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  transition={{ duration: 0.5 }}
                  className="text-center cursor-pointer"
                >
                   <h3 className="text-white text-6xl md:text-[10rem] font-display font-black italic uppercase drop-shadow-[0_10px_50px_rgba(0,0,0,0.8)] leading-none mb-4">
                      ŠKODA <br /> <span className="text-neon-green">ENYAQ</span>
                   </h3>
                   <div className="inline-flex items-center gap-4 bg-white text-black px-8 py-3 skew-x-[-10deg] font-black italic uppercase text-lg md:text-2xl shadow-xl">
                      <span className="skew-x-[10deg]">VÍTĚZNÝ STROJ</span>
                   </div>
                </motion.div>
             </div>
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center">
             <div className="max-w-2xl mx-auto mb-12">
                <p className="text-lg font-bold uppercase tracking-tight leading-relaxed">
                   Elektromobilita ladí s čistým během. Vítěz ultra-maratonu v kategorii ELITE získá roční zápůjčku tohoto špičkového modelu, který definuje budoucnost dopravy.
                </p>
             </div>
             
             <button 
                onClick={() => setActiveModal('registration')}
                className="inline-flex items-center gap-6 bg-transparent border-4 border-black text-black px-16 py-8 font-black uppercase text-3xl italic hover:bg-black hover:text-neon-green transition-all shadow-[0_20px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-2 group"
              >
                REGISTROVAT SE A VYHRÁT
                <ChevronRight className="group-hover:translate-x-2 transition-transform" size={40} />
              </button>
          </div>
        </section>
      </main>

      <footer className="bg-black py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center justify-center md:justify-start">
              <img src="/assets/logo_2026.png" alt="Long Runners Champion 2026" className="h-12 opacity-80 hover:opacity-100 transition-opacity drop-shadow-md grayscale hover:grayscale-0" />
            </div>
            <div className="flex gap-8 text-xs font-bold uppercase text-gray-500 tracking-widest">
              <button onClick={() => setActiveModal('registration')} className="hover:text-neon-green">Registrace</button>
              <button onClick={() => setActiveModal('map')} className="hover:text-neon-green">Trasa</button>
              <button onClick={() => setActiveModal('gdpr')} className="hover:text-neon-green">GDPR</button>
            </div>
            <p className="text-[10px] text-gray-600 font-black tracking-widest">&copy; 2026 LONG RUNNERS CHAMPION</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'registration' && (
          <Modal close={() => setActiveModal(null)} title="REGISTRACE">
            <RegistrationForm />
          </Modal>
        )}
        {activeModal === 'map' && (
          <Modal close={() => setActiveModal(null)} title="MAPA ZÁVODU">
            <RaceMapContent />
          </Modal>
        )}
        {activeModal === 'merch' && selectedMerch && (
          <Modal close={() => { setActiveModal(null); setSelectedMerch(null); }} title="OBJEDNÁVKA MERCHE">
            <MerchOrderContent item={selectedMerch} />
          </Modal>
        )}
        {activeModal === 'gdpr' && (
          <Modal close={() => setActiveModal(null)} title="ZÁSADY OCHRANY OSOBNÍCH ÚDAJŮ (GDPR)">
            <GdprContent />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Modal Helper ---

const Modal = ({ title, close, children }: { title: string; close: () => void; children: React.ReactNode }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="relative w-full max-w-4xl bg-asphalt-dark border-2 border-neon-green max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-3xl font-display font-black italic uppercase tracking-tighter">{title}</h2>
          <button onClick={close} className="p-2 hover:bg-neon-green hover:text-black transition-all">
            <X size={32} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 relative">
           <div className="absolute inset-0 bg-asphalt-texture opacity-5 pointer-events-none"></div>
           <div className="relative z-10">{children}</div>
        </div>
      </motion.div>
    </div>
  );
};

const RegistrationForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('62 KM ULTRA');
  
  if (submitted) return (
    <div className="text-center py-12">
      <CheckCircle2 size={64} className="text-neon-green mx-auto mb-6" />
      <h3 className="text-3xl font-display font-black italic uppercase mb-2">TVOJE CESTA ZAČÍNÁ!</h3>
      <p className="text-gray-400 uppercase font-black tracking-widest text-[10px]">Všechny instrukce byly odeslány na tvůj mail.</p>
    </div>
  );

  return (
    <div className="relative">
       {/* Background Decoration - Thematic Image */}
       <div 
          className="absolute -top-12 -right-12 w-96 h-96 opacity-15 pointer-events-none saturate-50 brightness-[0.7]"
          style={{ maskImage: 'radial-gradient(circle, black, transparent)', WebkitMaskImage: 'radial-gradient(circle, black, transparent)' }}
       >
          <img src="/assets/ultra_race.png" className="w-full h-full object-cover rounded-full" alt="" />
       </div>

       <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-neon-green/10 border border-neon-green/20 px-2 py-0.5 mb-4 skew-x-[-10deg]">
             <CheckCircle2 size={12} className="text-neon-green skew-x-[10deg]" />
             <span className="text-[9px] font-black uppercase text-neon-green tracking-widest skew-x-[10deg]">POSLEDNÍCH 45 MÍST</span>
          </div>

          <h3 className="text-3xl md:text-4xl font-display font-black italic uppercase mb-6 leading-none">VSTUP DO <br/><span className="text-neon-green">HISTORIE</span></h3>
          
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
            <div className={`grid grid-cols-1 gap-4 ${selectedCategory === '31+31 KM ŠTAFETA' ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
               {[
                  { id: 'name', label: selectedCategory === '31+31 KM ŠTAFETA' ? 'Závodník 1 - Jméno' : 'Jméno a Příjmení', type: 'text', placeholder: 'JAKUB BĚŽEC' },
                  ...(selectedCategory === '31+31 KM ŠTAFETA' ? [{ id: 'name2', label: 'Závodník 2 - Jméno', type: 'text', placeholder: 'PETR PARŤÁK' }] : []),
                  { id: 'email', label: 'Emailová adresa', type: 'email', placeholder: 'JAKUB@CHAMPION.CZ' },
               ].map((field, i) => (
                 <motion.div 
                   key={field.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="space-y-1.5"
                 >
                   <label htmlFor={field.id} className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">{field.label}</label>
                   <input 
                      required
                      type={field.type} 
                      id={field.id}
                      className="w-full bg-white/5 border border-white/10 p-3 font-bold focus:border-neon-green focus:bg-neon-green/5 outline-none transition-all placeholder:text-white/10 uppercase text-sm"
                      placeholder={field.placeholder}
                   />
                 </motion.div>
               ))}
            </div>

            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="space-y-1.5"
            >
              <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Kategorie závodu</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                 {['62 KM ULTRA', '31+31 KM ŠTAFETA', 'CHARITA 5 KM'].map((cat) => (
                    <button 
                       key={cat} 
                       type="button" 
                       onClick={() => setSelectedCategory(cat)}
                       className={`p-3 border font-black transition-all text-[10px] uppercase ${
                          selectedCategory === cat 
                          ? 'border-neon-green bg-neon-green text-black' 
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
                       }`}
                    >
                       {cat}
                    </button>
                 ))}
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.3 }}
               className="space-y-1.5"
            >
               <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Telefonní číslo</label>
               <input 
                  required
                  type="tel"
                  className="w-full bg-white/5 border border-white/10 p-3 font-bold focus:border-neon-green focus:bg-neon-green/5 outline-none transition-all placeholder:text-white/10 uppercase text-sm"
                  placeholder="+420 777 000 000"
               />
            </motion.div>

            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              type="submit" 
              className="w-full bg-neon-green text-black py-4 font-black uppercase text-lg italic hover:bg-white transition-all shadow-[0_10px_20px_rgba(106,249,169,0.15)]"
            >
              POTVRDIT REGISTRACI
            </motion.button>

            <p className="text-[9px] text-center text-gray-600 font-bold uppercase tracking-tight">
               Odesláním souhlasíte se zpracováním osobních údajů a <a href="#" className="underline hover:text-white">pravidly závodu</a>.
            </p>
          </form>
       </div>
    </div>
  );
};

const routesData = {
  '5km': {
    title: 'MAPA TRASY 5 KM CHARITA',
    pathAnimation: { end: 0.08, duration: 2 },
    checkpoints: [
      { name: 'CP1 - START/CÍL (HOLEŠOVICE)', km: '2.5 KM', info: 'Voda, Iontový nápoj, Zdravotník' },
    ],
    specs: { elevation: '45 M+', surface: '100% ASFALT / DLAŽBA', limit: '1:00 HOD', category: 'CHARITA' },
    warning: 'Pozor: Charitativní běh vede částečně přes Stromovku. Trasa je rovinatá a vhodná pro všechny.'
  },
  '31km': {
    title: 'MAPA TRASY 31+31 KM ŠTAFETA',
    pathAnimation: { end: 0.5, duration: 4 },
    checkpoints: [
      { name: 'CP1 - PETŘÍN HILL', km: '12 KM', info: 'Voda, Ionty, Gely, Zdravotník' },
      { name: 'CP2 - VYŠEHRAD (PŘEDÁVKA)', km: '31 KM', info: 'Banány, Vývar, Masáže, Předávková zóna' },
    ],
    specs: { elevation: '680 M+', surface: '85% ASFALT', limit: '4:00 HOD (na člena)', category: 'TÝMOVÁ ŠTAFETA' },
    warning: 'Pozor: Místo předávky na Vyšehradě je velmi frekventované. Sledujte značení koridorů pro svůj tým.'
  },
  '62km': {
    title: 'MAPA TRASY 62 KM ULTRA',
    pathAnimation: { end: 1, duration: 6 },
    checkpoints: [
      { name: 'CP1 - PETŘÍN HILL', km: '12 KM', info: 'Voda, Ionty, Gely, Zdravotník' },
      { name: 'CP2 - VYŠEHRAD FORTRESS', km: '28 KM', info: 'Banány, Vývar, Teplý čaj, Masáže' },
      { name: 'CP3 - TROMJA ARENA', km: '45 KM', info: 'Espresso Bar, Energy Tyčinky, Magnesium' },
      { name: 'CP4 - RIEGROVY SADY', km: '56 KM', info: 'Final Boost, Cola, Pivo (nealko), Hudba' },
    ],
    specs: { elevation: '1 250 M+', surface: '80% ASFALT', limit: '8:00 HOD', category: 'ULTRA ELITE' },
    warning: 'Pozor: Trasa vede historickým centrem přes kočičí hlavy a úzké uličky. Doporučujeme obuv s dobrou trakcí i na mokrém asfaltu.'
  }
};

const RaceMapContent = () => {
  const [activeRoute, setActiveRoute] = useState<'5km' | '31km' | '62km'>('62km');
  const route = routesData[activeRoute];

  return (
    <div className="space-y-8">
      {/* Tab Selector */}
      <div className="flex flex-wrap gap-4 border-b border-white/10 pb-4">
        {[
          { id: '5km', label: '5 KM CHARITA' },
          { id: '31km', label: '31+31 KM ŠTAFETA' },
          { id: '62km', label: '62 KM ULTRA' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveRoute(tab.id as '5km' | '31km' | '62km')}
            className={`px-6 py-3 font-black uppercase text-sm italic transition-all ${
              activeRoute === tab.id 
              ? 'bg-neon-green text-black scale-105' 
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="aspect-video bg-[#0a0a0a] border border-white/10 relative overflow-hidden group">
         {/* Clean Procedural Tactical Grid Background */}
         <div 
           className="absolute inset-0 opacity-20 pointer-events-none"
           style={{ 
             backgroundImage: 'linear-gradient(rgba(106, 249, 169, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(106, 249, 169, 0.15) 1px, transparent 1px)',
             backgroundSize: '40px 40px',
             backgroundPosition: 'center center'
           }}
         ></div>
         
         {/* Animated Path Overlay */}
         <svg 
           viewBox="0 0 1000 1000" 
           className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_15px_rgba(106,249,169,0.8)] opacity-70"
           preserveAspectRatio="none"
         >
            <motion.path
               key={`glow-${activeRoute}`}
               d="M500,250 L520,240 L550,220 L600,230 L640,200 L700,220 L750,280 L720,350 L680,450 L650,550 L630,680 L580,750 L520,850 L450,920 L380,850 L320,750 L280,650 L250,550 L220,450 L180,350 L150,280 L200,220 L250,230 L350,220 L450,240 Z"
               fill="none"
               stroke="#6AF9A9"
               strokeWidth="15"
               strokeLinecap="round"
               strokeLinejoin="round"
               initial={{ pathLength: 0, opacity: 0 }}
               animate={{ pathLength: route.pathAnimation.end, opacity: 1 }}
               transition={{ 
                duration: route.pathAnimation.duration, 
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.5
              }}
            />
            {/* Bright leading edge */}
            <motion.path
               key={`edge-${activeRoute}`}
               d="M500,250 L520,240 L550,220 L600,230 L640,200 L700,220 L750,280 L720,350 L680,450 L650,550 L630,680 L580,750 L520,850 L450,920 L380,850 L320,750 L280,650 L250,550 L220,450 L180,350 L150,280 L200,220 L250,230 L350,220 L450,240 Z"
               fill="none"
               stroke="white"
               strokeWidth="4"
               strokeLinecap="round"
               initial={{ pathLength: 0, opacity: 0 }}
               animate={{ pathLength: route.pathAnimation.end, opacity: 1 }}
               transition={{ 
                duration: route.pathAnimation.duration, 
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.5
              }}
            />
         </svg>

         <div className="absolute inset-0 bg-gradient-to-t from-asphalt-dark/90 to-transparent pointer-events-none"></div>
         <div className="absolute top-4 left-4 bg-black/80 p-4 border-l-4 border-neon-green backdrop-blur-md">
            <h4 className="text-sm font-black uppercase text-white tracking-widest">{route.title}</h4>
            <p className="text-[10px] text-neon-green font-bold uppercase italic animate-pulse">AKTIVNÍ SIMULACE BĚHU...</p>
         </div>
         <div className="absolute bottom-4 right-4 text-[8px] text-white/30 font-bold uppercase tracking-[0.3em]">
            © 2026 Long Runners Champion
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
           <h4 className="text-xl font-display font-black text-neon-green italic uppercase mb-6 flex items-center gap-2"><Coffee size={24}/> Občerstvovačky (CP)</h4>
           <div className="space-y-3 min-h-[300px]">
              {route.checkpoints.map((cp, i) => (
                <motion.div 
                  key={`${activeRoute}-cp-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-white/5 border-l-2 border-white/10 hover:border-neon-green transition-colors"
                >
                   <div className="flex justify-between items-center mb-1">
                      <span className="font-bold uppercase text-xs tracking-wider">{cp.name}</span>
                      <span className="text-neon-green font-display font-black italic">{cp.km}</span>
                   </div>
                   <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight">{cp.info}</p>
                </motion.div>
              ))}
           </div>
        </div>
        <div className="space-y-8">
           <div>
              <h4 className="text-xl font-display font-black text-white italic uppercase mb-6 flex items-center gap-2"><List size={24} className="text-neon-green" /> Technické Parametry</h4>
              <motion.div 
                 key={`specs-${activeRoute}`}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="p-6 bg-white/5 border border-white/10 space-y-4"
              >
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Převýšení</p>
                     <p className="text-xl font-black italic text-glow">{route.specs.elevation}</p>
                   </div>
                   <div>
                     <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Povrch</p>
                     <p className="text-xl font-black italic">{route.specs.surface}</p>
                   </div>
                   <div>
                     <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Časový Limit</p>
                     <p className="text-xl font-black italic">{route.specs.limit}</p>
                   </div>
                   <div>
                     <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Kategorie</p>
                     <p className="text-xl font-black italic">{route.specs.category}</p>
                   </div>
                 </div>
              </motion.div>
           </div>
           <motion.div 
             key={`warning-${activeRoute}`}
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="p-4 bg-neon-green/5 border border-neon-green/20"
           >
              <p className="text-[10px] text-white/50 font-bold uppercase leading-relaxed">
                 {route.warning}
              </p>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

const MerchOrderContent = ({ item }: { item: any }) => {
  const [submitted, setSubmitted] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');

  if (submitted) return (
    <div className="text-center py-20">
      <CheckCircle2 size={80} className="text-neon-green mx-auto mb-6" />
      <h3 className="text-4xl font-display font-black italic uppercase mb-4">REZERVACE DOKONČENA!</h3>
      <p className="text-gray-400 uppercase font-black tracking-widest text-sm">Vyzvednutí a platba proběhne na EXPO 2026.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
       {/* Product Detail */}
       <div className="space-y-8">
          <div className="aspect-square bg-black border border-white/10 relative overflow-hidden group">
             <img src="/assets/merch_feature.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.name} />
             <div className="absolute top-4 left-4 bg-neon-green text-black font-black px-4 py-2 skew-x-[-10deg] italic">
                {item.price}
             </div>
          </div>
          <div>
             <h3 className="text-3xl font-display font-black italic uppercase mb-2">{item.name}</h3>
             <p className="text-gray-400 text-sm font-bold uppercase tracking-tight leading-relaxed">
                {item.info}
             </p>
          </div>
          
          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase text-neon-green tracking-[0.2em]">VYBER VELIKOST</label>
             <div className="flex gap-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                   <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border-2 font-black transition-all ${
                         selectedSize === size 
                         ? 'border-neon-green bg-neon-green text-black scale-110' 
                         : 'border-white/10 text-white hover:border-white/30'
                      }`}
                   >
                      {size}
                   </button>
                ))}
             </div>
          </div>
       </div>

       {/* Quick Checkout Form */}
       <div className="bg-white/5 border border-white/10 p-8 space-y-6">
          <h4 className="text-xl font-display font-black italic uppercase text-white border-b border-white/10 pb-4 mb-6">RYCHLÁ REZERVACE</h4>
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
             {[
                { id: 'm-name', label: 'Celé Jméno', type: 'text', placeholder: 'JAKUB BĚŽEC' },
                { id: 'm-email', label: 'Váš Email', type: 'email', placeholder: 'JAKUB@CHAMPION.CZ' },
             ].map((field) => (
                <div key={field.id} className="space-y-2">
                   <label htmlFor={field.id} className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">{field.label}</label>
                   <input 
                      required
                      type={field.type}
                      id={field.id}
                      className="w-full bg-black/50 border border-white/10 p-4 font-bold focus:border-neon-green focus:bg-neon-green/5 outline-none transition-all placeholder:text-white/5 uppercase text-sm"
                      placeholder={field.placeholder}
                   />
                </div>
             ))}
             
             <div className="p-4 bg-neon-green/5 border border-neon-green/10 text-[10px] text-gray-400 uppercase font-black tracking-tight leading-relaxed">
                Poznámka: Toto je závazná rezervace. Platba proběhne až při převzetí na stánku LONG RUNNERS EXPO.
             </div>

             <button type="submit" className="w-full bg-neon-green text-black py-5 font-black uppercase text-xl italic hover:bg-white transition-all shadow-[0_15px_30px_rgba(106,249,169,0.15)]">
                POTVRDIT REZERVACI
             </button>
          </form>
       </div>
    </div>
  );
};

const GdprContent = () => {
  return (
    <div className="space-y-6 text-sm text-gray-300 leading-relaxed font-bold max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
      <div className="p-4 border-l-4 border-neon-green bg-white/5 mb-8">
        <p className="text-white font-black uppercase tracking-widest text-xs">Vaše soukromí je pro nás prioritou. Přečtěte si, jak nakládáme s vašimi osobními údaji.</p>
      </div>

      <section className="space-y-2">
        <h3 className="text-xl font-display font-black italic text-neon-green uppercase border-b border-white/10 pb-2 mb-4">1. Správce údajů</h3>
        <p>
          Správcem vašich osobních údajů je organizátor závodu LONG RUNNERS CHAMPION 2026. Údaje zpracováváme v souladu s Nařízením Evropského parlamentu a Rady (EU) 2016/679 (GDPR).
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-xl font-display font-black italic text-neon-green uppercase border-b border-white/10 pb-2 mb-4">2. Jaké údaje sbíráme</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Identifikační údaje:</strong> Jméno, příjmení, datum narození, adresa.</li>
          <li><strong>Kontaktní údaje:</strong> E-mailová adresa, telefonní číslo pro stav nouze.</li>
          <li><strong>Zdravotní a další údaje:</strong> Závodní kategorie, velikost trička, případná omezení uvedená v registraci.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-xl font-display font-black italic text-neon-green uppercase border-b border-white/10 pb-2 mb-4">3. Účel zpracování</h3>
        <p>
          Osobní údaje zpracováváme výhradně pro účely:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Registrace k závodu a přidělení startovního čísla.</li>
          <li>Komunikace týkající se harmonogramu, změn a výsledků.</li>
          <li>Zajištění bezpečnosti a zdraví během konání akce.</li>
          <li>Zpracování a distribuce zakoupeného merchandise.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-xl font-display font-black italic text-neon-green uppercase border-b border-white/10 pb-2 mb-4">4. Doba uchování a vaše práva</h3>
        <p>
          Údaje uchováváme pouze po dobu nezbytně nutnou, maximálně však 2 roky po skončení závodu pro účely archivace výsledků (nepožádáte-li o dřívější výmaz). 
          Máte právo požadovat přístup, opravu, nebo výmaz vašich údajů, jakož i právo podat stížnost u ÚOOÚ.
        </p>
      </section>

      <div className="mt-8 pt-8 border-t border-white/10">
        <p className="text-xs text-white/50 uppercase tracking-widest text-center">Poslední aktualizace: Duben 2026</p>
      </div>
    </div>
  );
};

export default App;
