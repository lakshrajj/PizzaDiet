import React from 'react';
import { Clock, Phone, MessageCircle } from 'lucide-react';
import OutletLocations from './OutletLocations';

const ContactSection = () => {
  const contactInfo = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Opening Hours',
      info: 'Mon - Sun: 10:00 AM - 11:00 PM\nAlways fresh, always open!',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: 'Call Us',
      info: 'Babarpur: +91-7840072457\nYamuna Vihar: +91-7840073401\nBrahmpuri: +91-7840085713\nDayalpur: +91-7840076501',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-white to-orange-50 dark:from-dark-primary dark:to-dark-accent/10 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            We're here to serve you the best pizza experience. Reach out to us anytime!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {contactInfo.map((item, index) => (
            <div key={index} className="group text-center p-10 rounded-3xl bg-white/80 dark:bg-dark-secondary/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/50 dark:border-dark-accent/50">
              <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-r ${item.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed text-lg">{item.info}</p>
            </div>
          ))}
        </div>

        {/* Outlet Locations */}
        <OutletLocations />

        {/* Contact Form Section */}
        <div className="mt-16 bg-white dark:bg-dark-secondary rounded-3xl p-10 shadow-xl border border-gray-100 dark:border-dark-accent">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Send Us a Message</h3>
            <p className="text-gray-600 dark:text-gray-300">Have a question or special request? We'd love to hear from you!</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <input
                type="text"
                placeholder="Your Name"
                className="input-field"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="input-field"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className="input-field mb-6"
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="input-field mb-6 resize-none"
            ></textarea>
            
            <div className="text-center">
              <button
                onClick={() => {
                  // In a real app, this would handle form submission
                  // For now, we'll redirect to WhatsApp
                  const message = "Hi! I'd like to get in touch with Pizza Diet.";
                  const whatsappURL = `https://wa.me/919318310517?text=${encodeURIComponent(message)}`;
                  window.open(whatsappURL, '_blank');
                }}
                className="btn-primary"
              >
                <MessageCircle size={20} />
                Send via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;