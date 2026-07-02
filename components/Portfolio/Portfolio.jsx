import Reveal from "./Reveal";
import styles from "./Portfolio.module.css";

/* ----------------------------------------------------------------------
   Data — sourced from Nyasa's resume. Keep this the single place to
   update copy; every section below just renders it.
   ---------------------------------------------------------------------- */

const EDUCATION = [
  {
    degree: "BTech — Computer Science & Engineering",
    school: "NxtWave Institute of Advanced Technology (NIAT)",
    period: "2025 — Present",
    detail:
      "Core coursework: Data Structures & Algorithms, OOP, Software Engineering, Discrete Mathematics. Building a strong CS foundation alongside real-world projects.",
  },
  {
    degree: "BS — Applied AI & Data Science",
    school: "IIT Jodhpur (Dual Degree)",
    period: "2025 — Present",
    detail:
      "Specialised curriculum: Machine Learning, Statistics & Probability, Data Pipelines, AI systems design. Bridges rigorous academic research with applied problem-solving.",
  },
];

const PROJECTS = [
  {
    title: "Personalised Fitness Coach",
    take: "01",
    description:
      "A web app that generates personalised workout and nutrition recommendations from a user's goals, fitness level, and preferences. Demonstrates conditional logic, dynamic UI rendering, and user-centric design.",
    stack: ["HTML", "CSS", "JavaScript", "Personalisation Logic"],
    href: "https://github.com/nyasapatel6-lab",
  },
  {
    title: "HackWarts — Hackathon Project",
    take: "02",
    description:
      "A collaborative TypeScript project built during a hackathon. Contributed to architecture decisions and feature implementation under tight time constraints — real teamwork, real deadline pressure.",
    stack: ["TypeScript", "Open Source", "Team Collaboration"],
    href: "https://github.com/nyasapatel6-lab",
  },
];

const SKILLS = [
  { label: "Languages", items: ["Python", "JavaScript", "TypeScript", "HTML", "CSS", "C / C++"] },
  { label: "AI & Data", items: ["Machine Learning", "Data Analysis", "Statistics", "NumPy", "Pandas"] },
  { label: "Web & Tools", items: ["Git & GitHub", "VS Code", "React (learning)", "Figma"] },
  { label: "Concepts", items: ["OOP", "Data Structures & Algorithms", "REST APIs", "Responsive Design"] },
];

const STRENGTHS = [
  {
    title: "Communication",
    detail: "Explains complex technical ideas clearly, in writing and out loud. Bridges technical and non-technical teams.",
  },
  {
    title: "Fast Learner",
    detail: "Shipping real projects in Year 1 of university — adaptive, and always pushing into new territory.",
  },
  {
    title: "Dual-Degree Discipline",
    detail: "Managing two rigorous programmes at once — proof of discipline and time management.",
  },
  {
    title: "Collaboration",
    detail: "Proven teamwork under hackathon pressure, with real, shipped deliverables.",
  },
];

const INTERESTS = [
  "Artificial Intelligence",
  "Machine Learning",
  "Web Development",
  "Data Science",
  "Open Source",
  "UI/UX",
];

const CONTACT_LINKS = [
  { label: "Email", value: "nyasapatel6@gmail.com", href: "mailto:nyasapatel6@gmail.com" },
  { label: "GitHub", value: "github.com/nyasapatel6-lab", href: "https://github.com/nyasapatel6-lab" },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/nyasa-patel-880873380",
    href: "https://www.linkedin.com/in/nyasa-patel-880873380",
  },
];

/* ----------------------------------------------------------------------
   Small shared pieces
   ---------------------------------------------------------------------- */

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M3 11 11 3M11 3H4.5M11 3v6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SceneTag({ number, label }) {
  return (
    <div className={styles.sceneTag}>
      <span className={styles.sceneNumber}>{number}</span>
      <span className={styles.sceneLabel}>{label}</span>
      <span className={styles.sceneRule} aria-hidden="true" />
    </div>
  );
}

/* ----------------------------------------------------------------------
   Sections
   ---------------------------------------------------------------------- */

