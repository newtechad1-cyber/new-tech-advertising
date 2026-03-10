import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PublicShell from '@/components/school-tv/PublicShell';
import { Search } from 'lucide-react';

export default function SchoolStories() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('school') || 'hampton-dumont';
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [storiesData, categoriesData] = await Promise.all([
          base44.entities.Stories.filter({ school_slug: schoolSlug, status: 'published', visibility: 'public' }),
          base44.entities.StoryCategories.filter({ school_slug: schoolSlug, active: true }),
        ]);
        setStories(storiesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading stories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  const filteredStories = stories.filter(story => {
    const matchCategory = selectedCategory === 'all' || (story.category_ids && JSON.parse(story.category_ids || '[]').includes(selectedCategory));
    const matchSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       story.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) return <PublicShell currentPath="stories"><div className="text-center py-12">Loading...</div></PublicShell>;

  return (
    <PublicShell currentPath="stories">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Stories</h1>
          <p className="text-slate-200">Discover the stories that matter to our community</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full font-semibold ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full font-semibold ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stories Grid */}
        {filteredStories.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredStories.map((story) => (
              <Link
                key={story.id}
                to={`/schools/${schoolSlug}/stories/${story.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {story.featured_image_url && (
                  <img src={story.featured_image_url} alt={story.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{story.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{story.excerpt || story.body?.substring(0, 150)}</p>
                  <span className="text-blue-600 font-semibold hover:underline">Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No stories found matching your criteria.</p>
          </div>
        )}
      </div>
    </PublicShell>
  );
}