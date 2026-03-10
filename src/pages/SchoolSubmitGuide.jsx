import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PublicShell from '@/components/school-tv/PublicShell';
import { Upload, Video, Image, CheckCircle2, AlertCircle, Users, FileType } from 'lucide-react';

export default function SchoolSubmitGuide() {
  const schoolSlug = new URLSearchParams(window.location.search).get('schoolSlug') || 'hampton-dumont';
  const submitUrl = `${createPageUrl('SchoolSubmit')}?schoolSlug=${schoolSlug}`;

  return (
    <PublicShell currentPath="submit">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Share Your Story</h1>
          <p className="text-xl text-blue-100">Learn how to upload videos and photos to our school platform</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Quick Start */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
            <CheckCircle2 className="h-7 w-7" /> Quick Start (3 Steps)
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border-l-4 border-blue-600">
              <div className="text-3xl font-bold text-blue-600 mb-3">1</div>
              <h3 className="font-bold text-lg mb-2">Fill Out Your Info</h3>
              <p className="text-gray-700 text-sm">Tell us your name, email, and what you're sharing (video, photos, or both)</p>
            </div>
            <div className="bg-white rounded-lg p-6 border-l-4 border-blue-600">
              <div className="text-3xl font-bold text-blue-600 mb-3">2</div>
              <h3 className="font-bold text-lg mb-2">Upload Your Files</h3>
              <p className="text-gray-700 text-sm">Select your videos or photos from your device. You can upload multiple files at once.</p>
            </div>
            <div className="bg-white rounded-lg p-6 border-l-4 border-blue-600">
              <div className="text-3xl font-bold text-blue-600 mb-3">3</div>
              <h3 className="font-bold text-lg mb-2">Submit & Done</h3>
              <p className="text-gray-700 text-sm">Confirm the permissions, then submit. We'll review and share your content!</p>
            </div>
          </div>
        </div>

        {/* What to Upload */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Video className="h-7 w-7 text-blue-600" /> What Can You Upload?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Video className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold">Videos</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span><strong>Formats:</strong> MP4, MOV, AVI, WebM</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span><strong>Size:</strong> Up to 500MB per file</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span><strong>Length:</strong> Any duration (sports highlights, event recaps, student stories, etc.)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span><strong>Audio:</strong> Videos with or without sound are fine</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Image className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-bold">Photos</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Formats:</strong> JPG, PNG, GIF, WebP</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Size:</strong> Up to 500MB per file</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Quantity:</strong> Upload 1 or many photos together</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Quality:</strong> Any resolution (landscape, portrait, square)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-yellow-900 mb-2">Pro Tip: Mixed Media</h4>
                <p className="text-yellow-800">You can upload both videos AND photos at the same time! Just select your files and choose "Mixed Media" during submission.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileType className="h-7 w-7 text-purple-600" /> Tips for Great Submissions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4 text-purple-900">📹 For Videos</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Hold your phone or camera sideways (landscape mode) for best results</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Make sure there's good lighting and clear audio</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Keep videos under 10 minutes for faster processing</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Include a catchy title that describes the action</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4 text-orange-900">📸 For Photos</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Use high-resolution photos (at least 1080px wide)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Avoid blurry or watermarked images when possible</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Mix portrait and landscape shots for variety</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Add a brief description of what the photos show</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="h-7 w-7 text-red-600" /> Important: Get Permission First
          </h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h3 className="font-bold text-lg text-red-900 mb-4">⚠️ Before You Submit</h3>
            <p className="text-red-800 mb-4">
              <strong>You must have permission from everyone in your photos or videos</strong> before submitting them to our school platform.
            </p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-red-600 font-bold text-lg">1.</span>
                <div>
                  <p className="font-semibold text-red-900">Students & Staff:</p>
                  <p className="text-red-800">Get verbal or written permission from anyone who appears in your content</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-red-600 font-bold text-lg">2.</span>
                <div>
                  <p className="font-semibold text-red-900">Young Children:</p>
                  <p className="text-red-800">Get permission from a parent or guardian for anyone under 18</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-red-600 font-bold text-lg">3.</span>
                <div>
                  <p className="font-semibold text-red-900">Events:</p>
                  <p className="text-red-800">Check with event organizers before filming or taking photos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to={submitUrl}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-12 rounded-xl transition-colors shadow-lg"
          >
            <Upload className="inline h-6 w-6 mr-2" />
            Start Uploading Now
          </Link>
          <p className="text-gray-600 mt-4">Takes less than 5 minutes to submit</p>
        </div>

        {/* FAQ */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <details className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer group">
              <summary className="font-bold text-lg text-gray-900 flex items-center justify-between">
                How long does it take for my content to appear?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-700 mt-4">Our team reviews all submissions within 1-2 business days. Once approved, your content will be published to the school gallery and may be featured on our homepage.</p>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer group">
              <summary className="font-bold text-lg text-gray-900 flex items-center justify-between">
                Can I upload files from my phone?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-700 mt-4">Yes! Our upload form works on all devices including phones and tablets. Just tap "Click to upload" and select files from your camera roll or photo library.</p>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer group">
              <summary className="font-bold text-lg text-gray-900 flex items-center justify-between">
                What if my file is too large?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-700 mt-4">Files larger than 500MB may fail to upload. Try compressing your video using free tools like HandBrake or reducing the resolution. Most phones can record in a smaller format.</p>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer group">
              <summary className="font-bold text-lg text-gray-900 flex items-center justify-between">
                Will my personal information be public?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-700 mt-4">No. We only publish your name and the content you submit. Your email address, phone number, and other details are kept private and only used for administrative purposes.</p>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer group">
              <summary className="font-bold text-lg text-gray-900 flex items-center justify-between">
                Can I edit or delete my submission after uploading?
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-700 mt-4">Contact our team via email with your submission title and we can help you modify or remove it before it's been reviewed.</p>
            </details>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}