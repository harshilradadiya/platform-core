'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';

export function ContactClient() {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    name: '',
    email: '',
    infringingUrl: '',
    originalUrl: '',
    signature: '',
    dmcaAffirmation: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.subject.trim()) {
      setErrorMessage('Please provide a subject for your inquiry.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Please include a detailed message.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Please provide your contact email address.');
      return;
    }

    // If DMCA section filled out, ensure perjury affirmation and signature
    if (formData.infringingUrl.trim() || formData.originalUrl.trim()) {
      if (!formData.signature.trim()) {
        setErrorMessage('Please provide your Electronic Signature for DMCA inquiries.');
        return;
      }
      if (!formData.dmcaAffirmation) {
        setErrorMessage('Please confirm the DMCA declaration checkbox.');
        return;
      }
    }

    setIsSubmitting(true);

    // Simulate reliable dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-xl mx-auto mt-12 p-8 bg-white border border-gray-200 rounded-xl shadow-sm text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Received</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Thank you for contacting us. Your message has been logged with our legal and support desk. We will review your submission and respond to <strong className="text-gray-800">{formData.email}</strong> within 1-2 business days.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              subject: '',
              message: '',
              name: '',
              email: '',
              infringingUrl: '',
              originalUrl: '',
              signature: '',
              dmcaAffirmation: false,
            });
          }}
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {errorMessage && (
        <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Contact Form (Left) */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <label htmlFor="subject" className="sr-only">Subject</label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject (e.g., Problem with download, DMCA Request) *"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-semibold text-gray-800 mb-1">
              Detailed Message <span className="text-red-600">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={8}
              value={formData.message}
              onChange={handleChange}
              placeholder="Detailed Message"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow resize-y"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </div>

        {/* DMCA Specific Information Card (Right) */}
        <div className="lg:col-span-5 bg-gray-100/90 border border-gray-200/90 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            DMCA Specific Information
          </h2>

          <div>
            <label htmlFor="infringingUrl" className="sr-only">URL of infringing content</label>
            <input
              id="infringingUrl"
              type="url"
              name="infringingUrl"
              value={formData.infringingUrl}
              onChange={handleChange}
              placeholder="URL of infringing content"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
            />
          </div>

          <div>
            <label htmlFor="originalUrl" className="sr-only">URL of original work</label>
            <input
              id="originalUrl"
              type="url"
              name="originalUrl"
              value={formData.originalUrl}
              onChange={handleChange}
              placeholder="URL of original work"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
            />
          </div>

          <div>
            <label htmlFor="signature" className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5">
              Electronic Signature (Full Name)
            </label>
            <input
              id="signature"
              type="text"
              name="signature"
              value={formData.signature}
              onChange={handleChange}
              placeholder=""
              className="w-full px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
            />
          </div>

          <div className="pt-1 flex items-start gap-2.5">
            <input
              id="dmcaAffirmation"
              type="checkbox"
              name="dmcaAffirmation"
              checked={formData.dmcaAffirmation}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
            />
            <label htmlFor="dmcaAffirmation" className="text-xs text-gray-600 leading-relaxed cursor-pointer select-none">
              I confirm under penalty of perjury of the law that I am authorized to act on behalf of the owner of the work, that this request is made in good faith, and that the information provided is accurate under our Privacy Policy.
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
