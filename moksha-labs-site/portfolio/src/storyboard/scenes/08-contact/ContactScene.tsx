/**
 * Scene 8: Contact
 * 
 * Large typography minimal form
 * Inspired by ARTI2000's contact section
 */

'use client';

import { useState } from 'react';
import { useScene } from '../../hooks/useScene';
import { contactSceneConfig } from './ContactScene.config';

export function ContactScene() {
  const { sceneRef, progress, getPhaseProgress } = useScene(contactSceneConfig);

  const introProgress = getPhaseProgress('intro');
  const holdProgress = getPhaseProgress('hold');
  const outroProgress = getPhaseProgress('outro');
  
  const opacity = Math.min(1, introProgress * 2) * (1 - outroProgress);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <section
      ref={sceneRef}
      id={contactSceneConfig.id}
      data-scene={contactSceneConfig.id}
      className="relative min-h-screen bg-gradient-to-b from-brand-teal-dark via-black to-brand-teal-dark flex items-center overflow-hidden"
    >
      {/* Animated Background Orbs */}
      <div 
        className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: 'var(--brand-saffron)',
          transform: `translate(${progress * 100}px, ${Math.sin(progress * Math.PI) * 50}px)`,
        }}
      />
      <div 
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: 'var(--brand-teal)',
          transform: `translate(-${progress * 100}px, -${Math.sin(progress * Math.PI) * 50}px)`,
        }}
      />
      
      <div className="container-custom relative z-10 max-w-5xl py-20">
        
        {/* Large Title Section */}
        <div 
          className="text-center mb-24"
          style={{
            opacity,
            transform: `translateY(${(1 - introProgress) * 50}px)`,
          }}
        >
          <h2 
            className="font-bold text-white mb-8 leading-[0.95] tracking-tight"
            style={{ fontSize: 'var(--text-3xl)' }}
          >
            Let&apos;s Create<br/>Together
          </h2>
          <p 
            className="text-teal-100 font-light max-w-2xl mx-auto"
            style={{ 
              fontSize: 'var(--text-lg)',
              lineHeight: 'var(--leading-normal)'
            }}
          >
            Have a project in mind? We&apos;d love to hear about it.
          </p>
        </div>
        
        {/* Contact Form */}
        {!submitted ? (
          <form 
            onSubmit={handleSubmit}
            className="space-y-8"
            style={{
              opacity: Math.max(0, (introProgress - 0.3) * 2),
              transform: `translateY(${Math.max(0, (1 - (introProgress - 0.3) * 2)) * 30}px)`,
            }}
          >
            {/* Name Field */}
            <div className="relative">
              <label 
                htmlFor="name" 
                className={`absolute left-6 transition-all duration-300 pointer-events-none ${
                  focusedField === 'name' || formData.name
                    ? '-top-3 text-xs bg-black px-2 text-brand-saffron'
                    : 'top-5 text-base text-teal-300/50'
                }`}
              >
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-6 py-5 bg-white/5 border-2 rounded-xl text-white text-lg placeholder-transparent focus:outline-none transition-all duration-300 backdrop-blur-sm"
                style={{
                  borderColor: focusedField === 'name' ? 'var(--brand-saffron)' : 'var(--brand-teal-light)',
                }}
                required
              />
            </div>
            
            {/* Email Field */}
            <div className="relative">
              <label 
                htmlFor="email" 
                className={`absolute left-6 transition-all duration-300 pointer-events-none ${
                  focusedField === 'email' || formData.email
                    ? '-top-3 text-xs bg-black px-2 text-brand-saffron'
                    : 'top-5 text-base text-teal-300/50'
                }`}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-6 py-5 bg-white/5 border-2 rounded-xl text-white text-lg placeholder-transparent focus:outline-none transition-all duration-300 backdrop-blur-sm"
                style={{
                  borderColor: focusedField === 'email' ? 'var(--brand-saffron)' : 'var(--brand-teal-light)',
                }}
                required
              />
            </div>
            
            {/* Message Field */}
            <div className="relative">
              <label 
                htmlFor="message" 
                className={`absolute left-6 transition-all duration-300 pointer-events-none ${
                  focusedField === 'message' || formData.message
                    ? '-top-3 text-xs bg-black px-2 text-brand-saffron'
                    : 'top-5 text-base text-teal-300/50'
                }`}
              >
                Tell us about your project
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                rows={6}
                className="w-full px-6 py-5 bg-white/5 border-2 rounded-xl text-white text-lg placeholder-transparent focus:outline-none resize-none transition-all duration-300 backdrop-blur-sm"
                style={{
                  borderColor: focusedField === 'message' ? 'var(--brand-saffron)' : 'var(--brand-teal-light)',
                }}
                required
              />
            </div>
            
            {/* Submit Button */}
            <div className="text-center pt-6">
              <button
                type="submit"
                className="group px-12 py-6 bg-brand-saffron text-white text-lg font-bold rounded-xl hover:bg-brand-saffron-light hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-brand-saffron/50 flex items-center gap-3 mx-auto"
              >
                <span>Send Message</span>
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="group-hover:translate-x-1 transition-transform duration-300"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </form>
        ) : (
          // Success Message
          <div 
            className="text-center py-20"
            style={{
              opacity: submitted ? 1 : 0,
              transform: `scale(${submitted ? 1 : 0.8})`,
              transition: 'all 0.5s ease-out',
            }}
          >
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-brand-saffron flex items-center justify-center">
              <svg 
                width="48" 
                height="48" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                strokeWidth="3"
              >
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-4xl font-bold text-white mb-4">Message Sent!</h3>
            <p className="text-xl text-teal-100">We&apos;ll get back to you shortly.</p>
          </div>
        )}
        
        {/* Footer Info */}
        <div 
          className="mt-20 pt-12 border-t border-white/10 text-center space-y-6"
          style={{ opacity }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-teal-100">
            <div>
              <p className="text-xs uppercase tracking-widest mb-2 text-teal-300">Office Hours</p>
              <p className="text-lg">Monday - Friday, 9:00 - 18:00</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest mb-2 text-teal-300">Direct Contact</p>
              <p className="text-lg">hello@mokshalabs.com</p>
            </div>
          </div>
          
          <p className="text-sm text-teal-300/50 pt-8">
            © 2024 Moksha Labs. All rights reserved.
          </p>
        </div>
        
      </div>
    </section>
  );
}
