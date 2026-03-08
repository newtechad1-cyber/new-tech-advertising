import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2, Plus, Globe, TrendingUp, Zap } from 'lucide-react';
import { toast } from 'sonner';

const SERVICES = [
  { slug: 'streaming-tv-advertising', label: 'Streaming TV Advertising' },
  { slug: 'ada-website-compliance', label: 'ADA Website Compliance' },
  { slug: 'hvac-marketing', label: 'HVAC Marketing' },
  { slug: 'small-business-marketing', label: 'Small Business Marketing' },
  { slug: 'restaurant-marketing', label: 'Restaurant Marketing' },
];

const SEED_CITIES = [
  { city: 'Houston', state: 'Texas', state_code: 'TX' },
  { city: 'Los Angeles', state: 'California', state_code: 'CA' },
  { city: 'Phoenix', state: 'Arizona', state_code: 'AZ' },
  { city: 'San Antonio', state: 'Texas', state_code: 'TX' },
  { city: 'Philadelphia', state: 'Pennsylvania', state_code: 'PA' },
  { city: 'San Diego', state: 'California', state_code: 'CA' },
  { city: 'Jacksonville', state: 'Florida', state_code: 'FL' },
  { city: 'Austin', state: 'Texas', state_code: 'TX' },
  { city: 'Columbus', state: 'Ohio', state_code: 'OH' },
  { city: 'Charlotte', state: 'North Carolina', state_code: 'NC' },
  { city: 'Indianapolis', state: 'Indiana', state_code: 'IN' },
  { city: 'San Francisco', state: 'California', state_code: 'CA' },
  { city: 'Seattle', state: 'Washington', state_code: 'WA' },
  { city: 'Nashville', state: 'Tennessee', state_code: 'TN' },
  { city: 'Baltimore', state: 'Maryland', state_code: 'MD' },
  { city: 'Louisville', state: 'Kentucky', state_code: 'KY' },
  { city: 'Portland', state: 'Oregon', state_code: 'OR' },
  { city: 'Oklahoma City', state: 'Oklahoma', state_code: 'OK' },
  { city: 'Milwaukee', state: 'Wisconsin', state_code: 'WI' },
  { city: 'Las Vegas', state: 'Nevada', state_code: 'NV' },
  { city: 'Memphis', state: 'Tennessee', state_code: 'TN' },
  { city: 'Boston', state: 'Massachusetts', state_code: 'MA' },
  { city: 'El Paso', state: 'Texas', state_code: 'TX' },
  { city: 'Tucson', state: 'Arizona', state_code: 'AZ' },
  { city: 'Fresno', state: 'California', state_code: 'CA' },
  { city: 'Sacramento', state: 'California', state_code: 'CA' },
  { city: 'Mesa', state: 'Arizona', state_code: 'AZ' },
  { city: 'Raleigh', state: 'North Carolina', state_code: 'NC' },
  { city: 'Tampa', state: 'Florida', state_code: 'FL' },
  { city: 'Orlando', state: 'Florida', state_code: 'FL' },
];

