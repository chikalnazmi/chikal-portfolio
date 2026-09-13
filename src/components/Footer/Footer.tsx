export default function Footer() {
  return (
    <footer className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 sm:pt-16 sm:pb-8 border-t border-[#CAD7C5]/70">
      {/* Top Row: Navigation Links (Left) + Copyright Notice (Right) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 pb-6 sm:pb-10 border-b border-[#CAD7C5]/40">
        <nav className="flex flex-wrap items-center justify-center md:justify-start gap-5 sm:gap-7 lg:gap-8 text-xs sm:text-sm font-sans font-medium text-[#2C3E2B]/80">
          <a href="#hero" className="hover:text-[#893941] transition-colors tracking-wide">Home</a>
          <a href="#about" className="hover:text-[#893941] transition-colors tracking-wide">About</a>
          <a href="#experience" className="hover:text-[#893941] transition-colors tracking-wide">Experience</a>
          <a href="#projects" className="hover:text-[#893941] transition-colors tracking-wide">Projects</a>
          <a href="#awards" className="hover:text-[#893941] transition-colors tracking-wide">Awards</a>
          <a href="#contact" className="hover:text-[#893941] transition-colors tracking-wide">Contact</a>
        </nav>

        <div className="text-xs sm:text-[13px] text-[#2C3E2B]/60 font-sans tracking-tight text-center md:text-right">
          © {new Date().getFullYear()} Chikal Nazmi Mahira. All rights reserved.
        </div>
      </div>

      {/* Bottom Row: Colossal Editorial Masthead Matching Brand Font */}
      <div className="w-full pt-6 sm:pt-8 pb-2 overflow-hidden select-none">
        <a
          href="#hero"
          className="group block w-full text-left tracking-normal font-serif font-bold text-[#212B1E] hover:text-[#893941] transition-colors duration-700 leading-[0.88] cursor-pointer whitespace-nowrap overflow-hidden"
          title="Chikal Nazmi Mahira — Kembali ke Atas ↑"
        >
          <span className="block text-[8.5vw] sm:text-[8vw] md:text-[7.8vw] lg:text-[7.5vw] xl:text-[7.2rem] 2xl:text-[8.5rem] transition-transform duration-700 group-hover:translate-x-1.5">
            Chikal Nazmi Mahira
          </span>
        </a>
        <div className="text-[10px] sm:text-xs font-mono font-medium tracking-widest uppercase text-[#2C3E2B]/60 mt-2 sm:mt-3">
          Business &amp; Marketing
        </div>
      </div>
    </footer>
  );
}
