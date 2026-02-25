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
          <div className="font-semibold text-slate-900 text-xs uppercase tracking-wide mb-2">What We Do For You</div>
          <a href="https://newtechadvertising.com/socialmediamarketing" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>Social Media Support</a>
          <Link to={createPageUrl('Rebuild')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>Website Support</Link>
          <Link to={createPageUrl('StreamingTV')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>Video Creation & TV Ads</Link>
          <Link to={createPageUrl('AdaAccessibility')} className="hover:text-blue-600 transition-colors pl-4" onClick={() => setIsOpen(false)}>Website Accessibility & Rebuild</Link>

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
            What We Do For You <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <a href="https://newtechadvertising.com/socialmediamarketing" target="_blank" rel="noopener noreferrer" className="cursor-pointer">Social Media Support</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('Rebuild')} className="cursor-pointer">Website Support</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('StreamingTV')} className="cursor-pointer">Video Creation & TV Ads</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('AdaAccessibility')} className="cursor-pointer">Website Accessibility & Rebuild</Link>
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
    <>
      <style>{`
        .site-header { height: 120px; padding: 0; }
        .site-header .header-inner { height: 120px; display: flex; align-items: center; padding: 0 24px; }
        .site-header .logo-img { max-height: 105px; width: auto; object-fit: contain; display: block; }
        @media (max-width: 1023px) {
          .site-header { height: 88px; }
          .site-header .header-inner { height: 88px; }
          .site-header .logo-img { max-height: 72px; }
        }
      `}</style>
      <header className="site-header fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="header-inner max-w-7xl mx-auto">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Link to={createPageUrl('Home')} className="flex items-center">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/6e3c5001c_builtforsmallbusinessespng2.png" 
                  alt="New Tech Advertising" 
                  className="logo-img"
                />
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-5 text-sm">
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
                    <img 
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/6e3c5001c_builtforsmallbusinessespng2.png" 
                      alt="New Tech Advertising" 
                      style={{ maxHeight: '65px', width: 'auto', objectFit: 'contain', display: 'block' }}
                    />
                  </Link>
                  <NavLinks mobile />
                  <div className="border-t pt-6 flex flex-col gap-4">
                    <a href="https://ntaaffiliates.com" target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        Start Free Trial
                      </Button>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <a href="https://ntaaffiliates.com" target="_blank" rel="noopener noreferrer">
              <Button
                onClick={() => trackCTAClick('Header - Start Free Trial')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Start Free Trial
              </Button>
            </a>
          </div>
        </div>
      </div>


    </header>
  );
}