"use client";
import { useState } from "react";
import Navbar from '@/components/Navbar';
import { Mail, Phone, MapPin, Send } from "lucide-react";
import contactService from '@/services/contactService';

export default function Page() {
  const [formData, setFormData] = useState({
    email: '',
    category: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await contactService.submitMessage(formData);
      setSuccess(true);
      setFormData({
        email: '',
        category: '',
        subject: '',
        message: ''
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1 ml-64 overflow-y-auto h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-gray-600 mt-2">Have Questions, feedback, or issues? We're here to help.</p>
        </div>

        <div className="px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Send us a Message</h2>
                    <p className="text-sm text-gray-600">Fill out the form below and we'll get back to you within 24-48 hrs</p>
                  </div>
                </div>

                {/* Success Message */}
                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-medium">Message sent successfully! We'll get back to you soon.</p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Category</label>
                    <select
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Select a category</option>
                      <option value="General">General</option>
                      <option value="Technical">Technical</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Partnership">Partnership</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Brief description of your message"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Message</label>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Tell us more about your enquiry"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#16A34A] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#15803D] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

            {/* Get in Touch Section - Takes 1 column */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>

                {/* Email Support */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">Email Support</h3>
                  </div>
                  <a href="mailto:support@ecoactionhub.org" className="text-green-600 hover:text-green-700 ml-13">
                    support@ecoactionhub.org
                  </a>
                </div>

                {/* Phone */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">Phone</h3>
                  </div>
                  <a href="tel:+254700123456" className="text-green-600 hover:text-green-700 ml-13">
                    +254 700 123 456
                  </a>
                </div>

                {/* Office */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">Office</h3>
                  </div>
                  <div className="text-gray-700 ml-13">
                    <p>Nairobi, Kenya</p>
                    <p className="text-green-600">Westlands Waiyaki Way</p>
                  </div>
                </div>
              </div>

              {/* Additional Info Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Quick Response</h3>
                <p className="text-sm text-gray-700 mb-4">
                  We typically respond to all inquiries within 24-48 hours during business days.
                </p>
                <p className="text-sm text-gray-700">
                  For urgent matters, please call our support line directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
