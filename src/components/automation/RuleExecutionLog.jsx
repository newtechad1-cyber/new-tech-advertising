import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckCircle2,
  AlertCircle,
  X,
  Download,
  Search,
  Calendar,
} from 'lucide-react';

export default function RuleExecutionLog({ onClose }) {
  const [filterRule, setFilterRule] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['automation_logs', filterRule, filterStatus],
    queryFn: async () => {
      const query = {};
      if (filterRule !== 'all') query.rule_id = filterRule;
      if (filterStatus !== 'all') query.status = filterStatus;
      return await base44.entities.AutomationRuleLog?.list?.('-executed_at', 500) || [];
    },
  });

  const { data: rules = [] } = useQuery({
    queryKey: ['automation_rules_list'],
    queryFn: async () => {
      return await base44.entities.AutomationRule.list('', 100);
    },
  });

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.rule_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !dateFrom || 
      new Date(log.executed_at) >= new Date(dateFrom);
    
    return matchesSearch && matchesDate;
  });

  const exportLogs = () => {
    const csv = [
      ['Rule', 'Entity ID', 'Status', 'Executed At', 'Error'].join(','),
      ...filteredLogs.map(log => [
        log.rule_name,
        log.entity_id,
        log.status,
        new Date(log.executed_at).toLocaleString(),
        log.error || '',
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `automation-logs-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Automation Execution Log</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="bg-slate-850 border-b border-slate-700 p-4 space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by rule or entity ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRule} onValueChange={setFilterRule}>
              <SelectTrigger className="w-[200px] bg-slate-800 border-slate-700">
                <SelectValue placeholder="All Rules" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Rules</SelectItem>
                {rules.map(rule => (
                  <SelectItem key={rule.id} value={rule.id}>
                    {rule.rule_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="pl-10 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm"
              />
            </div>

            <Button
              onClick={exportLogs}
              variant="outline"
              className="border-slate-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-400">No logs found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-800 sticky top-0 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold w-[200px]">Rule</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold w-[150px]">Entity ID</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold w-[100px]">Status</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">Executed At</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">Error</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, idx) => (
                  <tr key={idx} className="border-b border-slate-700 hover:bg-slate-800/50">
                    <td className="px-4 py-3 text-white">
                      <span className="font-mono text-xs">{log.rule_name}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <span className="font-mono text-xs">{log.entity_id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {log.status === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : log.status === 'failed' ? (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                        )}
                        <span className="capitalize text-white font-semibold">{log.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(log.executed_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {log.error ? (
                        <span className="text-red-400" title={log.error}>
                          {log.error.substring(0, 50)}...
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-800 border-t border-slate-700 px-6 py-4 flex justify-between items-center">
          <p className="text-slate-400 text-sm">
            Showing {filteredLogs.length} of {logs.length} logs
          </p>
          <Button onClick={onClose} variant="outline" className="border-slate-700">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}