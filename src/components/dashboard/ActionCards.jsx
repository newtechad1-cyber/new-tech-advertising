import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Video, 
  Calendar, 
  Eye, 
  Upload, 
  CheckCircle, 
  MessageSquare, 
  Sparkles, 
  Users, 
  ClipboardCheck, 
  CalendarClock, 
  Palette, 
  BarChart3,
  ArrowUpCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function ActionCards({ userRole, subscriptionPackage, onSubmitContent }) {
  const isAdmin = userRole === 'admin';

  // Admin always sees admin controls
  if (isAdmin) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ActionCard
          icon={Users}
          title="Manage Clients"
          description="View and manage all client accounts"
          onClick={() => toast.info('Navigate to Clients')}
          variant="admin"
        />
        <ActionCard
          icon={CheckCircle}
          title="Approval Queue"
          description="Review and approve client content"
          onClick={() => toast.info('Navigate to Approval Queue')}
          variant="admin"
        />
        <ActionCard
          icon={CalendarClock}
          title="Scheduling Queue"
          description="Manage all scheduled posts"
          onClick={() => toast.info('Navigate to Scheduling Queue')}
          variant="admin"
        />
        <ActionCard
          icon={Palette}
          title="Content Studio"
          description="Create and edit content"
          onClick={() => toast.info('Navigate to Content Studio')}
          variant="admin"
        />
        <ActionCard
          icon={BarChart3}
          title="Reports"
          description="View analytics and performance"
          onClick={() => toast.info('Navigate to Reports')}
          variant="admin"
        />
      </div>
    );
  }

  // DIY Package ($97/month)
  if (subscriptionPackage === 'diy' || subscriptionPackage === 'DIY') {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <ActionCard
          icon={PlusCircle}
          title="Create Post"
          description="Write and design your social media post"
          onClick={() => toast.info('Navigate to Post Creator')}
          variant="primary"
        />
        <ActionCard
          icon={Video}
          title="Create Simple Video"
          description="Generate short videos with our AI tools"
          onClick={() => toast.info('Navigate to Video Creator')}
          variant="primary"
        />
        <ActionCard
          icon={Calendar}
          title="Schedule"
          description="Schedule your posts across platforms"
          onClick={() => toast.info('Navigate to Scheduler')}
          variant="default"
        />
        <ActionCard
          icon={Eye}
          title="View My Content"
          description="See all your posts and analytics"
          onClick={() => toast.info('Navigate to Content Library')}
          variant="default"
        />
      </div>
    );
  }

  // $197 Collaborative Package
  if (subscriptionPackage === 'collaborative' || subscriptionPackage === '197') {
    return (
      <>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900 font-medium">
            📋 <strong>Collaborative Package:</strong> You provide the text content and exact images/video. 
            We'll schedule it for you. No editing or content creation is included in this package.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <ActionCard
            icon={Upload}
            title="Submit Content for Scheduling"
            description="Provide your text, images, and video for us to schedule"
            onClick={onSubmitContent || (() => toast.info('Submit content flow'))}
            variant="primary"
          />
          <ActionCard
            icon={Upload}
            title="Upload Photos/Video"
            description="Upload your media files for posts"
            onClick={() => toast.info('Navigate to Media Upload')}
            variant="primary"
          />
          <ActionCard
            icon={Eye}
            title="View My Submissions"
            description="See your submitted content and upgrade requests"
            onClick={() => toast.info('Navigate to Submissions')}
            variant="default"
          />
          <ActionCard
            icon={ArrowUpCircle}
            title="Upgrade for Editing/Creation"
            description="Get professional content creation and editing"
            onClick={() => toast.info('Contact us to upgrade to Done-For-You package')}
            variant="upgrade"
          />
        </div>
      </>
    );
  }

  // $297 Done-For-You Package (default)
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      <ActionCard
        icon={CheckCircle}
        title="Review/Approve"
        description="Review and approve content we've created for you"
        onClick={() => toast.info('Navigate to Approval Queue')}
        variant="primary"
      />
      <ActionCard
        icon={Calendar}
        title="View Schedule"
        description="See your upcoming posts and calendar"
        onClick={() => toast.info('Navigate to Schedule')}
        variant="default"
      />
      <ActionCard
        icon={MessageSquare}
        title="Request a Topic/Promo"
        description="Tell us what you want to promote"
        onClick={() => toast.info('Navigate to Request Form')}
        variant="default"
      />
      <ActionCard
        icon={Sparkles}
        title="Brand & Offers"
        description="Manage your brand assets and current offers"
        onClick={() => toast.info('Navigate to Brand Settings')}
        variant="default"
      />
    </div>
  );
}

function ActionCard({ icon: Icon, title, description, onClick, variant = 'default' }) {
  const variantStyles = {
    primary: 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 border-0',
    admin: 'bg-gradient-to-br from-slate-700 to-slate-900 text-white hover:from-slate-800 hover:to-black border-0',
    default: 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md',
    upgrade: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 hover:border-amber-400 hover:shadow-md'
  };

  const iconStyles = {
    primary: 'text-white',
    admin: 'text-white',
    default: 'text-blue-600',
    upgrade: 'text-amber-600'
  };

  const textStyles = {
    primary: 'text-white',
    admin: 'text-white',
    default: 'text-slate-900',
    upgrade: 'text-slate-900'
  };

  const descStyles = {
    primary: 'text-white/90',
    admin: 'text-white/90',
    default: 'text-slate-600',
    upgrade: 'text-amber-800'
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 border-2 ${variantStyles[variant]}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${variant === 'primary' || variant === 'admin' ? 'bg-white/20' : 'bg-blue-50'}`}>
            <Icon className={`h-6 w-6 ${iconStyles[variant]}`} />
          </div>
          <div className="flex-1">
            <CardTitle className={`text-lg mb-1 ${textStyles[variant]}`}>
              {title}
            </CardTitle>
            <CardDescription className={`text-sm ${descStyles[variant]}`}>
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}