import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail, Phone, UserCircle, Menu, X, ChevronDown } from 'lucide-react';
import { createPageUrl } from '../../utils';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { trackCTAClick } from '../analytics/trackingUtils';

export default function Header({ onCTAClick }) {
  const [isOpen, setIsOpen] = useState(false);


  const NavLinks = ({ mobile = false }) => {
    if (mobile) {
      return (
        <nav className="flex flex-col space-y-4 text-sm font-medium text-slate-600">
          <div className="font-semibold text-slate-900 text-xs uppercase tracking-wide mb-2">What We Help With</div>
          <Link to={createPageUrl('SocialMediaManagement')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>Social Media Help</Link>
          <Link to={createPageUrl('Rebuild')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>Website Help</Link>
          <Link to={createPageUrl('StreamingTV')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>TV Ads</Link>
          <Link to={createPageUrl('AdaAccessibility')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>Website Accessibility</Link>

          <Link to={createPageUrl('Blog')} className="hover:text-blue-600 transition-colors mt-4" onClick={() => setIsOpen(false)}>Articles</Link>
          <Link to={createPageUrl('About')} className="hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>About Us</Link>
          <Link to={createPageUrl('Contact')} className="hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>Contact</Link>
        </nav>
      );
    }

    return (
      <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            What We Help With <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('SocialMediaManagement')} className="cursor-pointer">Social Media Help</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('Rebuild')} className="cursor-pointer">Website Help</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('StreamingTV')} className="cursor-pointer">TV Ads</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('AdaAccessibility')} className="cursor-pointer">Website Accessibility</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link to={createPageUrl('Blog')} className="hover:text-blue-600 transition-colors">Articles</Link>
        <Link to={createPageUrl('About')} className="hover:text-blue-600 transition-colors">About Us</Link>
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
                        window.location.href = createPageUrl('SocialMediaManagement');
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    >
                      Start Free Trial
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
                trackCTAClick('Header - Start Free Trial');
                window.location.href = createPageUrl('SocialMediaManagement');
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>


    </header>
  );
}