function About() {
  return (
    <section className={styles.section} aria-labelledby="about-heading">
      <div className={styles.container}>
        <Reveal>
          <SceneTag number="02" label="About" />
        </Reveal>

        <Reveal delay={80}>
          <h2 id="about-heading" className={styles.sectionTitle}>
            Two degrees, <span className={styles.accent}>one build log.</span>
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <p className={styles.lede}>
            I&apos;m a first-year student running a dual degree — Computer Science &amp; Engineering
            at NxtWave Institute of Advanced Technology, and Applied AI &amp; Data Science at IIT
            Jodhpur. Alongside coursework I build real web applications and ship hackathon projects
            with a team, and I&apos;m comfortable being the bridge between a technical build and a
            non-technical audience. Currently open to internships and freelance work across AI,
            software development, and data science.
          </p>
        </Reveal>

        <div className={styles.eduGrid}>
          {EDUCATION.map((edu, i) => (
            <Reveal key={edu.school} delay={200 + i * 80} className={styles.eduCard}>
              <span className={styles.eduPeriod}>{edu.period}</span>
              <h3 className={styles.eduDegree}>{edu.degree}</h3>
              <p className={styles.eduSchool}>{edu.school}</p>
              <p className={styles.eduDetail}>{edu.detail}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className={styles.section} aria-labelledby="projects-heading">
      <div className={styles.container}>
        <Reveal>
          <SceneTag number="03" label="Projects" />
        </Reveal>

        <Reveal delay={80}>
          <h2 id="projects-heading" className={styles.sectionTitle}>
            Shipped, <span className={styles.accent}>not just started.</span>
          </h2>
        </Reveal>

        <div className={styles.projectGrid}>
          {PROJECTS.map((project, i) => (
            <Reveal key={project.title} delay={160 + i * 100} className={styles.projectCard}>
              <span className={styles.projectTake}>TAKE {project.take}</span>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDescription}>{project.description}</p>
              <ul className={styles.tagRow}>
                {project.stack.map((tech) => (
                  <li key={tech} className={styles.tag}>
                    {tech}
                  </li>
                ))}
              </ul>
              <a
                className={styles.projectLink}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub <ArrowIcon />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className={styles.section} aria-labelledby="skills-heading">
      <div className={styles.container}>
        <Reveal>
          <SceneTag number="04" label="Skills" />
        </Reveal>

        <Reveal delay={80}>
          <h2 id="skills-heading" className={styles.sectionTitle}>
            The <span className={styles.accent}>toolkit</span> so far.
          </h2>
        </Reveal>

        <div className={styles.skillGrid}>
          {SKILLS.map((group, i) => (
            <Reveal key={group.label} delay={160 + i * 80} className={styles.skillGroup}>
              <h3 className={styles.skillLabel}>{group.label}</h3>
              <ul className={styles.tagRow}>
                {group.items.map((item) => (
                  <li key={item} className={styles.tag}>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Strengths() {
  return (
    <section className={styles.section} aria-labelledby="strengths-heading">
      <div className={styles.container}>
        <Reveal>
          <SceneTag number="05" label="Strengths" />
        </Reveal>

        <Reveal delay={80}>
          <h2 id="strengths-heading" className={styles.sectionTitle}>
            How I <span className={styles.accent}>work.</span>
          </h2>
        </Reveal>

        <div className={styles.strengthGrid}>
          {STRENGTHS.map((s, i) => (
            <Reveal key={s.title} delay={160 + i * 70} className={styles.strengthCard}>
              <h3 className={styles.strengthTitle}>{s.title}</h3>
              <p className={styles.strengthDetail}>{s.detail}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className={styles.interestsBlock}>
          <span className={styles.interestsLabel}>Focus areas</span>
          <ul className={styles.tagRow}>
            {INTERESTS.map((interest) => (
              <li key={interest} className={styles.tag}>
                {interest}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className={styles.sectionContact} aria-labelledby="contact-heading">
      <div className={styles.container}>
        <Reveal>
          <SceneTag number="06" label="Contact" />
        </Reveal>

        <Reveal delay={80}>
          <h2 id="contact-heading" className={styles.contactTitle}>
            Let&apos;s build <span className={styles.accent}>something.</span>
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <p className={styles.lede}>
            Open to internships and freelance projects in AI, software development, and data
            science. Based in India — happy to work with teams anywhere.
          </p>
        </Reveal>

        <Reveal delay={200} className={styles.contactLinks}>
          {CONTACT_LINKS.map((link) => (
            <a
              key={link.label}
              className={styles.contactLink}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              <span className={styles.contactLinkLabel}>{link.label}</span>
              <span className={styles.contactLinkValue}>
                {link.value}
                <ArrowIcon />
              </span>
            </a>
          ))}
        </Reveal>

        <Reveal delay={260}>
          <p className={styles.footerNote}>References &amp; academic transcripts available on request.</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------
   Export — everything that lives inside the "next-section" scroll target
   ---------------------------------------------------------------------- */

export default function Portfolio() {
  return (
    <>
      <About />
      <Projects />
      <Skills />
      <Strengths />
      <Contact />
    </>
  );
}
