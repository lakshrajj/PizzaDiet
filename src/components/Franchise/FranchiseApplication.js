import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FranchiseApplication = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    businessName: '',
    businessAddress: '',
    ownsFranchise: '',
    franchiseDetails: '',
    locationInterest: '',
    whyFranchise: '',
    industryExperience: '',
    industryDetails: '',
    investmentAmount: '',
    canMeetInvestment: '',
    businessExperience: '',
    businessDetails: '',
    consentInfo: false,
    consentProcessing: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.locationInterest.trim()) newErrors.locationInterest = 'Location interest is required';
    if (!formData.whyFranchise.trim()) newErrors.whyFranchise = 'Please explain why you want to open this franchise';
    if (!formData.investmentAmount.trim()) newErrors.investmentAmount = 'Investment amount is required';
    if (!formData.consentInfo) newErrors.consentInfo = 'You must confirm the information is correct';
    if (!formData.consentProcessing) newErrors.consentProcessing = 'You must consent to processing your information';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:3001/api/franchise/apply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          console.log('Franchise application submitted successfully:', result.applicationId);
          setIsSubmitted(true);
        } else {
          console.error('Error submitting application:', result.message);
          alert('Error submitting application: ' + result.message);
        }
      } catch (error) {
        console.error('Network error:', error);
        alert('Network error. Please check your connection and try again.');
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-dark-primary dark:via-dark-secondary dark:to-dark-primary py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white dark:bg-dark-secondary rounded-2xl shadow-2xl p-8 border border-orange-100 dark:border-purple-500/30">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-4">
              Application Submitted!
            </h1>
            <p className="text-gray-600 dark:text-dark-text/80 mb-8">
              Thank you for your interest in joining our franchise family. We've received your application and will review it carefully. Our team will contact you within 3-5 business days to discuss the next steps.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-dark-primary dark:via-dark-secondary dark:to-dark-primary py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-dark-secondary rounded-2xl shadow-2xl border border-orange-100 dark:border-purple-500/30 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-8 text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Franchise Application Form</h1>
            <p className="text-orange-100 max-w-2xl mx-auto">
              Thank you for your interest in becoming a part of our franchise family! Please fill out the form below to begin your application process. We look forward to reviewing your submission and partnering with you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Personal Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-6 border-b-2 border-orange-200 dark:border-purple-500/30 pb-2">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 dark:bg-dark-primary dark:border-purple-500/30 dark:text-dark-text ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 dark:bg-dark-primary dark:border-purple-500/30 dark:text-dark-text ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 dark:bg-dark-primary dark:border-purple-500/30 dark:text-dark-text ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                    City/State/ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 dark:bg-dark-primary dark:border-purple-500/30 dark:text-dark-text ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your city, state, and ZIP code"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Business Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-6 border-b-2 border-orange-200 dark:border-purple-500/30 pb-2">
                Business Information (If Applicable)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                    Business Name (if you already own a business)
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 dark:bg-dark-primary dark:border-purple-500/30 dark:text-dark-text"
                    placeholder="Enter your business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                    Business Address
                  </label>
                  <input
                    type="text"
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 dark:bg-dark-primary dark:border-purple-500/30 dark:text-dark-text"
                    placeholder="Enter your business address"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-3">
                  Do you currently own any other franchises?
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="ownsFranchise"
                      value="yes"
                      checked={formData.ownsFranchise === 'yes'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700 dark:text-dark-text">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="ownsFranchise"
                      value="no"
                      checked={formData.ownsFranchise === 'no'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700 dark:text-dark-text">No</span>
                  </label>
                </div>
              </div>

              {formData.ownsFranchise === 'yes' && (
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                    If yes, please provide details (Name of Franchise, Location, Years in Business)
                  </label>
                  <textarea
                    name="franchiseDetails"
                    value={formData.franchiseDetails}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 dark:bg-dark-primary dark:border-purple-500/30 dark:text-dark-text"
                    placeholder="Provide details about your current franchises"
                  />
                </div>
              )}
            </section>

            {/* Franchise Interest */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-6 border-b-2 border-orange-200 dark:border-purple-500/30 pb-2">
                Franchise Interest
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                    Which franchise location are you interested in? *
                  </label>
                  <input
                    type="text"
                    name="locationInterest"
                    value={formData.locationInterest}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 dark:bg-dark-primary dark:border-purple-500/30 dark:text-dark-text ${errors.locationInterest ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your preferred location"
                  />
                  {errors.locationInterest && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.locationInterest}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                    Why do you want to open this franchise? *
                  </label>
                  <textarea
                    name="whyFranchise"
                    value={formData.whyFranchise}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 dark:bg-dark-primary dark:border-purple-500/30 dark:text-dark-text ${errors.whyFranchise ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Explain your motivation for opening this franchise"
                  />
                  {errors.whyFranchise && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.whyFranchise}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-3">
                    Have you previously been involved in the restaurant/retail industry or in any other franchises?
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="industryExperience"
                        value="yes"
                        checked={formData.industryExperience === 'yes'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-3 text-gray-700 dark:text-dark-text">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="industryExperience"
                        value="no"
                        checked={formData.industryExperience === 'no'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-3 text-gray-700 dark:text-dark-text">No</span>
                    </label>
                  </div>
                </div>

                {formData.industryExperience === 'yes' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                      If yes, please provide details
                    </label>
                    <textarea
                      name="industryDetails"
                      value={formData.industryDetails}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 dark:bg-dark-primary dark:border-purple-500/30 dark:text-dark-text"
                      placeholder="Provide details about your industry experience"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Financial Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-6 border-b-2 border-orange-200 dark:border-purple-500/30 pb-2">
                Financial Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                    Estimated Investment Amount Available for the Franchise *
                  </label>
                  <input
                    type="text"
                    name="investmentAmount"
                    value={formData.investmentAmount}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 dark:bg-dark-primary dark:border-purple-500/30 dark:text-dark-text ${errors.investmentAmount ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your estimated investment amount"
                  />
                  {errors.investmentAmount && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.investmentAmount}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-3">
                    Are you able to meet the required franchise investment?
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="canMeetInvestment"
                        value="yes"
                        checked={formData.canMeetInvestment === 'yes'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-3 text-gray-700 dark:text-dark-text">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="canMeetInvestment"
                        value="no"
                        checked={formData.canMeetInvestment === 'no'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-3 text-gray-700 dark:text-dark-text">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-3">
                    Do you have experience in managing or owning a business?
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="businessExperience"
                        value="yes"
                        checked={formData.businessExperience === 'yes'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-3 text-gray-700 dark:text-dark-text">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="businessExperience"
                        value="no"
                        checked={formData.businessExperience === 'no'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-3 text-gray-700 dark:text-dark-text">No</span>
                    </label>
                  </div>
                </div>

                {formData.businessExperience === 'yes' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                      If yes, please provide details (business type, management experience, etc.)
                    </label>
                    <textarea
                      name="businessDetails"
                      value={formData.businessDetails}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 dark:bg-dark-primary dark:border-purple-500/30 dark:text-dark-text"
                      placeholder="Provide details about your business experience"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Consent & Acknowledgement */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-6 border-b-2 border-orange-200 dark:border-purple-500/30 pb-2">
                Consent & Acknowledgement
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="consentInfo"
                      checked={formData.consentInfo}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-1"
                    />
                    <span className="ml-3 text-gray-700 dark:text-dark-text">
                      I confirm that the information provided in this application is true and correct to the best of my knowledge.
                    </span>
                  </label>
                  {errors.consentInfo && (
                    <p className="text-red-500 text-sm mt-1 ml-8 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.consentInfo}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="consentProcessing"
                      checked={formData.consentProcessing}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-1"
                    />
                    <span className="ml-3 text-gray-700 dark:text-dark-text">
                      I consent to the processing of my personal information for the purpose of evaluating my franchise application.
                    </span>
                  </label>
                  {errors.consentProcessing && (
                    <p className="text-red-500 text-sm mt-1 ml-8 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.consentProcessing}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <button
                type="submit"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
              >
                <Send className="w-6 h-6 mr-3" />
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FranchiseApplication;