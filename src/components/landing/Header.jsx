import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail, Phone, UserCircle, Menu, X, ChevronDown, Shield, Globe, Tv, HelpCircle } from 'lucide-react';
import { createPageUrl } from '../../utils';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { trackCTAClick } from '../analytics/trackingUtils';

export default function Header({ onCTAClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(false);

  const NavLinks = ({ mobile = false }) => {
    if (mobile) {
      return (
        <nav className="flex flex-col space-y-4 text-sm font-medium text-slate-600">
          <div className="font-semibold text-slate-900 text-xs uppercase tracking-wide mb-2">Solutions</div>
          <Link to={createPageUrl('AdaAccessibility')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>ADA Accessibility</Link>
          <Link to={createPageUrl('Ada')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>Website Rebuild</Link>
          <Link to={createPageUrl('StreamingTV')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>Local Visibility</Link>
          <Link to={createPageUrl('SocialMediaManagement')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>Social Media</Link>
          
          <div className="font-semibold text-slate-900 text-xs uppercase tracking-wide mb-2 mt-4">Industries</div>
          <Link to={createPageUrl('AiWebsites')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>AI Websites</Link>
          <Link to={createPageUrl('AiVideos')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>AI Videos</Link>
          <Link to={createPageUrl('AiSeo')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>AI SEO</Link>
          <Link to={createPageUrl('AiAdvertising')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>AI Ads</Link>
          <Link to={createPageUrl('AiSocialMedia')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>AI Social Media</Link>
          
          <Link to={createPageUrl('Blog')} className="hover:text-blue-600 transition-colors mt-4" onClick={() => setIsOpen(false)}>Resources</Link>
          <Link to={createPageUrl('About')} className="hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>About</Link>
          <Link to={createPageUrl('Contact')} className="hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>Contact</Link>
        </nav>
      );
    }

    return (
      <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            Solutions <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('AdaAccessibility')} className="cursor-pointer">ADA Accessibility</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('Ada')} className="cursor-pointer">Website Rebuild</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('StreamingTV')} className="cursor-pointer">Local Visibility</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('SocialMediaManagement')} className="cursor-pointer">Social Media</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            Industries <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('AiWebsites')} className="cursor-pointer">AI Websites</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('AiVideos')} className="cursor-pointer">AI Videos</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('AiSeo')} className="cursor-pointer">AI SEO</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('AiAdvertising')} className="cursor-pointer">AI Ads</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('AiSocialMedia')} className="cursor-pointer">AI Social Media</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link to={createPageUrl('Blog')} className="hover:text-blue-600 transition-colors">Resources</Link>
        <Link to={createPageUrl('About')} className="hover:text-blue-600 transition-colors">About</Link>
        <Link to={createPageUrl('Contact')} className="hover:text-blue-600 transition-colors">Contact</Link>
      </nav>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/bd570a4a6_NTAlogo2.png" 
                alt="New Tech Advertising" 
                className="h-12 w-auto"
              />
              <div>
                <div className="font-bold text-xl text-slate-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  New<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tech</span>
                </div>
                <div className="text-sm text-slate-600 -mt-1">Advertising</div>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <NavLinks />
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-8 mt-8">
                  <Link to={createPageUrl('Home')} onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                    <div className="font-bold text-xl text-slate-900">
                      New<span className="text-blue-600">Tech</span>
                    </div>
                  </Link>
                  <NavLinks mobile />
                  <div className="border-t pt-6 flex flex-col gap-4">
                    <Link to={createPageUrl('Dashboard')} onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <UserCircle className="w-4 h-4" />
                        Client Login
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => {
                        setIsOpen(false);
                        setShowGetStarted(true);
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link to={createPageUrl('Dashboard')}>
              <Button variant="ghost" className="text-slate-600 font-medium hidden sm:flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Client Login
              </Button>
            </Link>
            <Button
              onClick={() => {
                trackCTAClick('Header - Get Started');
                setShowGetStarted(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showGetStarted} onOpenChange={setShowGetStarted}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Choose Your Path</DialogTitle>
            <DialogDescription>
              Select the service that best fits your needs
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Link
              to={createPageUrl('AdaAccessibility')}
              onClick={() => setShowGetStarted(false)}
              className="flex items-start gap-4 p-4 rounded-lg border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-slate-900 mb-1">Free ADA Scan</h3>
                <p className="text-sm text-slate-600">
                  Get a free accessibility compliance scan of your website
                </p>
              </div>
            </Link>

            <Link
              to={createPageUrl('RebuildIntake')}
              onClick={() => setShowGetStarted(false)}
              className="flex items-start gap-4 p-4 rounded-lg border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-slate-900 mb-1">Website Rebuild (ADA-Friendly)</h3>
                <p className="text-sm text-slate-600">
                  Complete website rebuild with full ADA compliance
                </p>
              </div>
            </Link>

            <Link
              to={createPageUrl('StreamingTV')}
              onClick={() => setShowGetStarted(false)}
              className="flex items-start gap-4 p-4 rounded-lg border-2 border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all group"
            >
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200">
                <Tv className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-slate-900 mb-1">Local Visibility (Streaming + Social)</h3>
                <p className="text-sm text-slate-600">
                  Comprehensive local marketing with streaming TV and social media
                </p>
              </div>
            </Link>

            <Link
              to={createPageUrl('OnboardingStart')}
              onClick={() => setShowGetStarted(false)}
              className="flex items-start gap-4 p-4 rounded-lg border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all group"
            >
              <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200">
                <HelpCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-slate-900 mb-1">Not Sure / Full Onboarding</h3>
                <p className="text-sm text-slate-600">
                  Let us help you find the right solution for your business
                </p>
              </div>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}