import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import HomePageHero from "@/components/pages/home/home";

export default function Home() {
  return (
    <>
    <Navbar />
      <main className="px-4 md:px-0">
        <HomePageHero />
      </main>
      <Footer />
    </>
  );
}
