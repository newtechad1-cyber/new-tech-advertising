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
          <Link to={createPageUrl('AdaAccessibility')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>ADA Website Accessibility</Link>
          <Link to={createPageUrl('Rebuild')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>Website Rebuild (ADA-Friendly)</Link>
          <Link to={createPageUrl('StreamingTV')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>Local Visibility (Streaming + Social)</Link>
          <Link to={createPageUrl('StreamingTV')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>Streaming TV & Video Advertising</Link>
          <Link to={createPageUrl('SocialMediaManagement')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>Social Media Management</Link>
          
          <div className="font-semibold text-slate-900 text-xs uppercase tracking-wide mb-2 mt-4">Industries</div>
          <Link to="/industries" className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>All Industries</Link>
          <Link to="/industries/small-local" className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>Small Local Businesses</Link>
          <Link to="/industries/service-trades" className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>Service Trades</Link>
          <Link to="/industries/professionals" className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>Professional Offices</Link>
          <Link to="/industries/nonprofits" className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>Nonprofits & Community</Link>
          
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
              <Link to={createPageUrl('AdaAccessibility')} className="cursor-pointer">ADA Website Accessibility</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('Rebuild')} className="cursor-pointer">Website Rebuild (ADA-Friendly)</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('StreamingTV')} className="cursor-pointer">Local Visibility (Streaming + Social)</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('StreamingTV')} className="cursor-pointer">Streaming TV & Video Advertising</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('SocialMediaManagement')} className="cursor-pointer">Social Media Management</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            Industries <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <a href="/industries" className="cursor-pointer">All Industries</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/industries/small-local" className="cursor-pointer">Small Local Businesses</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/industries/service-trades" className="cursor-pointer">Service Trades</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/industries/professionals" className="cursor-pointer">Professional Offices</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/industries/nonprofits" className="cursor-pointer">Nonprofits & Community</a>
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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Get Started</DialogTitle>
            <DialogDescription>
              Choose the option that fits your needs
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-3 py-4">
            <a
              href="/adaaccessibility"
              onClick={() => setShowGetStarted(false)}
              className="flex items-center gap-3 p-4 rounded-lg border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-slate-900">Free ADA Scan</span>
            </a>

            <a
              href="/rebuild"
              onClick={() => setShowGetStarted(false)}
              className="flex items-center gap-3 p-4 rounded-lg border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all"
            >
              <Globe className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-slate-900">Website Rebuild</span>
            </a>

            <a
              href="/local-visibility"
              onClick={() => setShowGetStarted(false)}
              className="flex items-center gap-3 p-4 rounded-lg border-2 border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all"
            >
              <Tv className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-slate-900">Local Visibility</span>
            </a>

            <a
              href="/get-started"
              onClick={() => setShowGetStarted(false)}
              className="flex items-center gap-3 p-4 rounded-lg border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all"
            >
              <HelpCircle className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-slate-900">Full Onboarding</span>
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}