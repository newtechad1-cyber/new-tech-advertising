import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import PublicShell from '@/components/school-tv/PublicShell';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function SchoolStoryDetail() {
  const { storySlug } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const schoolSlug = searchParams.get('school') || 'hampton-dumont';
  const [story, setStory] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [mediaLinks, setMediaLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storiesData = await base44.entities.Stories.filter({
          school_slug: schoolSlug,
          slug: storySlug,
        });
        
        if (storiesData.length > 0) {
          const currentStory = storiesData[0];
          setStory(currentStory);
          
          const [authorsData, mediaData] = await Promise.all([
            base44.entities.StoryAuthors.filter({ school_slug: schoolSlug, story_id: currentStory.id }),
            base44.entities.StoryMediaLinks.filter({ school_slug: schoolSlug, story_id: currentStory.id }),
          ]);
          
          setAuthors(authorsData);
          setMediaLinks(mediaData.sort((a, b) => (a.order || 0) - (b.order || 0)));
        }
      } catch (error) {
        console.error('Error loading story:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug, storySlug]);

  if (loading) return <PublicShell currentPath="stories"><div className="text-center py-12">Loading...</div></PublicShell>;
  if (!story) return <PublicShell currentPath="stories"><div className="text-center py-12">Story not found</div></PublicShell>;

  return (
    <PublicShell currentPath="stories">
      <div className="bg-white">
        {/* Hero */}
        {story.featured_image_url && (
          <div className="w-full h-96 overflow-hidden">
            <img src={story.featured_image_url} alt={story.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
        <article className="max-w-3xl mx-auto px-6 py-12">
          <a href={`${createPageUrl('SchoolStories')}?school=${schoolSlug}`} className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2">
             <ArrowLeft className="h-4 w-4" /> Back to Stories
           </a>

          <h1 className="text-4xl font-bold mb-4">{story.title}</h1>

          <div className="flex gap-6 mb-8 text-gray-600 text-sm">
            {story.updated_date && (
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(story.updated_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
            {authors.length > 0 && (
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                By {authors.map(a => a.author_name).join(', ')}
              </span>
            )}
          </div>

          {story.excerpt && (
            <p className="text-xl text-gray-700 mb-8 font-semibold">{story.excerpt}</p>
          )}

          {/* Media */}
          {mediaLinks.length > 0 && (
            <div className="my-12 space-y-8">
              {mediaLinks.map((media) => (
                <div key={media.id}>
                  {media.media_type === 'image' && (
                    <img src={media.media_url} alt={media.caption} className="w-full rounded-lg shadow-md mb-2" />
                  )}
                  {media.caption && <p className="text-sm text-gray-600 italic">{media.caption}</p>}
                  {media.credit && <p className="text-xs text-gray-500">Credit: {media.credit}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Body */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{story.body || ''}</ReactMarkdown>
          </div>

          {/* Authors */}
          {authors.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="font-bold text-lg mb-4">About the Author{authors.length > 1 ? 's' : ''}</h3>
              <div className="space-y-4">
                {authors.map((author) => (
                  <div key={author.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold">{author.author_name}</p>
                    {author.bio && <p className="text-gray-700 text-sm mt-2">{author.bio}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </PublicShell>
  );
}