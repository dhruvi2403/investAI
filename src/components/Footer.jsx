import React from "react";

function Footer() {
  const productLinks = ["Features", "Pricing", "Integrations", "Updates"];
  const resourceLinks = ["Blog", "Guides", "Help Center", "Community"];
  const companyLinks = ["About", "Careers", "Contact", "Legal"];

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div>
            <div className="footer-logo">Market</div>
            <p className="footer-about">
              AI-powered investment dashboard helping retail investors make
              smarter decisions with advanced analytics and machine learning.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-links">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              {resourceLinks.map((link, index) => (
                <li key={index}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 InvestAI. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
