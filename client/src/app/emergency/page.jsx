'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Droplets, Thermometer, Bell, Phone, Wind, Flame, X, Send } from 'lucide-react';
import { Icon } from '@iconify/react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { endpoints } from '@/services/apiConfig';

const API_BASE_URL = endpoints.emergency;

// Helper function to get icon based on alert type
const getAlertIcon = (type) => {
  if (type.toLowerCase().includes('flood')) return Droplets;
  if (type.toLowerCase().includes('heat')) return Thermometer;
  if (type.toLowerCase().includes('fire')) return Flame;
  
  if (type.toLowerCase().includes('air')) return Wind;
  return AlertTriangle;
};

// Helper function to get color based on alert type
const getAlertColor = (type) => {
  if (type.toLowerCase().includes('flood')) return 'text-cyan-600';
  if (type.toLowerCase().includes('heat')) return 'text-red-600';
  if (type.toLowerCase().includes('fire')) return 'text-orange-600';
  if (type.toLowerCase().includes('air')) return 'text-gray-600';
  return 'text-yellow-600';
};

export default function EmergencyPage() {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState('Police');
  const [insights, setInsights] = useState(null);
  const [priorityAlerts, setPriorityAlerts] = useState([]);
  const [allAlerts, setAllAlerts] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showAllAlertsModal, setShowAllAlertsModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  
  // Report form state
  const [reportForm, setReportForm] = useState({
    reporter_name: '',
    reporter_phone: '',
    reporter_email: '',
    emergency_type: '',
    location: '',
    description: '',
    severity: 'Medium'
  });

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // Fetch insights from AI-powered API
  useEffect(() => {
    fetch(`${API_BASE_URL}/insights`, {
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setInsights(data.data);
        }
      })
      .catch(error => console.error('Error fetching insights:', error));
  }, [user]);

  // Fetch priority alerts from AI-powered API
  useEffect(() => {
    fetch(`${API_BASE_URL}/alerts/priority`, {
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const alertsWithIcons = data.data.map(alert => ({
            ...alert,
            icon: getAlertIcon(alert.type),
            color: getAlertColor(alert.type)
          }));
          setPriorityAlerts(alertsWithIcons);
        }
      })
      .catch(error => console.error('Error fetching priority alerts:', error))
      .finally(() => setLoading(false));
  }, [user]);

  // Fetch emergency contacts based on selected service
  useEffect(() => {
    fetch(`${API_BASE_URL}/contacts?service=${selectedService}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEmergencyContacts(data.data);
        }
      })
      .catch(error => console.error('Error fetching contacts:', error));
  }, [selectedService]);

  // Fetch all alerts for modal from AI-powered API
  const fetchAllAlerts = async () => {
    try {
      console.log('=== FETCH ALL ALERTS DEBUG ===');
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('Full URL:', `${API_BASE_URL}/alerts`);
      console.log('Auth headers:', getAuthHeaders());
      
      const response = await fetch(`${API_BASE_URL}/alerts`, {
        headers: getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      console.log('Data success:', data.success);
      console.log('Data.data type:', typeof data.data);
      console.log('Data.data is array:', Array.isArray(data.data));
      console.log('Data.data length:', data.data?.length);
      
      if (data.success && data.data) {
        let alertsToProcess = [];
        
        // Handle different data structures
        if (Array.isArray(data.data)) {
          alertsToProcess = data.data;
        } else if (data.data.alerts && Array.isArray(data.data.alerts)) {
          alertsToProcess = data.data.alerts;
        } else {
          console.warn('Unexpected data structure:', data.data);
          alertsToProcess = [];
        }
        
        console.log('Alerts to process:', alertsToProcess);
        
        if (alertsToProcess.length > 0) {
          const alertsWithIcons = alertsToProcess.map((alert, index) => ({
            ...alert,
            id: alert.id || `alert-${index}`,
            icon: getAlertIcon(alert.type),
            color: getAlertColor(alert.type)
          }));
          console.log('Final processed alerts:', alertsWithIcons);
          setAllAlerts(alertsWithIcons);
        } else {
          console.log('No alerts found, using priority alerts as fallback');
          setAllAlerts(priorityAlerts.length > 0 ? priorityAlerts : []);
        }
      } else {
        console.error('API response indicates failure:', data);
        console.log('Using priority alerts as fallback');
        setAllAlerts(priorityAlerts.length > 0 ? priorityAlerts : []);
      }
    } catch (error) {
      console.error('Error fetching all alerts:', error);
      console.log('Using priority alerts as fallback due to error');
      setAllAlerts(priorityAlerts.length > 0 ? priorityAlerts : []);
    }
  };

  // Handle view all alerts
  const handleViewAllAlerts = async () => {
    console.log('=== VIEW ALL ALERTS CLICKED ===');
    console.log('Current allAlerts state:', allAlerts);
    console.log('Current priorityAlerts state:', priorityAlerts);
    
    // Show modal immediately with loading or existing data
    setShowAllAlertsModal(true);
    
    // If we have priority alerts, use them as initial data
    if (priorityAlerts.length > 0) {
      console.log('Using priority alerts as initial data');
      setAllAlerts(priorityAlerts);
    }
    
    // Then fetch fresh data
    try {
      await fetchAllAlerts();
    } catch (error) {
      console.error('Failed to fetch alerts, keeping existing data');
    }
  };

  // Handle report emergency
  const handleReportEmergency = () => {
    setShowReportModal(true);
  };

  // Handle call button
  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  // Handle view more insights
  const handleViewMoreInsights = () => {
    setShowInsightsModal(true);
  };

  // Handle report form submission
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reportForm)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Emergency report submitted successfully!');
        setShowReportModal(false);
        setReportForm({
          reporter_name: '',
          reporter_phone: '',
          reporter_email: '',
          emergency_type: '',
          location: '',
          description: '',
          severity: 'Medium'
        });
      } else {
        alert('Failed to submit report. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report. Please try again.');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 ml-64 min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Emergency Alerts</h1>
        <p className="text-gray-600">Stay informed about climate changes in your area</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Latest Insights Card - Takes 2 columns */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2 border border-gray-200">

          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">AI Emergency Insights</h2>
              <p className="text-sm text-gray-600">Personalized for {insights?.county || 'your area'}</p>
            </div>
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Powered by AI
            </span>
          </div>

          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-600" strokeWidth={2} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                  {insights?.title || 'Loading insights...'}
                </h3>
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {insights?.description ? 
                    (insights.description.length > 120 ? 
                      insights.description.substring(0, 120) + '...' : 
                      insights.description
                    ) : 
                    'Analyzing current environmental conditions in your area...'
                  }
                </p>
                <div className="bg-white rounded-lg p-3 border-l-4 border-green-400 border border-black">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold"> Recommendation:</span> {
                      insights?.recommendation ? 
                        (insights.recommendation.length > 80 ? 
                          insights.recommendation.substring(0, 80) + '...' : 
                          insights.recommendation
                        ) : 
                        'Stay alert and follow safety guidelines'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Active Alerts</p>
              <p className="text-lg font-bold text-red-600">{insights?.activeAlerts || '0'}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Trend</p>
              <p className="text-sm font-semibold text-gray-800 truncate">{insights?.alertTrend || 'Stable'}</p>
            </div>
            <div className="text-center">
              <button 
                onClick={handleViewMoreInsights}
                className="text-xs bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Priority Alerts Card - Takes 1 column */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-600 mb-1">Priority Alerts</h2>
              <p className="text-xs text-gray-500">Urgent alerts</p>
            </div>
            <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
              {insights?.activeAlerts || 0}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            {loading ? (
              <p className="text-center text-gray-500 py-4">Loading alerts...</p>
            ) : priorityAlerts.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No priority alerts at this time</p>
            ) : (
              priorityAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="bg-white p-1 rounded-full shadow-sm">
                    <alert.icon className="w-4 h-4 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-xs">{alert.type}</h3>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      {alert.location}
                    </p>
                  </div>
                </div>
                <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {alert.severity}
                </span>
              </div>
            )))
            }
          </div>

          <button 
            onClick={handleViewAllAlerts}
            className="w-full text-sm text-gray-700 hover:text-gray-900 font-medium underline"
          >
            View All Alerts
          </button>
        </div>
      </div>

      {/* Emergency Reporting Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
              <Bell className="w-6 h-6 text-gray-900" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Emergency Reporting</h2>
              <p className="text-sm text-gray-600">Report urgent climate emergencies requiring immediate action</p>
            </div>
          </div>
          <button 
            onClick={handleReportEmergency}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Report Emergency
          </button>
        </div>
      </div>

      {/* Emergency Contacts Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Emergency contacts</h2>
          <p className="text-sm text-gray-600"> Quick access to local emergency services</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Emergency Service
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full px-4 py-3 bg-green-50 border border-green-100 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="Police">Police</option>
            <option value="Fire">Fire Department</option>
            <option value="Ambulance">Ambulance</option>
            <option value="Hospital">Hospital</option>
          </select>
        </div>

        <div className="space-y-3">
          {emergencyContacts.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No contacts available</p>
          ) : (
            emergencyContacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800 text-sm">{contact.type}</p>
                <p className="text-gray-600 text-sm">{contact.number}</p>
              </div>
              <button 
                onClick={() => handleCall(contact.number)}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors border border-gray-200"
              >
                <span className="text-sm">Call</span>
                <Phone className="w-4 h-4" />
              </button>
            </div>
          )))
          }
        </div>
      </div>

      {/* All Alerts Modal */}
      {showAllAlertsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">All Emergency Alerts</h2>
              <button onClick={() => setShowAllAlertsModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {allAlerts.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No alerts available</p>
              ) : (
                allAlerts.map((alert) => (
                  <div key={alert.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`${alert.color} bg-white p-2 rounded-lg border border-gray-200`}>
                          <alert.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-lg mb-1">{alert.type}</h3>
                          <p className="text-sm text-gray-600 mb-2">{alert.location}</p>
                          {alert.description && (
                            <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                          )}
                          {alert.recommendation && (
                            <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">
                              <span className="font-semibold">Recommendation:</span> {alert.recommendation}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        alert.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                        alert.severity === 'High' ? 'bg-red-100 text-red-700' :
                        alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report Emergency Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Report Emergency</h2>
              <button onClick={() => setShowReportModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitReport} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="reporter_name"
                    value={reportForm.reporter_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="reporter_phone"
                    value={reportForm.reporter_phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="+254 700 000 000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="reporter_email"
                  value={reportForm.reporter_email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Type *</label>
                  <input
                    type="text"
                    name="emergency_type"
                    value={reportForm.emergency_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., Flooding, Fire, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Severity *</label>
                  <select
                    name="severity"
                    value={reportForm.severity}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={reportForm.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., Downtown Nairobi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={reportForm.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Describe the emergency situation in detail..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Submit Report
                </button>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Insights Modal */}
      {showInsightsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-800">Detailed Insights</h2>
              <button 
                onClick={() => setShowInsightsModal(false)} 
                className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-red-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{insights?.title || 'Loading insights...'}</h3>
                  <p className="text-gray-700 mb-4">{insights?.description || 'Fetching latest emergency insights for your area...'}</p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Recommendation:</p>
                    <p className="text-gray-800">{insights?.recommendation || 'Stay alert and follow safety guidelines.'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <p className="text-xs text-gray-600 mb-1">Active Alerts</p>
                    <p className="text-2xl font-bold text-red-700">{insights?.activeAlerts || 0}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-xs text-gray-600 mb-1">Affected Areas</p>
                    <p className="text-xl font-bold text-green-700 break-words">{insights?.affectedAreas || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Alert Trend</p>
                    <p className="text-xl font-bold text-gray-800 break-words">{insights?.alertTrend || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">County</p>
                    <p className="text-lg font-bold text-gray-800 break-words">{insights?.county || 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-green-600" />
                    Safety Tips
                  </h4>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-0.5 font-bold">✓</span>
                      <span>Stay informed through official channels and emergency alerts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-0.5 font-bold">✓</span>
                      <span>Keep emergency contacts readily available</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-0.5 font-bold">✓</span>
                      <span>Follow evacuation orders and safety recommendations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-0.5 font-bold">✓</span>
                      <span>Prepare an emergency kit with essentials</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

