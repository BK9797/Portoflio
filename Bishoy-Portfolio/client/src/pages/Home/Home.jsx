import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BrainCircuit, MapPin, Mail, Phone } from "lucide-react";
import { getPortfolio } from "../../services/portfolioService";
import "./Home.css";

const Home = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await getPortfolio();
        setPortfolio(data);
      } catch {
        setError("Failed to load portfolio data");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (loading) return <div className="loading">Initializing AI profile...</div>;
  if (error) return <div className="error">{error}</div>;

  const { profile, projects, skills } = portfolio;

  return (
    <main className="page home-page">
      <section className="container hero-grid">
        <div className="hero-content">
          {/* <div className="ai-badge">
            <Sparkles size={16} />
            AI Portfolio Agent Online
          </div> */}

          <h1 className="hero-title">
            Hi, I’m <span className="gradient-text">{profile.name}</span>
          </h1>

          <h2 className="hero-role">{profile.subtitle || profile.title}</h2>

          <p className="hero-summary">{profile.summary}</p>

          <div className="hero-actions">
            <Link to="/about" className="btn btn-primary">
              Explore Profile
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Contact Me
            </Link>
          </div>

          <div className="hero-info">
            <span>
              <MapPin size={17} />
              {profile.location}
            </span>
            <span>
              <Mail size={17} />
              {profile.email}
            </span>
            <span>
              <Phone size={17} />
              +2{profile.phone}
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="agent-card glass-card">
            <div className="scan-ring">
              <div className="profile-image-wrap">
                {profile.image ? (
                  <img src={profile.image} alt={profile.name} />
                ) : (
                  <BrainCircuit size={92} />
                )}
              </div>
            </div>

            <div className="agent-status">
              <span></span>
              Neural systems active
            </div>

            <h3>{profile.title}</h3>
            <p>RAG Systems • Computer Vision • NLP • AI Agents</p>
          </div>
        </div>
      </section>

      <section className="container home-stats">
        <div className="stat-card glass-card">
          <strong>{projects?.length || 0}+</strong>
          <span>AI & Engineering Projects</span>
        </div>

        <div className="stat-card glass-card">
          <strong>{skills?.length || 0}</strong>
          <span>Technical Skill Areas</span>
        </div>

        <div className="stat-card glass-card">
          <strong>RAG</strong>
          <span>Current Focus</span>
        </div>
      </section>
    </main>
  );
};

export default Home;
