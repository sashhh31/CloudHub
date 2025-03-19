
import React from 'react';

const BrandsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
            Loved By Designers At
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              name: "Crowdstrike",
              logo: "https://logos-world.net/wp-content/uploads/2021/03/CrowdStrike-Logo.png",
              delay: "0s"
            },
            {
              name: "Airbus",
              logo: "https://logos-world.net/wp-content/uploads/2020/12/Airbus-Logo.png",
              delay: "0.1s"
            },
            {
              name: "Hays",
              logo: "https://logos-world.net/wp-content/uploads/2021/08/Hays-Logo.png",
              delay: "0.2s"
            },
            {
              name: "Sentry",
              logo: "https://avatars.githubusercontent.com/u/1396951",
              delay: "0.3s"
            },
            {
              name: "Medwing",
              logo: "https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/256x256/3c82c8aa45d0b9b6d3a98aafbc55b40c",
              delay: "0.4s"
            },
            {
              name: "Cathay Pacific",
              logo: "https://logos-world.net/wp-content/uploads/2020/03/Cathay-Pacific-Logo-700x394.png",
              delay: "0.5s"
            },
            {
              name: "Liquid Web",
              logo: "https://www.liquidweb.com/wp-content/uploads/2018/08/LW_square_logo.svg",
              delay: "0.6s"
            },
            {
              name: "AutoTrader",
              logo: "https://logos-world.net/wp-content/uploads/2021/02/Auto-Trader-Logo.png",
              delay: "0.7s"
            }
          ].map((brand, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-6 flex items-center justify-center h-32 shadow-sm hover:shadow-md transition-shadow duration-300"
              style={{
                animation: 'fade-in-up 0.5s ease-out forwards',
                animationDelay: brand.delay,
                opacity: 0
              }}
            >
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="max-h-12 max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
