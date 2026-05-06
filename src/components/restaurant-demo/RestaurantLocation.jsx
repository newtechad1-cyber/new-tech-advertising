import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';

export default function RestaurantLocation({ config }) {
  const { name, address, phone, hours, directionsUrl, primaryColor } = config;

  return (
    <section className="py-16 px-6 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>Find Us</p>
          <h2 className="text-3xl font-black text-white mb-6">Hours & Location</h2>

          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${primaryColor}25` }}>
                <MapPin className="w-5 h-5" style={{ color: primaryColor }} />
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase font-bold mb-1">Address</p>
                <p className="text-white font-semibold">{address}</p>
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold mt-1 inline-block" style={{ color: primaryColor }}>
                  Get Directions →
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${primaryColor}25` }}>
                <Phone className="w-5 h-5" style={{ color: primaryColor }} />
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase font-bold mb-1">Phone</p>
                <a href={`tel:${phone}`} className="text-white font-semibold hover:underline">{phone}</a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${primaryColor}25` }}>
                <Clock className="w-5 h-5" style={{ color: primaryColor }} />
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase font-bold mb-1">Hours</p>
                <p className="text-white font-semibold">{hours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 aspect-square flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-semibold text-sm">{name}</p>
            <p className="text-slate-500 text-xs mt-1">{address}</p>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-sm font-bold px-4 py-2 rounded-lg text-white transition-colors" style={{ backgroundColor: primaryColor }}>
              Open in Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}