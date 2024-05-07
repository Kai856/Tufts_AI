// AboutMe.jsx

import React from 'react';
import './AboutMe.css';

const AboutMe = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1 className="about-heading">About JumboAI</h1>
        <div className="about-content">
          <p>JmboAI is designed to assist potential students in navigating the wealth of information available on the Tufts University website. By utilizing advanced AI technology, JumboAI can provide detailed, customized responses to inquiries about campus life, academic programs, and campus facilities. This not only streamlines the process of researching potential colleges but also allows users to gain valuable insights into what Tufts University has to offer. Whether it's learning about on-campus housing options, specific academic departments, or extracurricular activities, JumboAI is a valuable resource for those looking to understand and connect with Tufts University more effectively. By leveraging the power of AI, JumboAI helps bridge the gap between prospective students and the information they need to make an informed decision about their academic future.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
