import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, MapPin, Phone, Send, Bot } from "lucide-react";
import toast from "react-hot-toast";
import { getPortfolio } from "../../services/portfolioService";
import "./Contact.css";

const fallbackProfile = {
  email: "bishoykamel88@gmail.com",
  phone: "01099298946",
  location: "Cairo, Egypt",
};

const emailJsConfig = {
  serviceId: {
    envName: "VITE_EMAILJS_SERVICE_ID",
    value: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  },
  templateId: {
    envName: "VITE_EMAILJS_TEMPLATE_ID",
    value: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  },
  publicKey: {
    envName: "VITE_EMAILJS_PUBLIC_KEY",
    value: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  },
};

const getMissingEmailJsConfig = () => {
  return Object.entries(emailJsConfig)
    .filter(([, config]) => !config.value)
    .map(([, config]) => config.envName);
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [profile, setProfile] = useState(fallbackProfile);

  const [status, setStatus] = useState({
    loading: false,
    success: "",
    error: "",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const data = await getPortfolio();

        if (isMounted) {
          setProfile(data.profile);
        }
      } catch {
        if (isMounted) {
          setProfile(fallbackProfile);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({
      loading: true,
      success: "",
      error: "",
    });

    try {
      const missingConfig = getMissingEmailJsConfig();

      if (missingConfig.length) {
        throw new Error(
          `Email service is not configured. Missing: ${missingConfig.join(", ")}.`
        );
      }

      await emailjs.send(
        emailJsConfig.serviceId.value,
        emailJsConfig.templateId.value,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          from_name: formData.name,
          from_email: formData.email,
          reply_to: formData.email,
          to_name: profile.name || "Bishoy",
        },
        {
          publicKey: emailJsConfig.publicKey.value,
        }
      );

      toast.success("Message sent successfully");

      setFormData({
        name: "",
        email: "",
        message: "",
      });

      setStatus({
        loading: false,
        success: "Message sent successfully.",
        error: "",
      });
    } catch (error) {
      const message = error?.text || error?.message || "Failed to send message.";

      toast.error(message);

      setStatus({
        loading: false,
        success: "",
        error: message,
      });
    }
  };

  return (
    <main className="page contact-page">
      <section className="container contact-header">
        <div className="ai-badge">
          <Bot size={16} />
          Communication Node
        </div>

        <h1 className="section-title">
          Contact <span className="gradient-text">Bishoy</span>
        </h1>

        <p className="section-subtitle">
          Send a message directly through this AI-styled contact interface.
        </p>
      </section>

      <section className="container contact-grid">
        <div className="contact-info glass-card">
          <h2>Connection Details</h2>

          <div className="contact-info-list">
            <div className="contact-info-item">
              <Mail />
              <div>
                <span>Email</span>
                <p>{profile.email}</p>
              </div>
            </div>

            <div className="contact-info-item">
              <Phone />
              <div>
                <span>Phone</span>
                <p>{profile.phone}</p>
              </div>
            </div>

            <div className="contact-info-item">
              <MapPin />
              <div>
                <span>Location</span>
                <p>{profile.location}</p>
              </div>
            </div>
          </div>
        </div>

        <form
          className="contact-form glass-card"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="contact-name">Your Name</label>
            <input
              id="contact-name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-email">Your Email</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-message">Your Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows="7"
              placeholder="Write your message..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {status.success && <p className="form-success">{status.success}</p>}
          {status.error && <p className="form-error">{status.error}</p>}

          <button
            type="submit"
            className="btn btn-primary form-submit"
            disabled={status.loading}
          >
            <Send size={18} />
            {status.loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Contact;
