import React from 'react';
import { useSchoolRoute } from '@/components/school-tv/useSchoolRoute';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';

export default function BulldogTVStories() {
  const { adminRoutes } = useSchoolRoute();

  const stories = [
    {
      id: 1,
      category: 'STEM / Student Projects',
      headline: 'Robotics Team Builds Competition Robot for Regional Challenge',
      excerpt: 'Students in the Hampton-Dumont robotics club have spent the past several weeks designing, building, and programming their latest competition robot.',
      date: 'Mar 8, 2026',
      image: '🤖',
    },
    {
      id: 2,
      category: 'Athletics',
      headline: 'Bulldogs Deliver Exciting Friday Night Performance',
      excerpt: 'The Hampton-Dumont Bulldogs brought energy and excitement to the field Friday night as fans filled the stands for another memorable home game.',
      date: 'Mar 6, 2026',
      image: '🏈',
    },
    {
      id: 3,
      category: 'Classroom Projects',
      headline: 'Elementary Students Present STEM Experiments',
      excerpt: 'Students at Hampton-Dumont Elementary recently shared their creativity during the school\'s STEM project showcase.',
      date: 'Mar 4, 2026',
      image: '🔬',
    },
    {
      id: 4,
      category: 'Performing Arts',
      headline: 'Winter Choir Concert Showcases Student Talent',
      excerpt: 'The Hampton-Dumont choir program recently hosted its winter concert, bringing students, families, and community members together for an evening of music.',
      date: 'Mar 1, 2026',
      image: '🎵',
    },
    {
      id: 5,
      category: 'Student Leadership',
      headline: 'Student Council Launches Community Food Drive',
      excerpt: 'Members of the Hampton-Dumont student council recently organized a food drive to support local families in need.',
      date: 'Feb 26, 2026',
      image: '❤️',
    },
  ];

  const fullStories = {
    1: {
      headline: 'Robotics Team Builds Competition Robot for Regional Challenge',
      category: 'STEM / Student Projects',
      date: 'Mar 8, 2026',
      image: '🤖',
      body: `Students in the Hampton-Dumont robotics club have spent the past several weeks designing, building, and programming their latest competition robot.

Meeting after school and during study halls, the team worked together to troubleshoot mechanical issues, test sensors, and refine their programming before the upcoming regional robotics competition.

For many students, robotics club is about more than building machines.

"It teaches us how to solve problems together," said one student team member. "Sometimes the robot doesn't do what we expect, but that's when we learn the most."

The team will travel to compete later this month, representing Hampton-Dumont alongside dozens of other schools from across the region.

Whether the robot wins or not, students say the real reward is learning engineering skills and teamwork along the way.`,
    },
    2: {
      headline: 'Bulldogs Deliver Exciting Friday Night Performance',
      category: 'Athletics',
      date: 'Mar 6, 2026',
      image: '🏈',
      body: `The Hampton-Dumont Bulldogs brought energy and excitement to the field Friday night as fans filled the stands for another memorable home game.

Students, families, and community members gathered to cheer on the Bulldogs in a game that showcased strong teamwork and determination.

The band kept the crowd energized throughout the evening while cheerleaders led the student section in school spirit chants.

Moments like these are part of what makes Friday night football a special tradition in Hampton-Dumont.

Beyond the scoreboard, the evening highlighted the pride and community spirit that bring students and families together.`,
    },
    3: {
      headline: 'Elementary Students Present STEM Experiments',
      category: 'Classroom Projects',
      date: 'Mar 4, 2026',
      image: '🔬',
      body: `Students at Hampton-Dumont Elementary recently shared their creativity during the school's STEM project showcase.

Classrooms were filled with hands-on experiments, from simple machines to creative science demonstrations.

Parents and teachers visited the showcase to see the projects and talk with students about what they learned.

One group demonstrated a homemade bridge structure designed to hold weight using only limited materials.

Another project explored how different surfaces affect the speed of toy cars.

Teachers say events like the STEM showcase help students develop curiosity and confidence.

"It's exciting to see students explain their thinking and take pride in their work," one teacher said.`,
    },
    4: {
      headline: 'Winter Choir Concert Showcases Student Talent',
      category: 'Performing Arts',
      date: 'Mar 1, 2026',
      image: '🎵',
      body: `The Hampton-Dumont choir program recently hosted its winter concert, bringing students, families, and community members together for an evening of music.

Students from multiple grade levels performed a selection of seasonal and contemporary pieces.

The concert highlighted the dedication students have shown throughout the semester as they practiced and prepared their performances.

Parents and community members filled the auditorium to support the performers.

For many students, performing on stage is both exciting and rewarding.

Music programs like this continue to play an important role in building confidence and creativity among students.`,
    },
    5: {
      headline: 'Student Council Launches Community Food Drive',
      category: 'Student Leadership',
      date: 'Feb 26, 2026',
      image: '❤️',
      body: `Members of the Hampton-Dumont student council recently organized a food drive to support local families in need.

Students collected donations throughout the week, encouraging classmates and staff to contribute canned goods and non-perishable items.

The effort quickly grew into a school-wide initiative.

Boxes filled with donated food lined the school hallway by the end of the week.

Student leaders say the project was an opportunity to give back to the community that supports their school.

Community service activities like this help students understand the impact they can have beyond the classroom.`,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Stories</h1>
          </div>
          <p className="text-blue-100 text-lg">Celebrating the moments that define Hampton-Dumont Schools</p>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid gap-6">
          {stories.map((story) => (
            <div key={story.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                {/* Image */}
                <div className="md:w-48 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center h-48 md:h-auto text-6xl">
                  {story.image}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{story.category}</span>
                    <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-3">{story.headline}</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">{story.excerpt}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="h-4 w-4" />
                      {story.date}
                    </div>
                    <a
                      href={`#story-${story.id}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                    >
                      Read Story
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Story Modal View (simplified - in real app would be modal) */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {stories.slice(0, 1).map((story) => {
          const full = fullStories[story.id];
          return (
            <div key={story.id} id={`story-${story.id}`} className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center mb-8">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">{full.category}</p>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{full.headline}</h1>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  {full.date}
                </div>
              </div>

              <div className="text-6xl text-center my-8">{full.image}</div>

              <div className="max-w-3xl mx-auto space-y-4 text-lg text-gray-700 leading-relaxed">
                {full.body.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}