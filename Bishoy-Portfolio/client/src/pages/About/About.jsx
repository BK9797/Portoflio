import { useEffect, useState } from "react";
import {
  GraduationCap,
  BriefcaseBusiness,
  Award,
  FolderCode,
  Languages,
  Users,
  Cpu,
} from "lucide-react";
import { getPortfolio } from "../../services/portfolioService";
import "./About.css";

const About = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await getPortfolio();
        setPortfolio(data);
      } catch {
        setError("Failed to load about data");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (loading) return <div className="loading">Loading neural profile...</div>;
  if (error) return <div className="error">{error}</div>;

  const {
    profile,
    education,
    experience,
    certifications,
    projects,
    skills,
    activities,
    languages,
  } = portfolio;

  return (
    <main className="page about-page">
      <section className="container about-header">
        <div className="ai-badge">
          <Cpu size={16} />
          Knowledge Base
        </div>

        <h1 className="section-title">
          About <span className="gradient-text">{profile.name}</span>
        </h1>

        <p className="section-subtitle">{profile.summary}</p>
      </section>

      <section className="container about-grid">
        <InfoSection
          icon={<GraduationCap />}
          title="Education"
          items={education}
          type="education"
        />

        <InfoSection
          icon={<BriefcaseBusiness />}
          title="Experience"
          items={experience}
          type="experience"
        />

        <InfoSection
          icon={<Award />}
          title="Courses & Certifications"
          items={certifications}
          type="certifications"
        />
      </section>

      <section className="container about-block">
        <SectionHeading icon={<FolderCode />} title="Projects" />
        <div className="projects-grid">
          {projects?.map((project, index) => (
            <div className="project-card glass-card" key={index}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              <div className="tech-list">
                {project.technologies?.map((tech, i) => (
                  <span key={i}>{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container about-block">
        <SectionHeading icon={<Cpu />} title="Technical Skills" />
        <div className="skills-grid">
          {skills?.map((skill, index) => (
            <div className="skill-card glass-card" key={index}>
              <h3>{skill.category}</h3>
              <div className="skill-items">
                {skill.items?.map((item, i) => (
                  <span key={i}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container about-bottom-grid">
        <div className="glass-card bottom-card">
          <SectionHeading icon={<Users />} title="Activities" />
          <div className="mini-list">
            {activities?.map((activity, index) => (
              <div className="mini-item" key={index}>
                <h4>{activity.organization}</h4>
                <p>{activity.role}</p>
                <span>
                  {activity.startDate} - {activity.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card bottom-card">
          <SectionHeading icon={<Languages />} title="Languages" />
          <div className="mini-list">
            {languages?.map((language, index) => (
              <div className="mini-item language-item" key={index}>
                <h4>{language.name}</h4>
                <span>{language.level}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

const SectionHeading = ({ icon, title }) => {
  return (
    <div className="section-heading">
      <span>{icon}</span>
      <h2>{title}</h2>
    </div>
  );
};

const InfoSection = ({ icon, title, items, type }) => {
  return (
    <div className="glass-card info-section">
      <SectionHeading icon={icon} title={title} />

      <div className="timeline">
        {items?.map((item, index) => (
          <div className="timeline-item" key={index}>
            <span className="timeline-dot"></span>

            <div>
              <h3>{item.degree || item.title}</h3>

              <p className="timeline-place">
                {type === "education"
                  ? item.institution
                  : type === "experience"
                  ? item.company
                  : item.issuer}
              </p>

              <span className="timeline-date">
                {item.startDate}
                {item.endDate ? ` - ${item.endDate}` : ""}
              </span>

              {item.location && <p className="timeline-location">{item.location}</p>}

              {item.description && (
                <p className="timeline-description">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
