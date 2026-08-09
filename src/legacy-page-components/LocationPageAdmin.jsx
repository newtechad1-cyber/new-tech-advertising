import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const SERVICES = [
  { slug: 'ada-website-compliance', name: 'ADA Website Compliance' },
  { slug: 'streaming-tv-advertising', name: 'Streaming TV Advertising' },
];

const TOP_CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
  'Fort Worth', 'Columbus', 'Indianapolis', 'Charlotte', 'Seattle', 'Denver',
  'Washington', 'Boston', 'El Paso', 'Nashville', 'Detroit', 'Oklahoma City',
  'Portland', 'Las Vegas', 'Memphis', 'Louisville', 'Baltimore', 'Milwaukee',
  'Albuquerque', 'Tucson', 'Fresno', 'Mesa', 'Sacramento', 'Atlanta',
  'Kansas City', 'Long Beach', 'Miami', 'Cleveland', 'Minneapolis', 'Tulsa',
];

export default function LocationPageAdmin() {
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCities, setSelectedCities] = useState(TOP_CITIES.slice(0, 10));
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState(null);
  const [pageCount, setPageCount] = useState(0);

  const handleServiceToggle = (slug) => {
    setSelectedServices((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleCityToggle = (city) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const handleSelectAllCities = () => {
    if (selectedCities.length === TOP_CITIES.length) {
      setSelectedCities([]);
    } else {
      setSelectedCities(TOP_CITIES);
    }
  };

  const generatePages = async () => {
    if (selectedServices.length === 0 || selectedCities.length === 0) {
      alert('Please select at least one service and one city');
      return;
    }

    setIsGenerating(true);
    setResults(null);

    try {
      const response = await base44.functions.invoke('batchGenerateLocationPages', {
        services: selectedServices,
        cities: selectedCities.map((city) => ({
          city,
          state: 'Auto',
          state_code: 'XX',
        })),
        limit: selectedServices.length * selectedCities.length,
      });

      setResults(response.data);
      setPageCount(response.data.pages_generated);
    } catch (err) {
      alert('Error generating pages: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const loadPageStats = async () => {
    try {
      const pages = await base44.entities.LocationPage.list();
      setPageCount(pages.length);
    } catch (err) {
      console.error('Error loading page count:', err);
    }
  };

  useEffect(() => {
    loadPageStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Location Page Generator</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Pages Generated</p>
            <p className="text-3xl font-bold text-violet-400">{pageCount}</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Services</p>
            <p className="text-3xl font-bold text-blue-400">{SERVICES.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Max Potential</p>
            <p className="text-3xl font-bold text-green-400">{SERVICES.length * TOP_CITIES.length}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Configuration */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-8 space-y-8">
              {/* Services */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Select Services</h2>
                <div className="space-y-3">
                  {SERVICES.map((service) => (
                    <label
                      key={service.slug}
                      className="flex items-center gap-3 p-4 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer hover:border-slate-600 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.slug)}
                        onChange={() => handleServiceToggle(service.slug)}
                        className="w-4 h-4 rounded border-slate-600 text-violet-600"
                      />
                      <span className="text-white font-semibold flex-1">{service.name}</span>
                      <span className="text-slate-400 text-sm">
                        {selectedCities.length} cities
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cities */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Select Cities</h2>
                  <button
                    onClick={handleSelectAllCities}
                    className="text-sm text-violet-400 hover:text-violet-300 font-semibold"
                  >
                    {selectedCities.length === TOP_CITIES.length ? 'Clear All' : 'Select All'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {TOP_CITIES.map((city) => (
                    <label key={city} className="flex items-center gap-2 p-3 bg-slate-800 rounded cursor-pointer hover:bg-slate-700 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedCities.includes(city)}
                        onChange={() => handleCityToggle(city)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-slate-300 text-sm">{city}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={generatePages}
                disabled={isGenerating || selectedServices.length === 0 || selectedCities.length === 0}
                className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating Pages...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    Generate {selectedServices.length * selectedCities.length} Pages
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Results */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-8">
            <h2 className="text-xl font-bold text-white mb-6">Generation Summary</h2>

            {results ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-800 rounded-lg border-l-4 border-green-500">
                  <p className="text-slate-400 text-sm">Success</p>
                  <p className="text-2xl font-bold text-green-400">{results.pages_generated}</p>
                </div>
                <div className="p-4 bg-slate-800 rounded-lg border-l-4 border-rose-500">
                  <p className="text-slate-400 text-sm">Failed</p>
                  <p className="text-2xl font-bold text-rose-400">{results.pages_failed}</p>
                </div>

                {results.results && (
                  <div className="mt-6 max-h-64 overflow-y-auto space-y-2">
                    {results.results.map((r, i) => (
                      <div key={i} className="p-3 bg-slate-800 rounded text-sm">
                        <div className="flex items-start gap-2">
                          {r.status === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="text-slate-300">
                              {r.service_slug} in {r.city}
                            </p>
                            {r.status === 'error' && (
                              <p className="text-rose-400 text-xs mt-1">{r.error}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 text-center">
                <TrendingUp className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-slate-400">
                  Select services and cities to generate location pages.
                </p>
                <p className="text-slate-500 text-sm">
                  Each page targets local SEO for service + location combinations.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-12 bg-slate-900 border border-slate-700 rounded-lg p-8">
          <h3 className="text-lg font-bold text-white mb-4">How It Works</h3>
          <div className="grid sm:grid-cols-3 gap-6 text-sm text-slate-300">
            <div>
              <p className="font-semibold text-white mb-2">1. Select Services</p>
              <p>Choose which services (ADA, Streaming TV, etc.) to create location pages for.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">2. Select Cities</p>
              <p>Pick which cities to target. More cities = more pages and more SEO traffic.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">3. Generate Pages</p>
              <p>System creates optimized pages for each service + city combination automatically.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}