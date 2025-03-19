import React, { useState } from 'react';
import './contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form fields
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: false,
        error: true,
        message: 'Please fill in all required fields.'
      });
      return;
    }
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        error: false,
        message: 'Thank you for your message. We will get back to you soon!'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  return (
    <div className="contact-container">
      {/* Contact Hero */}
      <div className="contact-hero">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">
          Have a question or want to collaborate?.
        </p>
      </div>
      
      {/* Contact Content */}
      <div className="contact-content">
        <div className="contact-info">
          <div className="info-section">
            <h3>Contact Info</h3>
            <ul className="info-list">
              <li>
                <span className="info-label">Email</span>
                <a href="mailto:info@team07gallery.com" className="info-value">info@team07gallery.com</a>
              </li>
              <li>
                <span className="info-label">Phone</span>
                <span className="info-value">+1 (555) 123-4567</span>
              </li>
              <li>
                <span className="info-label">Address</span>
                <address className="info-value">
                  123 Art Gallery Lane<br />
                  Digital District<br />
                  New York, NY 10001
                </address>
              </li>
            </ul>
          </div>
          
          <div className="info-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            </div>
          </div>
          
          <div className="info-section">
            <h3>Gallery Hours</h3>
            <ul className="hours-list">
              <li>
                <span className="day">Monday - Friday</span>
                <span className="hours">10AM - 6PM</span>
              </li>
              <li>
                <span className="day">Saturday</span>
                <span className="hours">11AM - 5PM</span>
              </li>
              <li>
                <span className="day">Sunday</span>
                <span className="hours">Closed</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <h3>Send Us a Message</h3>
            
            {formStatus.message && (
              <div className={`form-message ${formStatus.error ? 'error' : 'success'}`}>
                {formStatus.message}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="name">Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message*</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
            </div>
            
            <button type="submit" className="submit-button">
              {formStatus.submitted ? 'Sent!' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
      
      {/* Map or Image Section */}
      <div className="contact-map">
        <div className="map-placeholder">
          <div className="map-overlay">
            <p>Team 0-7 Gallery</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
