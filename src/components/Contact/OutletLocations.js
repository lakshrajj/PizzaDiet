import React from 'react';
import { MapPin, Phone } from 'lucide-react';

const outlets = [
  {
    name: 'BABARPUR BRANCH',
    address: 'W-117, MAIN ROAD BABARPUR, SHAHDARA, DELHI-110032',
    mapLink: 'https://maps.app.goo.gl/sD9Bcx5uLD63HCnG6',
    phones: [
      '+91-7840073405'
    ]
  },
  {
    name: 'YAMUNA VIHAR BRANCH',
    address: 'C-2/166, BLOCK C, YAMUNAVIHAR, SHAHDARA, DELHI-110053',
    mapLink: 'https://maps.app.goo.gl/DszHuHZSMcxSooTv6',
    phones: [
      '+91-9318310517'
    ]
  },
  {
    name: 'BRAHMPURI BRANCH',
    address: 'B-217,BRAHAMPURI RD, CHAUHAN BANGER,SHAHDARA, DELHI-110053',
    mapLink: 'https://maps.app.goo.gl/UL1utyBCpREF4CjM9',
    phones: [
      '+91-7840073405'
    ]
  },
  {
    name: 'DAYALPUR BRANCH',
    address: 'F-11, KARAWAL NAGAR MAIN RD, BLOCK-D, DAYALPUR, KARAWAL NAGAR, DELHI-110094',
    mapLink: 'https://maps.app.goo.gl/zSo17o7Jjp7NSwhM9',
    phones: [
      '+91-9318310517'
    ]
  }
];

const OutletLocations = () => {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/30 dark:via-red-950/30 dark:to-pink-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="section-title">Our Outlets</h2>
          <p className="section-subtitle dark:text-gray-300">
            Find the Pizza Diet branch nearest to you
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
          {outlets.map((outlet, index) => (
            <div 
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 dark:border-gray-700/50"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <a 
                    href={outlet.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer"
                  >
                    <MapPin size={20} />
                  </a>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {outlet.name}
                  </h3>
                  <a 
                    href={outlet.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-300 mb-4 block hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                  >
                    {outlet.address}
                  </a>
                  <div className="space-y-2">
                    {outlet.phones.map((phone, phoneIndex) => (
                      <a
                        key={phoneIndex}
                        href={`tel:${phone}`}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                      >
                        <Phone size={16} />
                        <span>{phone}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutletLocations; 