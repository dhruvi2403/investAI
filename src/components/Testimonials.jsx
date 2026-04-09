import React from 'react';

function Testimonials() {
  const testimonials = [
    {
      content: "The AI assistant is like having a financial analyst on call 24/7. I can ask complex questions about market trends and get thoughtful, data-backed answers in seconds.",
      name: "Michael K.",
      title: "Part-time Investor",
      image: "/api/placeholder/50/50"
    },
    {
      content: "The portfolio analysis found a sector concentration I hadn't noticed. Rebalancing based on InvestAI's recommendations boosted my returns by 14% in just three months.",
      name: "Sarah J.",
      title: "Active Trader",
      image: "/api/placeholder/50/50"
    },
    {
      content: "As someone new to investing, the educational features and risk management tools have given me the confidence to build a portfolio aligned with my long-term goals.",
      name: "David T.",
      title: "New Investor",
      image: "/api/placeholder/50/50"
    }
  ];

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-header">
          <h2>What Our Users Say</h2>
          <p>Join thousands of investors who are already using InvestAI to transform their investment strategy.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="testimonial-content">
                "{testimonial.content}"
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src={testimonial.image} alt={testimonial.name} />
                </div>
                <div>
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-title">{testimonial.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;