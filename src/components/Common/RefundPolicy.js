import React from 'react';
import { Phone, Mail, Home } from 'lucide-react';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/30 dark:via-red-950/30 dark:to-pink-950/30 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-10 shadow-xl border border-white/50 dark:border-gray-700/50">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
            🍕 Refund Policy – PIZZA DIET 🍕
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            At <span className="font-semibold">Pizza Diet</span>, your satisfaction is our top priority. We take pride in delivering delicious, high-quality food with every order. If something isn't right, we're here to make it right—within reason and in a timely manner.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">1. Eligibility for Refunds</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Refunds will be considered in the following situations:</p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
              <li>You received the wrong item(s).</li>
              <li>Items are missing from your order.</li>
              <li>Food is spoiled or inedible upon delivery.</li>
              <li>There is a significant issue caused by a restaurant error.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">2. Important Conditions</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">To be eligible for a refund:</p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
              <li>You <span className="font-semibold">must contact us within 1 hour</span> of receiving your order.</li>
              <li>The <span className="font-semibold">food must not be consumed</span>.</li>
              <li>The <span className="font-semibold">entire order must be returned</span> to the delivery rider who will be sent to pick it up.</li>
              <li>Refunds will not be processed if the food is partially or fully consumed.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">3. Non-Refundable Situations</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Refunds will not be issued for:</p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Change of mind or taste preferences.</li>
              <li>Delay caused by third-party delivery partners.</li>
              <li>Incorrect address or contact details provided by the customer.</li>
              <li>Orders not picked up or received on time due to customer absence.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">4. How to Request a Refund</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Please contact us immediately (within 1 hour of delivery) and provide the following:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-6">
              <li>Your full name and phone number.</li>
              <li>Order date and time.</li>
              <li>Description of the issue.</li>
              <li>Photo evidence (if applicable).</li>
            </ul>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="text-orange-500 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Call us at:</span> 7840073405 / 9318310517
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-orange-500 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Email us at:</span>{' '}
                  <a href="mailto:pizzadiet65@gmail.com" className="text-orange-500 hover:text-orange-600">
                    pizzadiet65@gmail.com
                  </a>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Home className="text-orange-500 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Visit us at:</span> Pizza Diet, C2/166, Yamuna Vihar, Delhi (Main Branch)
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">5. Refund Processing</h2>
            <p className="text-gray-600 dark:text-gray-300">
              If your request is approved, the refund will be issued to the original method of payment. Refunds may take <span className="font-semibold">2–3 business days</span> to reflect, depending on your payment provider.
            </p>
          </section>

          <div className="text-center text-gray-600 dark:text-gray-300 pt-6 border-t border-gray-200 dark:border-gray-700">
            Thank you for choosing <span className="font-semibold">Pizza Diet</span>. We value your trust and look forward to serving you again!
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy; 