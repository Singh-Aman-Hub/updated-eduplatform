// client/src/pages/Homepage.js

import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const Homepage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Bridge the Gap to a College that suits you the Best!</h1>
          <p>
            Connect with college seniors, explore academic streams, and get personalized guidance for your future.
          </p>
          <Link to="/register" className="cta-btn">
            Get Started
          </Link>
        </div>
      </header>

      {/* Info Cards */}
      <section className="info-section">
        <div className="info-card" id="info1">
          <div className="info-overlay">
          <h3>Find Mentorship</h3>
          <p>Talk to college seniors and learn from their experiences.</p>
          </div>
        </div>
        <div className="info-card" id="info2">
          <div className="info-overlay">
          <h3>AI-Powered Matching</h3>
          <p>Get senior recommendations tailored to your preferences.</p>
          </div>
        </div>
        <div className="info-card" id="info3">
          <div className="info-overlay">
          <h3>Community Support</h3>
          <p>Join discussions and get your queries answered instantly.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to Make Your Transition Smooth?</h2>
        <p>Start your journey towards higher education with EduBridge today.</p>
        <Link to="/login" className="cta-btn">
          Join Now
        </Link>
      </section>
    </div>
  );
};

export default Homepage;