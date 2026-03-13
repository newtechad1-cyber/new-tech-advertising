import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  Power,
  Plus,
  Search,
  TrendingUp,
  Clock,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import RuleDetailModal from '@/components/automation/RuleDetailModal';
import RuleExecutionLog from '@/components/automation/RuleExecutionLog';

export default function AdminAutomationRules() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedRule, setSelectedRule] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (currentUser?.role !== 'admin') {
          window.location.href = '/';
          return;
        }
        setUser(currentUser);
      } catch (error) {
        window.location.href = '/';
      }
    };
    loadUser();
  }, []);

  // Fetch all rules
  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['automation_rules'],
    queryFn: async () => {
      return await base44.entities.AutomationRule.list('-priority', 100);
    },
  });

  // Toggle rule active status
  const toggleRuleMutation = useMutation({
    mutationFn: async (rule) => {
      return await base44.entities.AutomationRule.update(rule.id, {
        is_active: !rule.is_active,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation_rules'] });
    },
  });

  // Delete rule
  const deleteRuleMutation = useMutation({
    mutationFn: async (ruleId) => {
      return await base44.entities.AutomationRule.delete(ruleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation_rules'] });
    },
  });

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.rule_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || rule.trigger_category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { key: 'all', label: 'All Categories' },
    { key: 'lifecycle', label: 'Lifecycle' },
    { key: 'retention', label: 'Retention' },
    { key: 'sales_signals', label: 'Sales Signals' },
    { key: 'billing', label: 'Billing' },
    { key: 'pipeline', label: 'Sales Pipeline' },
  ];

  const getCategoryColor = (category) => {
    const colors = {
      lifecycle: 'bg-blue-600',
      retention: 'bg-purple-600',
      sales_signals: 'bg-amber-600',
      billing: 'bg-red-600',
      pipeline: 'bg-green-600',
    };
    return colors[category] || 'bg-slate-600';
  };

  const getTriggerIcon = (isActive) => {
    return isActive ? (
      <CheckCircle2 className="w-4 h-4 text-green-500" />
    ) : (
      <AlertCircle className="w-4 h-4 text-slate-400" />
    );
  };

  if (!user) return null;

  return (
    <AdminLayout currentPageName="AdminAutomationRules">
      <div className="min-h-screen bg-slate-950">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white">Automation Rules Engine</h1>
                <p className="text-slate-400 mt-1">Manage platform automation triggers and actions</p>
              </div>
              <Button onClick={() => {
                setSelectedRule(null);
                setShowModal(true);
              }} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Rule
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm mb-1">Total Rules</p>
                <p className="text-2xl font-bold text-white">{rules.length}</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm mb-1">Active</p>
                <p className="text-2xl font-bold text-green-400">{rules.filter(r => r.is_active).length}</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm mb-1">Total Executions</p>
                <p className="text-2xl font-bold text-white">
                  {rules.reduce((sum, r) => sum + (r.execution_count || 0), 0)}
                </p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 cursor-pointer hover:bg-slate-700" onClick={() => setShowLogs(true)}>
                <p className="text-slate-400 text-sm mb-1">View Logs</p>
                <p className="text-2xl font-bold text-blue-400">→</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900 border-b border-slate-700 sticky top-24 z-9">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search rules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.key}
                    variant={filterCategory === cat.key ? 'default' : 'outline'}
                    onClick={() => setFilterCategory(cat.key)}
                    className="text-xs"
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rules List */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : filteredRules.length === 0 ? (
            <div className="bg-slate-900 rounded-lg border border-slate-700 p-12 text-center">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No rules found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRules.map((rule) => {
                const stats = {
                  total: rule.execution_count || 0,
                  success: rule.success_count || 0,
                  failure: rule.failure_count || 0,
                  rate: rule.execution_count > 0
                    ? (((rule.success_count || 0) / (rule.execution_count || 1)) * 100).toFixed(0)
                    : 0,
                };

                return (
                  <div key={rule.id} className="bg-slate-900 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {getTriggerIcon(rule.is_active)}
                          <h3 className="text-lg font-semibold text-white">{rule.rule_name}</h3>
                          <Badge className={`${getCategoryColor(rule.trigger_category)} text-white`}>
                            {rule.trigger_category.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Priority {rule.priority}
                          </Badge>
                        </div>

                        <p className="text-slate-400 text-sm mb-4">{rule.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-4">
                          <div>
                            <p className="text-slate-500">Trigger Event</p>
                            <p className="text-slate-300 font-mono">{rule.trigger_event.replace(/_/g, ' ')}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Action Type</p>
                            <p className="text-slate-300 font-mono">{rule.action_type.replace(/_/g, ' ')}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Cooldown</p>
                            <p className="text-slate-300">{rule.cooldown_hours}h</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Limit/User/Day</p>
                            <p className="text-slate-300">{rule.execution_limit_per_user}</p>
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-6 text-xs">
                          <div className="flex items-center gap-1 text-slate-400">
                            <TrendingUp className="w-4 h-4" />
                            <span>Executions: <span className="text-white font-semibold">{stats.total}</span></span>
                          </div>
                          <div className="flex items-center gap-1 text-green-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Success: <span className="font-semibold">{stats.success}</span></span>
                          </div>
                          <div className="flex items-center gap-1 text-red-400">
                            <AlertCircle className="w-4 h-4" />
                            <span>Failed: <span className="font-semibold">{stats.failure}</span></span>
                          </div>
                          {stats.total > 0 && (
                            <div className="flex items-center gap-1 text-blue-400">
                              <span>Success Rate: <span className="font-semibold">{stats.rate}%</span></span>
                            </div>
                          )}
                          {rule.last_executed_at && (
                            <div className="flex items-center gap-1 text-slate-400 ml-auto">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(rule.last_executed_at).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedRule(rule);
                            setShowModal(true);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleRuleMutation.mutate(rule)}
                          className={rule.is_active ? 'text-green-400' : 'text-slate-400'}
                        >
                          <Power className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Rule Detail Modal */}
      {showModal && (
        <RuleDetailModal
          rule={selectedRule}
          onClose={() => {
            setShowModal(false);
            setSelectedRule(null);
          }}
          onSave={() => {
            queryClient.invalidateQueries({ queryKey: ['automation_rules'] });
            setShowModal(false);
            setSelectedRule(null);
          }}
        />
      )}

      {/* Execution Log Modal */}
      {showLogs && (
        <RuleExecutionLog
          onClose={() => setShowLogs(false)}
        />
      )}
    </AdminLayout>
  );
}