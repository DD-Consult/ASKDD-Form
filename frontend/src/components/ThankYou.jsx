import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import './ThankYou.css';

export default function ThankYou() {
  useEffect(() => {
    document.title = 'Thank You | ASKDD Chatbot';
  }, []);

  return (
    <div className="thank-you-container">
      <div className="thank-you-card">
        <div className="thank-you-header">
          <img 
            src="https://customer-assets.emergentagent.com/job_questbot-creator/artifacts/2cltiffc_Options%205-transparent%20background%20copy%20%281%29.png" 
            alt="ASKDD Logo" 
            className="thank-you-logo" 
          />
        </div>
        
        <div className="thank-you-content">
          <CheckCircle className="success-icon" size={64} />
          <h1>Thank You!</h1>
          <p className="thank-you-message">
            Your chatbot onboarding questionnaire has been submitted successfully.
          </p>
          <p className="thank-you-details">
            We've received your information and will review it shortly.
          </p>
          <p className="thank-you-contact">
            If you have any questions, please contact us at{' '}
            <a href="mailto:askdd@ddconsult.tech">askdd@ddconsult.tech</a>
          </p>
          
          <div className="thank-you-actions">
            <a href="/" className="btn-home">Return to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
}
