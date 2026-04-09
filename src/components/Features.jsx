import React from "react";

function Features() {
  const features = [
    {
      title: "Portfolio Analysis",
      description:
        "AI-powered analysis of your investment portfolio's risk, diversification, and performance metrics.",
    },
    {
      title: "AI Investment Assistant",
      description:
        "Ask questions in plain English and get data-backed answers about any stock, sector, or market trend.",
    },
    {
      title: "Pattern Recognition",
      description:
        "Identify technical patterns and market anomalies that might be missed by human analysis.",
    },
    {
      title: "Sentiment Analysis",
      description:
        "Monitor market sentiment across news, social media, and analyst reports to gauge momentum.",
    },
    {
      title: "Real-time Alerts",
      description:
        "Get personalized notifications about market movements and opportunities relevant to your portfolio.",
    },
    {
      title: "Goal-Based Planning",
      description:
        "Set financial goals and get AI-powered recommendations to help you achieve them.",
    },
  ];

  return (
    <>
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2>AI-Powered Investment Tools</h2>
            <p>
              Our platform uses advanced machine learning to help you make
              better investment decisions.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon"></div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Features;
