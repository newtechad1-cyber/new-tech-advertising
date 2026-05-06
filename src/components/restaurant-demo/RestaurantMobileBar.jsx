import React from 'react';
import { Phone, MapPin, ShoppingBag, UtensilsCrossed } from 'lucide-react';

export default function RestaurantMobileBar({ config }) {
  const { phone, orderUrl, menuUrl, directionsUrl, primaryColor } = config;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-950 border-t border-slate-800 flex">
      <a href={`tel:${phone}`} className="flex-1 flex flex-col items-center justify-center py-3 gap-1 text-white hover:bg-slate-800 transition-colors">
        <Phone className="w-5 h-5" />
        <span className="text-xs font-bold">Call</span>
      </a>
      <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center justify-center py-3 gap-1 text-white hover:bg-slate-800 transition-colors">
        <MapPin className="w-5 h-5" />
        <span className="text-xs font-bold">Map</span>
      </a>
      <a href={orderUrl} className="flex-1 flex flex-col items-center justify-center py-3 gap-1 text-white transition-colors" style={{ backgroundColor: primaryColor }}>
        <ShoppingBag className="w-5 h-5" />
        <span className="text-xs font-bold">Order</span>
      </a>
      <a href={menuUrl} className="flex-1 flex flex-col items-center justify-center py-3 gap-1 text-white hover:bg-slate-800 transition-colors">
        <UtensilsCrossed className="w-5 h-5" />
        <span className="text-xs font-bold">Menu</span>
      </a>
    </div>
  );
}