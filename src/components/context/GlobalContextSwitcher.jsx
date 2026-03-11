import React, { useState, useEffect } from 'react';
import { useGlobalContext } from './useGlobalContext.js';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Building2, School, Zap, Settings } from 'lucide-react';

export default function GlobalContextSwitcher() {
  const { context, isContextType, getContextLabel, switchContext, loading } = useGlobalContext();
  const [companies, setCompanies] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Load available companies and schools
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const [companyList, schoolList] = await Promise.all([
          base44.entities.ClientCompanies?.list?.() || [],
          base44.entities.SchoolLeads?.list?.() || [],
        ]);
        setCompanies(companyList);
        setSchools(schoolList);
      } catch (error) {
        console.error('[GlobalContextSwitcher] Error loading data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  if (loading || !context) {
    return (
      <div className="px-3 py-2 text-xs text-slate-400">
        Loading context...
      </div>
    );
  }

  const getContextIcon = () => {
    switch (context.active_context_type) {
      case 'agency':
        return <Zap className="w-4 h-4" />;
      case 'client':
        return <Building2 className="w-4 h-4" />;
      case 'school':
        return <School className="w-4 h-4" />;
      case 'vertical_system':
        return <Settings className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getContextBadgeColor = () => {
    switch (context.active_context_type) {
      case 'agency':
        return 'bg-purple-100 text-purple-800';
      case 'client':
        return 'bg-blue-100 text-blue-800';
      case 'school':
        return 'bg-amber-100 text-amber-800';
      case 'vertical_system':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {getContextIcon()}
          <span className="text-xs font-medium hidden sm:inline">
            {getContextLabel()}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          {/* Current Context Display */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-600">Current Context</p>
            <div className="flex items-center gap-2">
              <Badge className={getContextBadgeColor()}>
                {context.active_context_type.toUpperCase()}
              </Badge>
              <p className="text-sm font-medium text-slate-900">
                {getContextLabel()}
              </p>
            </div>
            {context.active_user_role && (
              <p className="text-xs text-slate-500">
                Role: <span className="font-mono font-semibold">{context.active_user_role}</span>
              </p>
            )}
          </div>

          {/* Context Type Selector */}
          <div className="space-y-2 border-t pt-4">
            <p className="text-xs font-semibold text-slate-600">Switch Context</p>
            
            <Button
              variant={isContextType('agency') ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start"
              onClick={() => switchContext({ active_context_type: 'agency' })}
            >
              <Zap className="w-4 h-4 mr-2" />
              Agency Admin
            </Button>

            {companies.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Client Companies:</p>
                <Select
                  value={isContextType('client') ? context.active_company_id : ''}
                  onValueChange={(companyId) => {
                    const company = companies.find(c => c.id === companyId);
                    switchContext({
                      active_context_type: 'client',
                      active_company_id: companyId,
                      active_company_name: company?.company_name,
                      active_nav_family: 'client_portal',
                    });
                  }}
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Select company..." />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {schools.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Schools:</p>
                <Select
                  value={isContextType('school') ? context.active_school_id : ''}
                  onValueChange={(schoolId) => {
                    const school = schools.find(s => s.id === schoolId);
                    switchContext({
                      active_context_type: 'school',
                      active_school_id: schoolId,
                      active_school_name: school?.school_name,
                      active_nav_family: 'school_admin',
                    });
                  }}
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Select school..." />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map(school => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.school_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <p className="text-xs text-slate-500 mb-2">Vertical Systems:</p>
              <Select
                value={isContextType('vertical_system') ? context.active_vertical_type : ''}
                onValueChange={(vertical) => switchContext({
                  active_context_type: 'vertical_system',
                  active_vertical_type: vertical,
                  active_nav_family: 'main_admin',
                })}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Select vertical..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hvac">HVAC</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="roofing">Roofing</SelectItem>
                  <SelectItem value="medspa">Med Spa</SelectItem>
                  <SelectItem value="dentist">Dentist</SelectItem>
                  <SelectItem value="nonprofit">Nonprofit</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="local">Local Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Meta Info */}
          {context.last_context_switch_at && (
            <div className="text-xs text-slate-400 border-t pt-3">
              Last switched: {new Date(context.last_context_switch_at).toLocaleString()}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}