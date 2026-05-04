import { useEffect, useState } from "react";
import { getPortfolio } from "../../services/portfolioService";
import "./Footer.css";

const socialLinks = [
  { key: "github", label: "GitHub", mark: "GH" },
  { key: "linkedin", label: "LinkedIn", mark: "in" },
  { key: "facebook", label: "Facebook", mark: "f" },
];

const Footer = () => {
  const [socials, setSocials] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPortfolio();
        setSocials(data.profile.socials);
      } catch {
        console.error("Failed to load socials");
      }
    };

    fetchData();
  }, []);

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-left">
          <h3>Bishoy<span>AI</span></h3>
        </div>

        <div className="footer-right">
          {socialLinks.map(({ key, label, mark }) =>
            socials?.[key] ? (
              <a
                key={key}
                href={socials[key]}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
              >
                <span className="social-mark">{mark}</span>
              </a>
            ) : null
          )}
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Bishoy Kamel. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
