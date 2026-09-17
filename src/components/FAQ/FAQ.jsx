import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import "./FAQ.css";

const faqData = [
  {
    question: "Do I need to book an appointment in advance?",
    answer:
      "We recommend booking in advance so you can get your preferred service, date and time. Walk-ins may be accepted depending on availability.",
  },
  {
    question: "What services does BellaGlow offer?",
    answer:
      "BellaGlow offers hair care, skin and facial treatments, makeup, nail care, spa and wellness services, and complete bridal beauty experiences.",
  },
  {
    question: "Can I book more than one service together?",
    answer:
      "Yes. You can combine multiple services in one visit. Our beauty packages are also designed for a complete beauty experience.",
  },
  {
    question: "How can I cancel my appointment?",
    answer:
      "You can view your booking in the My Appointment section and use the Cancel Appointment option to remove your saved booking.",
  },
  {
    question: "Do you offer bridal beauty services?",
    answer:
      "Yes. BellaGlow offers bridal makeup, hair styling, skincare, nails and complete bridal beauty experiences for your special day.",
  },
  {
    question: "Are the products used at BellaGlow suitable for sensitive skin?",
    answer:
      "We carefully select quality beauty products and can discuss your skin preferences before your treatment. Please mention any concerns while booking.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex((prev) =>
      prev === index ? -1 : index
    );
  };

  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">

        <div className="faq-header">

          <div className="faq-label">
            <span></span>
            FREQUENTLY ASKED QUESTIONS
          </div>

          <div className="faq-heading-row">

            <h2>
              Everything you
              <br />
              need to <em>know.</em>
            </h2>

            <p>
              Have a question before your visit?
              Find answers to some of the most common
              questions about BellaGlow and our services.
            </p>

          </div>
        </div>

        <div className="faq-list">

          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                className={`faq-item ${
                  isOpen ? "open" : ""
                }`}
                key={faq.question}
              >

                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                >

                  <span className="faq-number">
                    0{index + 1}
                  </span>

                  <span className="faq-question-text">
                    {faq.question}
                  </span>

                  <span className="faq-icon">
                    {isOpen ? <FiMinus /> : <FiPlus />}
                  </span>

                </button>

                <div
                  className={`faq-answer ${
                    isOpen ? "show" : ""
                  }`}
                >
                  <p>{faq.answer}</p>
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default FAQ;