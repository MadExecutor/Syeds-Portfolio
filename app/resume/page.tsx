import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownToLine, ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { resume } from "@/data/resume";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Resume — Syed Muhammad",
  description: "Digital resume of Syed Muhammad, Web Developer.",
};

export default function ResumePage() {
  return (
    <main className="resume-page">
      <header className="resume-toolbar">
        <Link className="resume-wordmark" href="/">SM<span>.</span></Link>
        <Link className="resume-back" href="/"><ArrowLeft size={15} /> Back to portfolio</Link>
        <ThemeToggle />
        <a className="resume-download" href="/syed-muhammad-resume.pdf" download>
          Download PDF <ArrowDownToLine size={16} />
        </a>
      </header>

      <article className="resume-document">
        <div className="resume-kicker">CURRICULUM VITAE <span>2026</span></div>
        <section className="resume-identity">
          <div>
            <h1>{resume.name}<br /><em>{resume.title}</em></h1>
          </div>
          <address className="resume-contact">
            <span><MapPin size={15} />{resume.location}</span>
            <a href={`tel:${resume.phone}`}><Phone size={15} />{resume.phone}</a>
            <a href={`mailto:${resume.email}`}><Mail size={15} />{resume.email}</a>
          </address>
        </section>

        <section className="resume-section resume-summary">
          <h2>Professional summary</h2>
          <p>{resume.summary}</p>
        </section>

        <div className="resume-columns">
          <div className="resume-main-column">
            <section className="resume-section">
              <h2>Work experience</h2>
              {resume.experience.map((item) => (
                <article className="resume-entry" key={item.role}>
                  <div className="resume-entry-heading">
                    <div>
                      <h3>{item.role}</h3>
                      <p className="resume-place">{item.organization}</p>
                    </div>
                    <span className="resume-period">{item.period}</span>
                  </div>
                  <ul>
                    {item.details.map((detail) => <li key={detail}>{detail}</li>)}
                  </ul>
                </article>
              ))}
            </section>

            <section className="resume-section">
              <h2>Education</h2>
              {resume.education.map((item) => (
                <article className="resume-entry resume-education-entry" key={item.qualification}>
                  <div className="resume-entry-heading">
                    <div>
                      <h3>{item.qualification}</h3>
                      <p className="resume-place">{item.institution}</p>
                    </div>
                    <span className="resume-period">{item.period}</span>
                  </div>
                </article>
              ))}
            </section>
          </div>

          <aside className="resume-side-column">
            <section className="resume-section">
              <h2>Skills</h2>
              {resume.skills.map((group) => (
                <div className="resume-skill-group" key={group.title}>
                  <h3>{group.title}</h3>
                  <div className="resume-tags">
                    {group.items.map((skill) => <span key={skill}>{skill}</span>)}
                  </div>
                </div>
              ))}
            </section>

            <section className="resume-section">
              <h2>Certificates</h2>
              <ul className="resume-certificate-list">
                {resume.certificates.map((certificate) => <li key={certificate}>{certificate}</li>)}
              </ul>
            </section>
          </aside>
        </div>

        <footer className="resume-footer">
          <span>Syed Muhammad · Web Developer</span>
          <a href="/syed-muhammad-resume.pdf" target="_blank" rel="noreferrer">Open original PDF</a>
        </footer>
      </article>
    </main>
  );
}
