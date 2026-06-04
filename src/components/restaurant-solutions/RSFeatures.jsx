import React from 'react';
import { Check } from 'lucide-react';

function CheckItem({ text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 rounded-full bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Check className="w-3.5 h-3.5 text-[#F59E0B]" />
      </div>
      <span className="text-slate-300 text-lg">{text}</span>
    </div>
  );
}

export default function RSFeatures() {
  return (
    <section id="features" className="bg-[#0B1120] py-24 px-6 border-t border-slate-800">
      <div className="max-w-6xl mx-auto space-y-32">
        
        {/* Feature 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] font-bold text-xl mb-6">
              1
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
              Online Ordering — Without the Middleman
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Your own ordering page on your own website. Customers order directly from you. No commissions, no third-party branding, no sharing your customers with competitors.
            </p>
            <div className="space-y-4">
              <CheckItem text="Zero commission fees — every dollar is yours" />
              <CheckItem text="Branded ordering page that matches your restaurant" />
              <CheckItem text="Order notifications straight to your kitchen" />
            </div>
          </div>
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-2 bg-[#10B981] text-white font-bold rounded-bl-2xl shadow-lg flex items-center gap-2">
              🛒 $47.50 (3)
            </div>
            <div className="flex gap-4 mb-6 border-b border-slate-800 pb-4 text-sm font-medium text-slate-400">
              <span className="text-[#F59E0B] border-b-2 border-[#F59E0B] pb-4 -mb-[17px]">Entrees</span>
              <span>Appetizers</span>
              <span>Drinks</span>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Classic Smash Burger', desc: 'Double patty, house sauce, pickles, cheese', price: '$14.00' },
                { name: 'Spicy Chicken Sandwich', desc: 'Crispy fried chicken, spicy slaw, brioche bun', price: '$13.50' },
              ].map(item => (
                <div key={item.name} className="flex justify-between items-start p-4 rounded-xl border border-slate-800 bg-slate-950/50">
                  <div className="pr-4">
                    <div className="text-white font-bold mb-1">{item.name}</div>
                    <div className="text-slate-500 text-sm mb-2 leading-snug">{item.desc}</div>
                    <div className="text-slate-300 font-medium">{item.price}</div>
                  </div>
                  <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors flex-shrink-0">
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg">Menu Items</h3>
              <button className="bg-[#F59E0B]/10 text-[#F59E0B] px-3 py-1.5 rounded-lg text-sm font-bold border border-[#F59E0B]/20">
                + Add Item
              </button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Classic Smash Burger', price: '$14.00', active: true },
                { name: 'Truffle Fries', price: '$6.50', active: true },
                { name: 'Seasonal Milkshake', price: '$5.00', active: false },
              ].map(item => (
                <div key={item.name} className="flex items-center justify-between p-4 border border-slate-800 rounded-lg bg-slate-950/50">
                  <div>
                    <div className="text-white text-sm font-medium mb-1">{item.name}</div>
                    <div className="text-slate-500 text-sm">{item.price}</div>
                  </div>
                  <div className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${item.active ? 'bg-[#10B981]' : 'bg-slate-700'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${item.active ? 'translate-x-5' : ''}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] font-bold text-xl mb-6">
              2
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
              Menu Management That Actually Works
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Update your menu in seconds. Add daily specials, mark items as sold out, change prices — all from your phone. No calling your web guy.
            </p>
            <div className="space-y-4">
              <CheckItem text="Edit menu items, prices, and photos instantly" />
              <CheckItem text="Daily specials and limited-time offers" />
              <CheckItem text="86'd items disappear from ordering automatically" />
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] font-bold text-xl mb-6">
              3
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
              Get Found When Locals Are Hungry
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              We make sure your restaurant shows up when someone asks AI 'where should I eat in Mason City' or searches Google for food near them. Plus, we help you manage and respond to reviews.
            </p>
            <div className="space-y-4">
              <CheckItem text="AI search optimization — show up in ChatGPT, Siri, Google AI" />
              <CheckItem text="Google Business Profile management" />
              <CheckItem text="Review monitoring and smart response templates" />
            </div>
          </div>
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl flex flex-col gap-4">
            {/* Google Mock */}
            <div className="bg-white rounded-xl p-5">
              <div className="text-[#1a0dab] text-xl font-normal mb-1">Best Local Burger Joint</div>
              <div className="flex items-center gap-1 text-sm text-slate-600 mb-3">
                <span className="text-[#f9ab00] text-base">★</span> 4.7 <span className="text-slate-400">(127 reviews)</span> · Burgers · $$
              </div>
              <div className="text-sm text-slate-600 mb-4">Open ⋅ Closes 10 PM</div>
              <div className="bg-[#1a73e8] text-white px-5 py-2.5 rounded-full text-sm font-medium w-max">
                Order Online
              </div>
            </div>
            {/* AI Mock */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  AI
                </div>
                <div className="text-sm text-slate-300 leading-relaxed mt-1">
                  For the best burgers in town, you should definitely check out <strong className="text-white">Local Burger Joint</strong>. They have fantastic reviews (4.7 stars) and offer convenient online ordering directly through their website...
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}