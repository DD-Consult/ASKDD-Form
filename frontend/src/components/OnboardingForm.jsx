import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Upload, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import './OnboardingForm.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function OnboardingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [conversationStarters, setConversationStarters] = useState(['', '', '', '', '']);
  
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      coreDirective: 'Option A',
      chatbotSize: 'default',
      backgroundColorOption: 'default',
      csvFormatConfirmed: false
    }
  });

  const coreDirective = watch('coreDirective');

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo file size must be less than 5MB');
        return;
      }
      setLogoFile(file);
      toast.success('Logo uploaded');
    }
  };

  const handleDocumentsChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });
    setDocumentFiles(prev => [...prev, ...validFiles]);
    toast.success(`${validFiles.length} document(s) added`);
  };

  const removeDocument = (index) => {
    setDocumentFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleConversationStarterChange = (index, value) => {
    const newStarters = [...conversationStarters];
    newStarters[index] = value;
    setConversationStarters(newStarters);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Contact Info
      const contactInfo = {
        name: data.contactName,
        email: data.contactEmail
      };
      
      // Company Identity
      const companyIdentity = {
        legal_name: data.companyLegalName,
        website: data.companyWebsite,
        chatbot_display_name: data.chatbotDisplayName,
        chatbot_persona: data.chatbotPersona || null,
        primary_brand_color: data.primaryBrandColor,
        secondary_brand_color: data.secondaryBrandColor,
        accent_color: data.accentColor,
        background_color: data.backgroundColorOption === 'custom' ? data.backgroundColorCustom : data.backgroundColorOption,
        chatbot_size: data.chatbotSize
      };
      
      // Chatbot Functionality
      const filteredStarters = conversationStarters.filter(s => s.trim() !== '');
      const chatbotFunctionality = {
        business_hours: null,
        out_of_hours_response: null,
        conversation_starters: filteredStarters.length > 0 ? filteredStarters : null
      };
      
      // Knowledge Base
      const knowledgeBase = {
        knowledge_base_description: data.knowledgeBaseDescription || null,
        csv_format_confirmed: data.csvFormatConfirmed || false,
        core_directive: data.coreDirective,
        fallback_message: data.coreDirective === 'Option B' ? data.fallbackMessage : null,
        other_ai_directives: data.otherAIDirectives || null,
        support_contact: data.supportContact
      };
      
      // Technical Deployment
      const technicalDeployment = {
        website_platform: data.websitePlatform,
        website_management: data.websiteManagement,
        technical_contact_name: data.technicalContactName,
        technical_contact_email: data.technicalContactEmail,
        deployment_preference: data.deploymentPreference
      };
      
      formData.append('contact_info', JSON.stringify(contactInfo));
      formData.append('company_identity', JSON.stringify(companyIdentity));
      formData.append('chatbot_functionality', JSON.stringify(chatbotFunctionality));
      formData.append('knowledge_base', JSON.stringify(knowledgeBase));
      formData.append('technical_deployment', JSON.stringify(technicalDeployment));
      
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      
      documentFiles.forEach(file => {
        formData.append('documents', file);
      });
      
      const response = await axios.post(`${API}/submissions`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Form submitted successfully! You will receive a confirmation email shortly.');
      
      // Reset form after successful submission
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.detail || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h1 data-testid="form-title">AI Chatbot Onboarding Questionnaire</h1>
          <p>Complete this questionnaire to configure your chatbot's identity, knowledge, and core behaviors.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="onboarding-form">
          {/* Contact Information */}
          <section className="form-section">
            <h2 data-testid="contact-section-title">Contact Information</h2>
            <p className="section-description">Who to contact if we need more information</p>
            
            <div className="form-row">
              <div className="form-group">
                <Label htmlFor="contactName">Name *</Label>
                <Input
                  id="contactName"
                  data-testid="contact-name-input"
                  {...register('contactName', { required: 'Name is required' })}
                  placeholder="Your full name"
                />
                {errors.contactName && <span className="error-message">{errors.contactName.message}</span>}
              </div>
              
              <div className="form-group">
                <Label htmlFor="contactEmail">Email *</Label>
                <Input
                  id="contactEmail"
                  data-testid="contact-email-input"
                  type="email"
                  {...register('contactEmail', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  placeholder="your.email@company.com"
                />
                {errors.contactEmail && <span className="error-message">{errors.contactEmail.message}</span>}
              </div>
            </div>
          </section>

          {/* Company Identity & Branding */}
          <section className="form-section">
            <h2 data-testid="company-section-title">Company Identity & Branding</h2>
            <p className="section-description">Define the look and feel of your chatbot</p>
            
            <div className="form-group">
              <Label htmlFor="companyLegalName">Company Legal Name *</Label>
              <Input
                id="companyLegalName"
                data-testid="company-name-input"
                {...register('companyLegalName', { required: 'Company name is required' })}
                placeholder="Your company's legal name"
              />
              {errors.companyLegalName && <span className="error-message">{errors.companyLegalName.message}</span>}
            </div>
            
            <div className="form-group">
              <Label htmlFor="companyWebsite">Company Website *</Label>
              <Input
                id="companyWebsite"
                data-testid="company-website-input"
                type="url"
                {...register('companyWebsite', { required: 'Website is required' })}
                placeholder="https://www.yourcompany.com"
              />
              {errors.companyWebsite && <span className="error-message">{errors.companyWebsite.message}</span>}
            </div>
            
            <div className="form-group">
              <Label htmlFor="chatbotDisplayName">Chatbot Display Name *</Label>
              <Input
                id="chatbotDisplayName"
                data-testid="chatbot-name-input"
                {...register('chatbotDisplayName', { required: 'Chatbot name is required' })}
                placeholder='e.g., "Support Bot", "Ask CompanyName"'
              />
              {errors.chatbotDisplayName && <span className="error-message">{errors.chatbotDisplayName.message}</span>}
            </div>
            
            <div className="form-group">
              <Label htmlFor="chatbotPersona">Chatbot Persona & Tone (Optional)</Label>
              <Textarea
                id="chatbotPersona"
                data-testid="chatbot-persona-input"
                {...register('chatbotPersona')}
                placeholder='e.g., "Friendly and casual", "Professional and formal"'
                rows={3}
              />
            </div>
            
            <div className="form-group">
              <Label htmlFor="logo">Company Logo</Label>
              <div className="file-upload-area">
                <input
                  type="file"
                  id="logo"
                  data-testid="logo-upload-input"
                  accept=".png,.svg,.jpg,.jpeg"
                  onChange={handleLogoChange}
                  className="file-input"
                />
                <label htmlFor="logo" className="file-upload-label">
                  <Upload className="upload-icon" />
                  <span>{logoFile ? logoFile.name : 'Upload Logo (PNG, SVG, JPG)'}</span>
                </label>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <Label htmlFor="primaryBrandColor">Primary Brand Color *</Label>
                <Input
                  id="primaryBrandColor"
                  data-testid="primary-color-input"
                  {...register('primaryBrandColor', { required: 'Primary color is required' })}
                  placeholder="#FF5733 or 'Blue'"
                />
                {errors.primaryBrandColor && <span className="error-message">{errors.primaryBrandColor.message}</span>}
              </div>
              
              <div className="form-group">
                <Label htmlFor="secondaryBrandColor">Secondary Brand Color *</Label>
                <Input
                  id="secondaryBrandColor"
                  data-testid="secondary-color-input"
                  {...register('secondaryBrandColor', { required: 'Secondary color is required' })}
                  placeholder="#33FF57 or 'Green'"
                />
                {errors.secondaryBrandColor && <span className="error-message">{errors.secondaryBrandColor.message}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <Label htmlFor="accentColor">Accent Color *</Label>
                <Input
                  id="accentColor"
                  data-testid="accent-color-input"
                  {...register('accentColor', { required: 'Accent color is required' })}
                  placeholder="#5733FF or 'Purple'"
                />
                {errors.accentColor && <span className="error-message">{errors.accentColor.message}</span>}
              </div>
              
              <div className="form-group">
                <Label htmlFor="backgroundColorOption">Background Color</Label>
                <Controller
                  name="backgroundColorOption"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger data-testid="background-color-select">
                        <SelectValue placeholder="Select background color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default (White)</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            
            {watch('backgroundColorOption') === 'custom' && (
              <div className="form-group">
                <Label htmlFor="backgroundColorCustom">Custom Background Color</Label>
                <Input
                  id="backgroundColorCustom"
                  data-testid="custom-background-input"
                  {...register('backgroundColorCustom')}
                  placeholder="#FFFFFF or 'Light Gray'"
                />
              </div>
            )}
            
            <div className="form-group">
              <Label htmlFor="chatbotSize">Chatbot Size</Label>
              <Controller
                name="chatbotSize"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger data-testid="chatbot-size-select">
                      <SelectValue placeholder="Select chatbot size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            
            {/* Example Section */}
            <div className="example-section">
              <h3>Example:</h3>
              <div className="example-colors">
                <div className="color-example">
                  <span className="color-label">Primary Brand Color:</span>
                  <img src="https://customer-assets.emergentagent.com/job_questbot-creator/artifacts/k01amisk_primary.png" alt="Primary Color" className="color-indicator" />
                </div>
                <div className="color-example">
                  <span className="color-label">Secondary Brand Color:</span>
                  <img src="https://customer-assets.emergentagent.com/job_questbot-creator/artifacts/rac3npvt_secondary.png" alt="Secondary Color" className="color-indicator" />
                </div>
                <div className="color-example">
                  <span className="color-label">Accent Color:</span>
                  <img src="https://customer-assets.emergentagent.com/job_questbot-creator/artifacts/xg44epc3_accent.png" alt="Accent Color" className="color-indicator" />
                </div>
                <div className="color-example">
                  <span className="color-label">Background Color:</span>
                  <span className="color-value">default</span>
                </div>
                <div className="color-example">
                  <span className="color-label">Chatbot size:</span>
                  <span className="color-value">default</span>
                </div>
              </div>
              <div className="example-image">
                <img src="https://customer-assets.emergentagent.com/job_questbot-creator/artifacts/uffdaxah_Screenshot%202025-10-21%20at%205.48.59%E2%80%AFpm.png" alt="Chatbot Example" />
              </div>
            </div>
          </section>

          {/* Chatbot Core Functionality */}
          <section className="form-section">
            <h2 data-testid="functionality-section-title">Chatbot Core Functionality</h2>
            <p className="section-description">Define initial prompts for users</p>
            
            <div className="form-group">
              <Label>Conversation Starters (Optional - Up to 5, max 30 characters each)</Label>
              {conversationStarters.map((starter, index) => (
                <Input
                  key={index}
                  data-testid={`conversation-starter-${index}`}
                  value={starter}
                  onChange={(e) => handleConversationStarterChange(index, e.target.value.slice(0, 30))}
                  placeholder={`Starter ${index + 1}`}
                  maxLength={30}
                  className="conversation-starter-input"
                />
              ))}
            </div>
          </section>

          {/* Knowledge Base & System Behavior */}
          <section className="form-section">
            <h2 data-testid="knowledge-section-title">Knowledge Base & System Behavior</h2>
            <p className="section-description">Define what your chatbot knows and how it behaves</p>
            
            <div className="form-group">
              <Label htmlFor="knowledgeBaseDescription">Knowledge Base Documents Description</Label>
              <p className="field-description">Please list and provide all documents you want the chatbot to learn from. This includes FAQs, product manuals, help guides, or specific website URLs</p>
              <Textarea
                id="knowledgeBaseDescription"
                data-testid="knowledge-description-input"
                {...register('knowledgeBaseDescription')}
                placeholder="List all documents, URLs, and describe their content"
                rows={4}
              />
            </div>
            
            <div className="form-group">
              <Label htmlFor="documents">Upload Knowledge Base Documents</Label>
              <div className="file-upload-area">
                <input
                  type="file"
                  id="documents"
                  data-testid="documents-upload-input"
                  accept=".pdf,.doc,.docx,.csv"
                  multiple
                  onChange={handleDocumentsChange}
                  className="file-input"
                />
                <label htmlFor="documents" className="file-upload-label">
                  <Upload className="upload-icon" />
                  <span>Upload Documents (PDF, DOC, DOCX, CSV)</span>
                </label>
              </div>
              {documentFiles.length > 0 && (
                <div className="uploaded-files" data-testid="uploaded-files-list">
                  {documentFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <FileText className="file-icon" />
                      <span>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="remove-file-btn"
                        data-testid={`remove-file-${index}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <Label>CSV Format Confirmation</Label>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="csvFormatConfirmed"
                  data-testid="csv-format-checkbox"
                  {...register('csvFormatConfirmed')}
                />
                <label htmlFor="csvFormatConfirmed">
                  I confirm CSV files have 'question' and 'answer' columns (optional 'priority' column)
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <Label>Chatbot Core Directive (Behavior) *</Label>
              <Controller
                name="coreDirective"
                control={control}
                rules={{ required: 'Please select a core directive' }}
                render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} data-testid="core-directive-radio">
                    <div className="radio-item">
                      <RadioGroupItem value="Option A" id="optionA" />
                      <Label htmlFor="optionA" className="radio-label">
                        <strong>Option A (Flexible/Helpful - default):</strong> Uses documents as primary source but may use general knowledge. Escalates only when unable to construct adequate answer.
                      </Label>
                    </div>
                    <div className="radio-item">
                      <RadioGroupItem value="Option B" id="optionB" />
                      <Label htmlFor="optionB" className="radio-label">
                        <strong>Option B (Strict/Containment):</strong> Only answers based exclusively on provided documents.
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.coreDirective && <span className="error-message">{errors.coreDirective.message}</span>}
            </div>
            
            {coreDirective === 'Option B' && (
              <div className="form-group">
                <Label htmlFor="fallbackMessage">Default Fallback Message *</Label>
                <Textarea
                  id="fallbackMessage"
                  data-testid="fallback-message-input"
                  {...register('fallbackMessage', {
                    required: coreDirective === 'Option B' ? 'Fallback message is required for Option B' : false
                  })}
                  placeholder='e.g., "I can only answer questions about our products. For other inquiries, contact support@company.com"'
                  rows={3}
                />
                {errors.fallbackMessage && <span className="error-message">{errors.fallbackMessage.message}</span>}
              </div>
            )}
            
            <div className="form-group">
              <Label htmlFor="otherAIDirectives">Other AI Directives (Optional)</Label>
              <Textarea
                id="otherAIDirectives"
                data-testid="other-directives-input"
                {...register('otherAIDirectives')}
                placeholder='e.g., "Do not engage in casual conversation", "Never provide financial advice"'
                rows={3}
              />
            </div>
            
            <div className="form-group">
              <Label htmlFor="supportContact">Support Contact *</Label>
              <Input
                id="supportContact"
                data-testid="support-contact-input"
                {...register('supportContact', { required: 'Support contact is required' })}
                placeholder="support@company.com or +1-555-1234"
              />
              {errors.supportContact && <span className="error-message">{errors.supportContact.message}</span>}
            </div>
          </section>

          {/* Technical Deployment */}
          <section className="form-section">
            <h2 data-testid="deployment-section-title">Technical Deployment</h2>
            <p className="section-description">Information about deployment and technical contacts</p>
            
            <div className="form-group">
              <Label htmlFor="websitePlatform">Website Platform *</Label>
              <Input
                id="websitePlatform"
                data-testid="website-platform-input"
                {...register('websitePlatform', { required: 'Website platform is required' })}
                placeholder='e.g., "WordPress", "Shopify", "Custom HTML/JavaScript"'
              />
              {errors.websitePlatform && <span className="error-message">{errors.websitePlatform.message}</span>}
            </div>
            
            <div className="form-group">
              <Label htmlFor="websiteManagement">Website Management *</Label>
              <Input
                id="websiteManagement"
                data-testid="website-management-input"
                {...register('websiteManagement', { required: 'Website management info is required' })}
                placeholder='e.g., "Internal web developer", "Marketing team", "External agency"'
              />
              {errors.websiteManagement && <span className="error-message">{errors.websiteManagement.message}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <Label htmlFor="technicalContactName">Technical Contact Name *</Label>
                <Input
                  id="technicalContactName"
                  data-testid="technical-contact-name-input"
                  {...register('technicalContactName', { required: 'Technical contact name is required' })}
                  placeholder="Full name"
                />
                {errors.technicalContactName && <span className="error-message">{errors.technicalContactName.message}</span>}
              </div>
              
              <div className="form-group">
                <Label htmlFor="technicalContactEmail">Technical Contact Email *</Label>
                <Input
                  id="technicalContactEmail"
                  data-testid="technical-contact-email-input"
                  type="email"
                  {...register('technicalContactEmail', {
                    required: 'Technical contact email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  placeholder="tech@company.com"
                />
                {errors.technicalContactEmail && <span className="error-message">{errors.technicalContactEmail.message}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <Label htmlFor="deploymentPreference">Deployment Preference *</Label>
              <Textarea
                id="deploymentPreference"
                data-testid="deployment-preference-input"
                {...register('deploymentPreference', { required: 'Deployment preference is required' })}
                placeholder="Would you prefer to handle deployment yourself or need assistance?"
                rows={3}
              />
              {errors.deploymentPreference && <span className="error-message">{errors.deploymentPreference.message}</span>}
            </div>
          </section>

          <div className="form-actions">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
              data-testid="submit-form-button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2" />
                  Submit Questionnaire
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}