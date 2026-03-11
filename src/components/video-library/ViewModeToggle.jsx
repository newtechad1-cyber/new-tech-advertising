import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';

export default function ViewModeToggle({ viewMode, setViewMode }) {
  return (
    <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('grid')}
        className="gap-2"
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="hidden sm:inline">Grid</span>
      </Button>
      <Button
        variant={viewMode === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('table')}
        className="gap-2"
      >
        <List className="w-4 h-4" />
        <span className="hidden sm:inline">Table</span>
      </Button>
    </div>
  );
}