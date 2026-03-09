import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  Home,
  Settings,
  LogOut,
} from 'lucide-react';

export default function TopBar({ schoolName, userEmail, onLogout }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSchoolSwitcher, setShowSchoolSwitcher] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left: School Switcher & Search */}
        <div className="flex items-center gap-6 flex-1">
          {/* School Switcher */}
          <div className="relative">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowSchoolSwitcher(!showSchoolSwitcher)}
            >
              {schoolName}
              <ChevronDown className="h-4 w-4" />
            </Button>
            {showSchoolSwitcher && (
              <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg w-48 py-2">
                <div className="px-4 py-2 text-xs text-gray-500 uppercase font-semibold">Your Schools</div>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">{schoolName}</button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-600">+ Add School</button>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xs relative hidden sm:block">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search stories, videos, events..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right: Notifications, Quick Create, User Menu */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            {showNotifications && (
              <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg w-80 p-4">
                <p className="font-semibold text-gray-900 mb-3">Notifications</p>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <div className="border-l-4 border-blue-500 pl-3 py-2">
                    <p className="text-sm font-medium text-gray-900">New submission pending review</p>
                    <p className="text-xs text-gray-600 mt-1">Basketball Game Highlights</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-3 py-2">
                    <p className="text-sm font-medium text-gray-900">AI content ready for review</p>
                    <p className="text-xs text-gray-600 mt-1">Science Fair Winners Story</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Create */}
          <div className="relative">
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </Button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {userEmail?.split('@')[0]}
              <ChevronDown className="h-4 w-4" />
            </Button>
            {showUserMenu && (
              <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg w-48">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{userEmail}</p>
                </div>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Dashboard
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2 text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}