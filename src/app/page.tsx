import Nav from "@/components/Nav/Nav";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Experience from "@/components/Experience/Experience";
import OrgLeadership from "@/components/OrgLeadership/OrgLeadership";
import Achievements from "@/components/Achievements/Achievements";
import ContentCreator from "@/components/ContentCreator/ContentCreator";
import CreativityGallery from "@/components/CreativityGallery/CreativityGallery";
import Projects from "@/components/Projects/Projects";
import Skills from "@/components/Skills/Skills";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import VineSpine from "@/components/shared/VineSpine";

export default function Home() {
  return (
    <main>
      <Nav />
      <VineSpine />
      <Hero />
      <About />
      <Experience />
      <OrgLeadership />
      <Achievements />
      <ContentCreator />
      <CreativityGallery />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </main>
  );
}
