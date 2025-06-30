import React from 'react';
import { BrandsScroll } from '@/components/ui/brands';

const BrandsSection: React.FC = () => {
  // Updated brands array with the requested companies
  const brands = [
    {
      name: "RevenueCat",
      logo: "https://uploads-ssl.webflow.com/5f9f5c2b44cb2fdf738c7c35/5f9f5c2b44cb2f3b248c7c5f_revenuecat-logo.svg",
    },
    {
      name: "Bolt.new",
      logo: "https://bolt.new/favicon.ico",
    },
    {
      name: "ElevenLabs",
      logo: "https://elevenlabs.io/favicon.ico",
    },
    {
      name: "Lingo.dev",
      logo: "", // Will use text fallback
    },
    {
      name: "Dappier",
      logo: "", // Will use text fallback
    },
    {
      name: "DEV++",
      logo: "", // Will use text fallback
    },
    {
      name: "Tavus",
      logo: "https://www.tavus.io/favicon.ico",
    },
    {
      name: "21st.dev",
      logo: "", // Will use text fallback
    },
  ];

  return (
    <BrandsScroll
      title="Trusted and Loved by the World's Leading Tech Companies"
      brands={brands}
      speed={80} // Slow motion - 80 seconds for full cycle
    />
  );
};

export default BrandsSection;