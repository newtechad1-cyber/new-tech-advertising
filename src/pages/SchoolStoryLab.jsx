import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Upload,
  Calendar,
  Video,
  Sparkles,
  CheckCircle2,
  Users,
  ArrowRight,
  Play,
  BookOpen,
  Shield,
  Zap,
  Heart,
} from 'lucide-react';

export default function SchoolStoryLab() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              A Modern Digital Yearbook and Student Media Platform for Schools
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              School Story Lab helps students capture the moments that define their school year while learning modern communication and AI storytelling skills.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Students already create photos, videos, and stories every day. School Story Lab gives your district a safe, organized platform to collect those moments, turn them into stories, and build a living digital yearbook the entire community can enjoy.
            </p>
            
            <div className="flex gap-4 pt-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Schedule a Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('how-it-works')}
                className="border-2"
              >
                See How It Works
              </Button>
            </div>
          </div>
          
          {/* Right Visual */}
          <div className="relative h-96 lg:h-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-500 to-blue-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Video className="h-16 w-16 mx-auto mb-4 opacity-80" />
                <p className="text-lg font-semibold">Dashboard Preview</p>
                <p className="text-sm opacity-75 mt-2">Stories, Videos & Yearbook Pages</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section id="problem" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Schools Create Incredible Moments Every Day — But Most of Them Are Lost
          </h2>
          
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              From classroom projects to sports highlights and concerts to robotics competitions, students are constantly creating memories and achievements.
            </p>
            
            <p>
              Unfortunately, most of these moments disappear into personal phones, scattered social media posts, or folders that are never organized.
            </p>
            
            <p className="font-semibold text-gray-900">
              Schools need a better way to collect, organize, and share the story of their students.
            </p>
            
            <p className="text-blue-600 font-semibold">
              School Story Lab provides that solution.
            </p>
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            A Digital Storytelling Platform Built for Schools
          </h2>
          
          <p className="text-lg text-gray-700 mb-12 max-w-3xl leading-relaxed">
            School Story Lab brings together student media, digital yearbooks, and guided AI tools into one simple platform. Students can submit photos, videos, and stories while teachers and administrators maintain full control over what gets published. The result is a living archive of the school year that grows week by week.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Student photo and video submission portal',
              'Modern online yearbook that grows throughout the year',
              'Bulldog TV style video storytelling hub',
              'Teacher and administrator approval workflow',
              'AI-assisted writing tools for captions, articles, and video scripts',
              'Safe, moderated environment for responsible AI use',
            ].map((feature, idx) => (
              <div key={idx} className="flex gap-3 p-4 bg-white rounded-lg border border-gray-200">
                <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">
            Everything Your School Needs to Tell Its Story
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: 'Student Media Hub',
                description: 'Students and staff can upload photos, videos, and story ideas from events, classrooms, sports, and clubs.'
              },
              {
                icon: Calendar,
                title: 'Digital Yearbook',
                description: 'Create a living yearbook that grows all year instead of waiting until the end of the school year.'
              },
              {
                icon: Video,
                title: 'Bulldog TV Video Network',
                description: 'Automatically turn student clips into highlight videos, event recaps, and school stories.'
              },
              {
                icon: Sparkles,
                title: 'AI Story Lab for Students',
                description: 'Teach students how to responsibly use AI for writing, storytelling, and media creation.'
              },
              {
                icon: Shield,
                title: 'Teacher Moderation Tools',
                description: 'All submissions can be reviewed and approved before publication to ensure safe and appropriate content.'
              },
              {
                icon: Heart,
                title: 'Community Engagement',
                description: 'Parents and the community can see the achievements and stories that make your school special.'
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                  <Icon className="h-10 w-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI LEARNING SECTION */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Teach Students How to Use AI Responsibly
          </h2>
          
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed mb-12">
            <p>
              Artificial intelligence is becoming part of the modern workplace. School Story Lab introduces students to AI in a safe, guided environment where they learn how to use it as a tool for communication and creativity.
            </p>
            
            <p className="font-semibold text-gray-900">Students can use AI to:</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {[
              'Generate interview questions',
              'Draft story outlines',
              'Create video scripts',
              'Write captions for yearbook photos',
              'Summarize event highlights',
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 p-4 bg-white rounded-lg border border-purple-200">
                <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800">{item}</span>
              </div>
            ))}
          </div>
          
          <p className="text-lg text-gray-700 leading-relaxed bg-purple-100 rounded-lg p-6 border-l-4 border-purple-600">
            Teachers remain in control while students learn practical digital skills that will benefit them long after graduation.
          </p>
        </div>
      </section>

      {/* STUDENT BENEFITS SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Built for Student Creativity
          </h2>
          
          <p className="text-lg text-gray-700 mb-12 leading-relaxed">
            School Story Lab turns students into storytellers for their school community. Students gain real-world skills including:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Digital storytelling',
              'Video production',
              'Journalism basics',
              'Responsible AI use',
              'Teamwork and collaboration',
              'Media communication skills',
            ].map((skill, idx) => (
              <div key={idx} className="flex gap-3 p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border border-blue-200">
                <ArrowRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800">{skill}</span>
              </div>
            ))}
          </div>
          
          <p className="text-lg text-gray-700 mt-12 leading-relaxed text-center">
            These experiences help students build confidence, creativity, and future-ready skills.
          </p>
        </div>
      </section>

      {/* SCHOOL BENEFITS SECTION */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            Benefits for Schools and Districts
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Strengthen school pride and culture',
              'Improve communication with parents and the community',
              'Modernize the traditional yearbook experience',
              'Encourage student participation in school life',
              'Provide a safe environment for learning AI tools',
              'Build a digital archive of school memories',
            ].map((benefit, idx) => (
              <div key={idx} className="flex gap-3 p-4 bg-white rounded-lg border border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">
            How School Story Lab Works
          </h2>
          
          <div className="space-y-8">
            {[
              {
                step: 1,
                title: 'Students Submit Content',
                description: 'Students and staff upload photos, videos, and story ideas from school activities.',
              },
              {
                step: 2,
                title: 'Teachers Review and Approve',
                description: 'Administrators or teachers review submissions before anything is published.',
              },
              {
                step: 3,
                title: 'Stories and Videos Are Created',
                description: 'The platform helps organize content into articles, highlight videos, and yearbook pages.',
              },
              {
                step: 4,
                title: 'The School Year Comes to Life',
                description: 'Parents, students, and the community can explore the stories that make your school unique.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES SECTION */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Perfect for Schools That Want to Highlight
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Sports teams',
              'Concerts and performances',
              'Classroom projects',
              'Robotics and STEM programs',
              'Student clubs',
              'Graduation and senior activities',
              'Community service projects',
              'Teacher spotlights',
            ].map((useCase, idx) => (
              <div key={idx} className="p-4 bg-white rounded-lg border border-blue-200 flex gap-3">
                <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800 font-medium">{useCase}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Bring Your School's Story to Life
          </h2>
          
          <p className="text-xl leading-relaxed mb-12 opacity-95 max-w-3xl mx-auto">
            School Story Lab helps districts celebrate student achievements, preserve school memories, and teach the communication skills students need for the future.
          </p>
          
          <p className="text-lg font-semibold mb-12">
            Create a digital yearbook, a student media network, and an AI storytelling lab — all in one platform.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 font-semibold">
              Schedule a Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
              Request Information
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-white font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">For Schools</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">For Administrators</a></li>
                <li><a href="#" className="hover:text-white transition">For Teachers</a></li>
                <li><a href="#" className="hover:text-white transition">For Students</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Trust & Safety</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Privacy & Student Safety</a></li>
                <li><a href="#" className="hover:text-white transition">Data Protection</a></li>
                <li><a href="#" className="hover:text-white transition">Moderation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Sales</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-sm mb-6 text-gray-500">
              Designed with school safety and moderation in mind.<br />
              All content can be reviewed before publication.
            </p>
            <p className="text-center text-xs text-gray-600">
              © 2026 School Story Lab. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}