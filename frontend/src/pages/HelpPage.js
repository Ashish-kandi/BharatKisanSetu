import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './HelpPage.css';

const FAQS = {
  farmer: [
    {
      question: "How do I register as a farmer?",
      answer: "Click 'Login/Register', select 'Farmer Login', then click 'Register' and fill in your details."
    },
    {
      question: "I forgot my password. What should I do?",
      answer: "On the Farmer Login page, click 'Forgot Password' or contact support for help."
    },
    {
      question: "Why do I need to enter my address?",
      answer: "Your address helps consumers find your farm and ensures accurate delivery."
    },
    {
      question: "Can I update my profile later?",
      answer: "Yes, after logging in, go to your Profile page to update your details."
    }
  ],
  consumer: [
    {
      question: "How do I register as a consumer?",
      answer: "Click 'Login/Register', select 'Consumer Login', then click 'Register' and fill in your name, email, and password."
    },
    {
      question: "I didn't receive a verification email.",
      answer: "Check your spam folder. If it's not there, try registering again or contact support."
    },
    {
      question: "Can I use the same email for multiple accounts?",
      answer: "No, each email can be used for only one consumer account."
    },
    {
      question: "How do I reset my password?",
      answer: "On the Consumer Login page, click 'Forgot Password' or contact support."
    }
  ]
};

function HelpPage() {
  const { userType } = useParams();
  const faqs = FAQS[userType] || [];
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="help-page-outer">
      <div className="help-page-container">
        <div className="help-header">
          <h1>
            <span role="img" aria-label="help">❓</span> Help Center
          </h1>
          <p className="help-subtitle">
            {userType === 'farmer'
              ? "Frequently Asked Questions for Farmers"
              : "Frequently Asked Questions for Consumers"}
          </p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`faq-item ${openIndex === idx ? 'open' : ''}`}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              tabIndex={0}
              role="button"
              aria-expanded={openIndex === idx}
              style={{ cursor: 'pointer' }}
            >
              <div className="faq-question-row">
                <h3 className="faq-question">{faq.question}</h3>
                <span className="faq-toggle">{openIndex === idx ? '▲' : '▼'}</span>
              </div>
              {openIndex === idx && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
          {faqs.length === 0 && (
            <p className="no-faqs">No FAQs available for this user type.</p>
          )}
        </div>
        {/* Back to Login link at the bottom */}
        <div className="back-to-login-wrapper">
          <Link
            to={userType === 'farmer' ? "/farmer-login" : "/consumer-login"}
            className="back-to-login"
          >
            ← Back to {userType === 'farmer' ? "Farmer" : "Consumer"} Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HelpPage;
