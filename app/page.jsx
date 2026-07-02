import VideoIntro from "@/components/VideoIntro/VideoIntro";
import Portfolio from "@/components/Portfolio/Portfolio";

export default function HomePage() {
  return (
    <main>
      <VideoIntro />

      <section className="next-section" data-next-section>
        <Portfolio />
      </section>
    </main>
  );
}
