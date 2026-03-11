import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, X, FileCheck, Clock, Zap, Repeat2 } from 'lucide-react';

export default function BulkActionBar({ selectedCount, onAction, onClearSelection }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action, payload) => {
    onAction(action, payload);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium text-slate-700">
        {selectedCount} video{selectedCount !== 1 ? 's' : ''} selected
      </div>
      <div className="flex gap-2">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Zap className="w-4 h-4" />
              Bulk Actions
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleAction('approve')}>
              <FileCheck className="w-4 h-4 mr-2" />
              Approve Selected
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('schedule')}>
              <Clock className="w-4 h-4 mr-2" />
              Schedule for Later
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAction('generateCaptions')}>
              Generate Captions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('generateCopy')}>
              Generate Publish Copy
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAction('createRenders')}>
              Create Renders
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('retry')}>
              <Repeat2 className="w-4 h-4 mr-2" />
              Retry Failed Jobs
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAction('publishWebsite')}>
              Publish Website Only
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Clear
        </Button>
      </div>
    </div>
  );
}