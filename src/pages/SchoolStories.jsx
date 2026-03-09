import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function SchoolStories() {
  const { schoolSlug } = useParams();
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [storiesData, catsData] = await Promise.all([
          base44.entities.Stories.filter({
            school_slug: schoolSlug,
            publish_status: 'published',
            visibility: { $in: ['public', 'staff'] },
          }),
          base44.entities.StoryCategories.filter({ school_slug: schoolSlug, active: true }),
        ]);
        setStories(storiesData);
        setCategories(catsData);
      } catch (error) {
        console.error('Error loading stories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  const filtered = selectedCategory
    ? stories.filter((s) => JSON.parse(s.categories || '[]').includes(selectedCategory))
    : stories;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Stories</h1>
          <p className="text-lg text-gray-700">Discover what's happening at our school</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-3 flex-wrap">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
          >
            All Stories
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No stories found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((story) => (
              <article key={story.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
                {story.featured_image && (
                  <img src={story.featured_image} alt={story.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{story.title}</h3>
                  <p className="text-gray-700 mb-4 line-clamp-2">{story.excerpt || story.body}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {new Date(story.published_date).toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      Read <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}