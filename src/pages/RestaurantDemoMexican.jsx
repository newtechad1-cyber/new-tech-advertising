import React, { useEffect } from 'react';
import { MEXICAN_CONFIG } from '../components/restaurant-demo/RestaurantConfig';
import RestaurantNav from '../components/restaurant-demo/RestaurantNav';
import RestaurantHero from '../components/restaurant-demo/RestaurantHero';
import RestaurantFeaturedDishes from '../components/restaurant-demo/RestaurantFeaturedDishes';
import RestaurantSpecials from '../components/restaurant-demo/RestaurantSpecials';
import RestaurantReviews from '../components/restaurant-demo/RestaurantReviews';
import RestaurantMenu from '../components/restaurant-demo/RestaurantMenu';
import RestaurantAbout from '../components/restaurant-demo/RestaurantAbout';
import RestaurantSocial from '../components/restaurant-demo/RestaurantSocial';
import RestaurantLocation from '../components/restaurant-demo/RestaurantLocation';
import RestaurantMobileBar from '../components/restaurant-demo/RestaurantMobileBar';
import RestaurantNTASection from '../components/restaurant-demo/RestaurantNTASection';

const config = MEXICAN_CONFIG;

export default function RestaurantDemoMexican() {
  useEffect(() => {
    document.title = `${config.name} | ${config.city}, ${config.state}`;
    const schema = {
      "@context": "https://schema.org",
      "@type": config.schemaType,
      "name": config.name,
      "address": { "@type": "PostalAddress", "streetAddress": config.address, "addressLocality": config.city, "addressRegion": config.state },
      "telephone": config.phone,
      "servesCuisine": config.cuisine,
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": config.rating, "reviewCount": config.reviewCount },
    };
    let tag = document.getElementById('restaurant-schema');
    if (!tag) { tag = document.createElement('script'); tag.id = 'restaurant-schema'; tag.type = 'application/ld+json'; document.head.appendChild(tag); }
    tag.textContent = JSON.stringify(schema);
  }, []);

  return (
    <div className="bg-white min-h-screen pb-16 md:pb-0">
      <RestaurantNav config={config} />
      <RestaurantHero config={config} />
      <RestaurantFeaturedDishes config={config} />
      <RestaurantSpecials config={config} />
      <RestaurantReviews config={config} />
      <RestaurantMenu config={config} />
      <RestaurantAbout config={config} />
      <RestaurantSocial config={config} />
      <RestaurantLocation config={config} />
      <RestaurantNTASection config={config} />
      <RestaurantMobileBar config={config} />
    </div>
  );
}