import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Copy,
  Eye,
  Edit,
  BookOpen,
} from 'lucide-react';

const prompts = [
  {
    id: 'story',
    name: 'Student Story Generator',
    description: 'Create full article-style stories for the school story hub',
    category: 'Writing',
    usage: 342,
    example: 'Robotics Team Prepares for Regional Competition',
  },
  {
    id: 'captions',
    name: 'Yearbook Caption Writer',
    description: 'Generate 3 caption options for photos and videos',
    category: 'Writing',
    usage: 218,
    example: 'Robotics team members test their design before competition',
  },
  {
    id: 'videoScript',
    name: 'Video Highlight Script',
    description: 'Create voiceover narration for highlight videos',
    category: 'Video',
    usage: 156,
    example: 'Students collaborate in the robotics lab...',
  },
  {
    id: 'headlines',
    name: 'Headline Generator',
    description: 'Generate 5 headline options for stories',
    category: 'Writing',
    usage: 298,
    example: 'Robotics Team Builds Competition Robot',
  },
  {
    id: 'questions',
    name: 'Interview Question Generator',
    description: 'Create interview questions for student stories',
    category: 'Journalism',
    usage: 124,
    example: 'What inspired you to join the robotics team?',
  },
];

const guidelines = [
  {
    id: 1,
    title: 'AI Transparency in Student Work',
    content: `When students use AI tools to help create content, they should understand that:

• AI tools are writing assistants, not replacements for their thinking
• Students should review and edit all AI-generated content
• AI outputs may need fact-checking and verification
• Using AI should be disclosed when appropriate

Students should credit any AI assistance in their work.`,
  },
  {
    id: 2,
    title: 'Responsible AI Use in Schools',
    content: `School Story Lab's AI tools are designed to be educational:

• All content is reviewed by school staff before publication
• AI output is never published without human approval
• Students learn how AI works while using it
• Content must remain school appropriate and factually accurate

These tools teach students about AI while maintaining safety and accuracy.`,
  },
  {
    id: 3,
    title: 'Privacy & Data Protection',
    content: `When students upload content:

• Personal information is protected per school policy
• Media is stored securely and not shared with third parties
• Student names and likenesses require proper consent
• Parents can opt out of student content publishing

All uploads are treated with privacy as a priority.`,
  },
  {
    id: 4,
    title: 'Content Quality Standards',
    content: `All AI-generated content must meet these standards:

• Factually accurate and verified
• Age-appropriate and school safe
• Free from exaggeration or unsupported claims
• Inclusive and respectful language
• Suitable for public viewing by parents and community

Teachers review everything before it's published.`,
  },
];

export default function AIPromptLibrary() {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [selectedGuideline, setSelectedGuideline] = useState(null);

  return (
    <div className="space-y-8">
      {/* Prompt Templates */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Prompt Templates
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{prompt.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{prompt.description}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {prompt.category}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {prompt.usage} uses
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">Example Output:</p>
                  <p className="text-sm text-gray-700 italic">"{prompt.example}"</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-blue-600"
                  onClick={() => setSelectedPrompt(prompt)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigator.clipboard.writeText(prompt.name)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Learning Guidelines</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {guidelines.map((guideline) => (
            <div
              key={guideline.id}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-3">{guideline.title}</h3>
              <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed mb-4">
                {guideline.content}
              </p>
              <Button
                variant="ghost"
                className="text-blue-600 text-sm"
                onClick={() => setSelectedGuideline(guideline)}
              >
                Learn More →
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">{selectedPrompt.name}</h3>
              <p className="text-gray-600 mt-1">{selectedPrompt.description}</p>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 mb-4 line-clamp-6">{selectedPrompt.description}</p>
              <div className="flex gap-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Use This Template
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedPrompt(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}