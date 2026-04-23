import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserCircle, Menu, X, ChevronDown, Lock } from 'lucide-react';
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

          <Link to="/insights" className="hover:text-blue-600 transition-colors mt-4" onClick={() => setIsOpen(false)}>Insights</Link>
          <Link to={createPageUrl('About')} className="hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>About Us</Link>
          <Link to={createPageUrl('Contact')} className="hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>Contact</Link>
        </nav>
      );
    }

    return (
      <nav className="flex items-center gap-5 text-sm font-medium text-slate-600 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 hover:text-blue-600 transition-colors whitespace-nowrap outline-none">
            What We Do For You <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <a href="https://newtechadvertising.com/socialmediamarketing" target="_blank" rel="noopener noreferrer" className="cursor-pointer">Social Media</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('Rebuild')} className="cursor-pointer">Website Support</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('StreamingTV')} className="cursor-pointer">TV & Video Ads</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl('AdaAccessibility')} className="cursor-pointer">Accessibility</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link to="/insights" className="hover:text-blue-600 transition-colors whitespace-nowrap">Insights</Link>
        <Link to={createPageUrl('About')} className="hover:text-blue-600 transition-colors whitespace-nowrap">About Us</Link>
        <Link to={createPageUrl('Contact')} className="hover:text-blue-600 transition-colors whitespace-nowrap">Contact</Link>
      </nav>
    );
  };

  return (
    <>
      {/* Top nav bar - fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          {/* Logo in nav */}
          <Link to={createPageUrl('Home')} className="flex-shrink-0 mr-6">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png"
              alt="New Tech Advertising"
              style={{ height: '36px', width: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </Link>

          <div className="hidden lg:flex items-center gap-5 text-sm flex-1">
            <NavLinks />
          </div>

          <div className="flex items-center gap-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-8 mt-8">
                  <Link to={createPageUrl('Home')} onClick={() => setIsOpen(false)} className="flex items-center">
                    <img 
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/6e3c5001c_builtforsmallbusinessespng2.png" 
                      alt="New Tech Advertising" 
                      style={{ maxHeight: '72px', width: 'auto', objectFit: 'contain', display: 'block' }}
                    />
                  </Link>
                  <NavLinks mobile />
                  <div className="border-t pt-6 flex flex-col gap-4">
                    <Button onClick={() => { setIsOpen(false); onCTAClick?.(); }} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      Start Free Trial
                    </Button>
                    <Link to={createPageUrl('Dashboard')} onClick={() => setIsOpen(false)} className="w-full">
                      <Button variant="outline" className="w-full flex items-center gap-2">
                        <UserCircle className="w-4 h-4" /> Client Login
                      </Button>
                    </Link>
                    <Link to={createPageUrl('AdminDashboard')} onClick={() => setIsOpen(false)} className="w-full">
                      <Button variant="outline" className="w-full flex items-center gap-2">
                        <Lock className="w-4 h-4" /> Admin Login
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Button
              onClick={() => { trackCTAClick('Header - Start Free Trial'); onCTAClick?.(); }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Start Free Trial
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title="Login">
                  <UserCircle className="w-5 h-5 text-slate-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl('Dashboard')} className="cursor-pointer flex items-center gap-2">
                    <UserCircle className="w-4 h-4" />
                    Client Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl('AdminDashboard')} className="cursor-pointer flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Admin Login
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Logo banner - sits below fixed nav, above hero */}
      <div className="flex justify-center items-center" style={{ marginTop: '53px', background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', padding: '0' }}>
        <Link to={createPageUrl('Home')}>
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png"
            alt="New Tech Advertising"
            style={{ height: '100px', width: 'auto', objectFit: 'contain', display: 'block' }}
          />
        </Link>
      </div>
    </>
  );
}