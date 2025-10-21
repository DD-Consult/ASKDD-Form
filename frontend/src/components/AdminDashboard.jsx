import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, Mail, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import './AdminDashboard.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${API}/submissions`);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="header-logo-admin">
          <img src="https://customer-assets.emergentagent.com/job_questbot-creator/artifacts/2cltiffc_Options%205-transparent%20background%20copy%20%281%29.png" alt="ASKDD Logo" className="logo-image-admin" />
        </div>
        <h1 data-testid="admin-title">ASKDD Chatbot - Form Submissions</h1>
        <p>All client onboarding questionnaire submissions</p>
      </div>

      {submissions.length === 0 ? (
        <div className="no-submissions">
          <FileText size={48} />
          <p>No submissions yet</p>
        </div>
      ) : (
        <div className="submissions-list">
          {submissions.map((submission) => (
            <div key={submission.id} className="submission-card" data-testid="submission-card">
              <div className="submission-header" onClick={() => toggleExpand(submission.id)}>
                <div className="submission-info">
                  <h3>{submission.contact_info.name}</h3>
                  <div className="submission-meta">
                    <span>
                      <Mail size={16} />
                      {submission.contact_info.email}
                    </span>
                    <span>
                      <Calendar size={16} />
                      {new Date(submission.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" data-testid="toggle-expand-button">
                  {expandedId === submission.id ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>

              {expandedId === submission.id && (
                <div className="submission-details">
                  <section>
                    <h4>Company Identity</h4>
                    <div className="detail-grid">
                      <div><strong>Legal Name:</strong> {submission.company_identity.legal_name}</div>
                      <div><strong>Website:</strong> {submission.company_identity.website}</div>
                      <div><strong>Chatbot Name:</strong> {submission.company_identity.chatbot_display_name}</div>
                      <div><strong>Primary Color:</strong> {submission.company_identity.primary_brand_color}</div>
                      <div><strong>Secondary Color:</strong> {submission.company_identity.secondary_brand_color}</div>
                      <div><strong>Accent Color:</strong> {submission.company_identity.accent_color}</div>
                    </div>
                  </section>

                  <section>
                    <h4>Chatbot Functionality</h4>
                    <div className="detail-grid">
                      <div><strong>Business Hours:</strong> {submission.chatbot_functionality.business_hours || 'N/A'}</div>
                      {submission.chatbot_functionality.conversation_starters && (
                        <div>
                          <strong>Conversation Starters:</strong>
                          <ul>
                            {submission.chatbot_functionality.conversation_starters.map((starter, idx) => (
                              <li key={idx}>{starter}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </section>

                  <section>
                    <h4>Knowledge Base</h4>
                    <div className="detail-grid">
                      <div><strong>Core Directive:</strong> {submission.knowledge_base.core_directive}</div>
                      <div><strong>Support Contact:</strong> {submission.knowledge_base.support_contact}</div>
                    </div>
                  </section>

                  <section>
                    <h4>Technical Deployment</h4>
                    <div className="detail-grid">
                      <div><strong>Platform:</strong> {submission.technical_deployment.website_platform}</div>
                      <div><strong>Management:</strong> {submission.technical_deployment.website_management}</div>
                      <div><strong>Technical Contact:</strong> {submission.technical_deployment.technical_contact_name} ({submission.technical_deployment.technical_contact_email})</div>
                    </div>
                  </section>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}