export default function CityPageGenerator() {
  const [cityPages, setCityPages] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatingCity, setGeneratingCity] = useState(null);
  const [customCity, setCustomCity] = useState('');
  const [customState, setCustomState] = useState('');
  const [customStateCode, setCustomStateCode] = useState('');
  const [selectedService, setSelectedService] = useState('streaming-tv-advertising');
  const [generatedResults, setGeneratedResults] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const pages = await base44.entities.LocationPage.list('-generated_at', 50);
      setCityPages(pages);
    } finally {
      setLoadingStats(false);
    }
  };

  const generatePage = async (city, state, state_code, service_slug) => {
    setGeneratingCity(`${city} / ${service_slug}`);
    try {
      const res = await base44.functions.invoke('generateCityServicePage', {
        city, state, state_code, service_slug
      });
      const result = res.data;
      if (result.success) {
        const msg = result.already_existed
          ? `${city} / ${service_slug} already exists`
          : `Generated: ${result.url_slug}`;
        toast.success(msg);
        setGeneratedResults(prev => [{ city, service_slug, ...result }, ...prev]);
        await loadStats();
      }
    } catch (err) {
      toast.error(`Failed: ${city} — ${err.message}`);
    } finally {
      setGeneratingCity(null);
    }
  };

  const handleCustomGenerate = async () => {
    if (!customCity || !customState) return;
    await generatePage(customCity.trim(), customState.trim(), customStateCode.trim().toUpperCase(), selectedService);
    setCustomCity('');
    setCustomState('');
    setCustomStateCode('');
  };

  const handleBatchSeed = async () => {
    setGenerating(true);
    for (const cityData of SEED_CITIES.slice(0, 10)) {
      await generatePage(cityData.city, cityData.state, cityData.state_code, selectedService);
    }
    setGenerating(false);
    toast.success('Batch generation complete!');
  };

  // Stats
  const byService = SERVICES.map(s => ({
    ...s,
    count: cityPages.filter(p => p.service_slug === s.slug).length,
  }));
  const totalPages = cityPages.length;
  const trafficEst = totalPages * 200;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold">City SEO Page Generator</h2>
          <p className="text-slate-400 text-sm mt-1">
            Generate /{'{service}'}-in-{'{city}'} landing pages with AI-localized content
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pages Generated', value: totalPages, color: 'text-violet-400', icon: Globe },
          { label: 'Traffic Estimate', value: `${trafficEst.toLocaleString()}/mo`, color: 'text-green-400', icon: TrendingUp },
          { label: 'Services Covered', value: byService.filter(s => s.count > 0).length, color: 'text-blue-400', icon: Zap },
          { label: 'Potential at Scale', value: '3,000+', color: 'text-amber-400', icon: TrendingUp },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <p className="text-slate-400 text-xs">{label}</p>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* By Service Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Pages by Service</h3>
        <div className="space-y-3">
          {byService.map(({ slug, label, count }) => (
            <div key={slug} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-violet-500 rounded-full" />
                <span className="text-slate-300 text-sm">{label}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-violet-500 h-full"
                    style={{ width: `${Math.min((count / 20) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-white text-sm font-semibold w-6 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Single Page Generator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-1">Generate a City Page</h3>
        <p className="text-slate-400 text-sm mb-5">Creates AI-localized content specific to the city + service combination.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <Input
            placeholder="City (e.g. Miami)"
            value={customCity}
            onChange={e => setCustomCity(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
          <Input
            placeholder="State (e.g. Florida)"
            value={customState}
            onChange={e => setCustomState(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
          <Input
            placeholder="Code (e.g. FL)"
            value={customStateCode}
            onChange={e => setCustomStateCode(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
          <select
            value={selectedService}
            onChange={e => setSelectedService(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm"
          >
            {SERVICES.map(s => (
              <option key={s.slug} value={s.slug}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleCustomGenerate}
            disabled={!customCity || !customState || !!generatingCity}
            className="bg-violet-600 hover:bg-violet-500"
          >
            {generatingCity ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><Plus className="w-4 h-4 mr-2" /> Generate Page</>}
          </Button>
          <Button
            onClick={handleBatchSeed}
            disabled={generating || !!generatingCity}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating 10...</> : 'Batch Generate Top 10 Cities'}
          </Button>
        </div>

        {generatingCity && (
          <p className="text-violet-400 text-sm mt-3 flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Generating: {generatingCity}
          </p>
        )}
      </div>

      {/* Quick-generate from seed list */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-1">Seed City Library</h3>
        <p className="text-slate-400 text-sm mb-5">Click any city to generate a page for the selected service.</p>
        <div className="mb-4">
          <select
            value={selectedService}
            onChange={e => setSelectedService(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm"
          >
            {SERVICES.map(s => (
              <option key={s.slug} value={s.slug}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {SEED_CITIES.map(({ city, state, state_code }) => {
            const slug = `${selectedService}-${city.toLowerCase().replace(/\s+/g, '-')}`;
            const exists = cityPages.some(p => p.url_slug === slug);
            return (
              <button
                key={city}
                onClick={() => !exists && !generatingCity && generatePage(city, state, state_code, selectedService)}
                disabled={exists || !!generatingCity}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  exists
                    ? 'bg-emerald-900/40 border border-emerald-700/50 text-emerald-400 cursor-default'
                    : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-violet-500 hover:text-violet-400 cursor-pointer'
                }`}
              >
                {exists && <CheckCircle className="w-3 h-3" />}
                {city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Generated */}
      {generatedResults.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Recently Generated</h3>
          <div className="space-y-2">
            {generatedResults.slice(0, 10).map((r, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">/{r.url_slug}</span>
                <Badge className={r.already_existed ? 'bg-slate-700 text-slate-400' : 'bg-emerald-900/50 text-emerald-400 border-emerald-700/40'}>
                  {r.already_existed ? 'existed' : 'created'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}