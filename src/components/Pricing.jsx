import React from 'react';

function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: "$9",
      popular: false,
      features: [
        "Basic Portfolio Analysis",
        "Limited AI Assistant Queries",
        "Daily Market Summaries",
        "Mobile App Access"
      ],
      buttonText: "Get Started"
    },
    {
      name: "Pro",
      price: "$29",
      popular: true,
      features: [
        "Advanced Portfolio Analysis",
        "Unlimited AI Assistant Queries",
        "Real-time Alerts",
        "Sentiment Analysis",
        "Strategy Backtesting",
        "Priority Support"
      ],
      buttonText: "Get Started"
    },
    {
      name: "Enterprise",
      price: "$99",
      popular: false,
      features: [
        "Everything in Pro",
        "API Access",
        "Custom Reports",
        "Dedicated Account Manager",
        "Advanced Risk Modeling",
        "Multi-user Access"
      ],
      buttonText: "Contact Sales"
    }
  ];

  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <div className="section-header">
          <h2>Simple, Transparent Pricing</h2>
          <p>Choose the plan that fits your investment strategy and goals.</p>
        </div>
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div className={`pricing-card ${plan.popular ? 'popular' : ''}`} key={index}>
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">{plan.price}<span>/month</span></div>
              <ul className="plan-features">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>{feature}</li>
                ))}
              </ul>
              <a href="#" className="btn btn-primary">{plan.buttonText}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;