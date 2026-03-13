import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  TrendingUp,
  Zap,
  Clock,
  Target,
  Mail,
  Eye,
  Check,
  X,
} from 'lucide-react';

const SIGNAL_ICONS = {
  low_momentum_risk: AlertCircle,
  high_effort_low_execution: Zap,
  lead_momentum: TrendingUp,
  time_constraint_pattern: Clock,
  aggressive_growth_intent: Target,
  multi_signal_opportunity: Zap,
};

const SIGNAL_LABELS = {
  low_momentum_risk: 'Low Momentum Risk',
  high_effort_low_execution: 'High Effort / Low Execution',
  lead_momentum: 'Lead Momentum',
  time_constraint_pattern: 'Time Constraint Pattern',
  aggressive_growth_intent: 'Aggressive Growth Intent',
  multi_signal_opportunity: 'Multi-Signal Opportunity',
};

export default function AdminHotProspectsAlert() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('new');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const authUser = await base44.auth.me();
        if (!authUser || authUser.role !== 'admin') {
          navigate('/');
          return;
        }
        setUser(authUser);

        const query = filter === 'all' ? {} : { status: filter };
        const data = await base44.entities.HotProspectAlert.filter(
          query,
          '-readiness_score',
          100
        );
        setAlerts(data);
      } catch (error) {
        console.error('Error loading alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filter, navigate]);

  const handleStatusChange = async (alertId, newStatus) => {
    try {
      const updateData = { status: newStatus };
      if (newStatus === 'contacted') {
        updateData.contacted_date = new Date().toISOString().split('T')[0];
      } else if (newStatus === 'converted') {
        updateData.converted_date = new Date().toISOString().split('T')[0];
      }

      await base44.entities.HotProspectAlert.update(alertId, updateData);
      setAlerts(
        alerts.map((a) => (a.id === alertId ? { ...a, ...updateData } : a))
      );
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const handleAssign = async (alertId) => {
    try {
      await base44.entities.HotProspectAlert.update(alertId, {
        assigned_to: user.email,
        status: 'reviewed',
      });
      setAlerts(
        alerts.map((a) =>
          a.id === alertId
            ? { ...a, assigned_to: user.email, status: 'reviewed' }
            : a
        )
      );
    } catch (error) {
      console.error('Error assigning alert:', error);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-500/20 text-red-300 border-red-500/30',
      high: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      low: 'bg-slate-600 text-slate-300',
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-500/20 text-blue-300',
      reviewed: 'bg-slate-600 text-slate-300',
      contacted: 'bg-purple-500/20 text-purple-300',
      converted: 'bg-green-500/20 text-green-300',
      dismissed: 'bg-slate-700 text-slate-400',
    };
    return colors[status] || colors.new;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  const criticalAlerts = alerts.filter((a) => a.alert_priority === 'critical');
  const highAlerts = alerts.filter((a) => a.alert_priority === 'high');

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Hot Prospect Alerts</h1>
          <p className="text-slate-400">
            Automatically detected upgrade opportunities based on user behavior
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-sm text-slate-400 mb-1">New Alerts</div>
            <div className="text-3xl font-bold text-white">
              {alerts.filter((a) => a.status === 'new').length}
            </div>
          </div>
          <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
            <div className="text-sm text-red-300 mb-1">Critical Priority</div>
            <div className="text-3xl font-bold text-red-300">
              {criticalAlerts.length}
            </div>
          </div>
          <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/30">
            <div className="text-sm text-orange-300 mb-1">High Priority</div>
            <div className="text-3xl font-bold text-orange-300">
              {highAlerts.length}
            </div>
          </div>
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
            <div className="text-sm text-green-300 mb-1">Converted</div>
            <div className="text-3xl font-bold text-green-300">
              {alerts.filter((a) => a.status === 'converted').length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['new', 'reviewed', 'contacted', 'converted', 'all'].map((status) => (
            <Button
              key={status}
              onClick={() => setFilter(status)}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Alerts Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">
                    Signal Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">
                    Readiness
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">
                    Recommended Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => {
                  const SignalIcon = SIGNAL_ICONS[alert.signal_type] || AlertCircle;
                  return (
                    <tr
                      key={alert.id}
                      className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-white">
                            {alert.business_name}
                          </div>
                          <div className="text-sm text-slate-400">{alert.user_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <SignalIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-300">
                            {SIGNAL_LABELS[alert.signal_type]}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-32">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-300">
                              {alert.readiness_score}
                            </span>
                            <span className="text-xs text-slate-400">/100</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                              className={`h-full rounded-full transition-all ${
                                alert.readiness_score >= 70
                                  ? 'bg-green-500'
                                  : alert.readiness_score >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-slate-500'
                              }`}
                              style={{
                                width: `${Math.min(alert.readiness_score, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="capitalize">
                          {alert.recommended_plan?.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getPriorityColor(alert.alert_priority)}>
                          {alert.alert_priority}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {alert.status === 'new' && (
                            <Button
                              onClick={() => handleAssign(alert.id)}
                              size="sm"
                              variant="ghost"
                              title="Take ownership"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          {alert.status !== 'contacted' &&
                            alert.status !== 'converted' && (
                              <Button
                                onClick={() =>
                                  window.location.href = `mailto:${alert.user_email}?subject=NTA Upgrade Options`
                                }
                                size="sm"
                                variant="ghost"
                                title="Send email"
                              >
                                <Mail className="w-4 h-4" />
                              </Button>
                            )}
                          {alert.status === 'contacted' && (
                            <Button
                              onClick={() =>
                                handleStatusChange(alert.id, 'converted')
                              }
                              size="sm"
                              variant="ghost"
                              className="text-green-400"
                              title="Mark as converted"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {alerts.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              No alerts found for this filter
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}