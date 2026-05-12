import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { 
  Brain, AlertTriangle, CheckCircle2, Clock, 
  ChevronRight, RefreshCw, Zap, ShieldAlert,
  FileSignature, Search, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OpsAIMonitor() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [setups, setSetups] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cRes, sRes, agrRes, appRes, astRes] = await Promise.all([
        base44.entities.Client.list().catch(async () => await base44.entities.Clients.list()),
        base44.entities.ClientSetupStatus.list(),
        base44.entities.ClientAgreement.list(),
        base44.entities.ApprovalRequest.list(),
        base44.entities.ClientAsset.list()
      ]);
      setClients(cRes || []);
      setSetups(sRes || []);
      setAgreements(agrRes || []);
      setApprovals(appRes || []);
      setAssets(astRes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getClientRiskLevel = (client, setup, clientAgreements, clientApprovals, clientAssets) => {
    let riskScore = 0;
    const insights = [];
    const missingAssets = [];

    // Onboarding Risk
    if (!setup || setup.setup_status === 'Not Started') {
      riskScore += 40;
      insights.push("Onboarding has not started.");
    } else if (setup.setup_status === 'Waiting on Client') {
      riskScore += 20;
      insights.push("Stuck waiting for client input.");
    }

    // Agreement Risk
    const unsigned = clientAgreements.filter(a => a.status !== 'Signed' && a.status !== 'Completed');
    if (unsigned.length > 0) {
      riskScore += 30;
      insights.push(`${unsigned.length} unsigned agreement(s).`);
    }

    // Approval Risk
    const pendingApps = clientApprovals.filter(a => a.status.includes('Pending Client'));
    if (pendingApps.length > 2) {
      riskScore += 20;
      insights.push(`${pendingApps.length} items stuck awaiting client approval.`);
    }

    // Missing basic assets
    const logo = clientAssets.find(a => a.asset_type === 'Logo');
    if (!logo) missingAssets.push('Logo');
    
    if (missingAssets.length > 0) {
      riskScore += 10;
      insights.push(`Missing core assets: ${missingAssets.join(', ')}.`);
    }

    let riskLevel = 'Low';
    if (riskScore >= 40) riskLevel = 'High';
    else if (riskScore >= 20) riskLevel = 'Medium';

    return { riskLevel, riskScore, insights };
  };

  const getNextAction = (riskLevel, insights, setup, clientAgreements) => {
    if (clientAgreements.some(a => a.status !== 'Signed' && a.status !== 'Completed')) {
      return "Follow up on unsigned agreements";
    }
    if (!setup || setup.setup_status === 'Not Started') {
      return "Initiate Onboarding Workflow";
    }
    if (setup && setup.setup_status === 'Waiting on Client') {
      return "Send onboarding reminder to client";
    }
    if (insights.some(i => i.includes('awaiting client approval'))) {
      return "Send approval reminder digest";
    }
    return "Monitor progress";
  };

  const dashboardStats = {
    highRisk: 0,
    unsignedDocs: 0,
    pendingApprovals: 0,
    blockedOnboarding: 0
  };

  const analyzedClients = clients.map(client => {
    const clientSetup = setups.find(s => s.client_id === client.id);
    const clientAgreements = agreements.filter(a => a.client_id === client.id);
    const clientApprovals = approvals.filter(a => a.client_id === client.id);
    const clientAssets = assets.filter(a => a.client_id === client.id);

    const { riskLevel, insights } = getClientRiskLevel(client, clientSetup, clientAgreements, clientApprovals, clientAssets);
    
    if (riskLevel === 'High') dashboardStats.highRisk++;
    dashboardStats.unsignedDocs += clientAgreements.filter(a => a.status !== 'Signed' && a.status !== 'Completed').length;
    dashboardStats.pendingApprovals += clientApprovals.filter(a => a.status.includes('Pending')).length;
    if (clientSetup?.setup_status === 'Blocked' || clientSetup?.setup_status === 'Waiting on Client') {
      dashboardStats.blockedOnboarding++;
    }

    return {
      client,
      setup: clientSetup,
      riskLevel,
      insights,
      nextAction: getNextAction(riskLevel, insights, clientSetup, clientAgreements),
      pendingCount: clientApprovals.filter(a => a.status.includes('Pending')).length,
      unsignedCount: clientAgreements.filter(a => a.status !== 'Signed' && a.status !== 'Completed').length
    };
  }).sort((a, b) => {
    const riskMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return riskMap[b.riskLevel] - riskMap[a.riskLevel];
  });

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/20 rounded-xl border border-blue-500/30">
            <Brain className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white leading-tight">AI Operations Monitor</h1>
            <p className="text-sm text-slate-400 mt-0.5">Automated tracking of client health, deliverables, and roadblocks.</p>
          </div>
        </div>
        <button onClick={loadData} className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Global Alerts Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <span className="text-2xl font-black text-white">{dashboardStats.highRisk}</span>
          </div>
          <p className="text-sm font-semibold text-slate-300">High Risk Clients</p>
          <p className="text-xs text-slate-500 mt-1">Need immediate attention</p>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <FileSignature className="w-5 h-5 text-amber-400" />
            <span className="text-2xl font-black text-white">{dashboardStats.unsignedDocs}</span>
          </div>
          <p className="text-sm font-semibold text-slate-300">Unsigned Docs</p>
          <p className="text-xs text-slate-500 mt-1">Agreements pending signature</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span className="text-2xl font-black text-white">{dashboardStats.pendingApprovals}</span>
          </div>
          <p className="text-sm font-semibold text-slate-300">Pending Approvals</p>
          <p className="text-xs text-slate-500 mt-1">Content waiting for sign-off</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <span className="text-2xl font-black text-white">{dashboardStats.blockedOnboarding}</span>
          </div>
          <p className="text-sm font-semibold text-slate-300">Blocked Setup</p>
          <p className="text-xs text-slate-500 mt-1">Onboarding waiting on client</p>
        </div>
      </div>

      {/* Client List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center gap-2">
          <Zap className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Client Intelligence & Action Plan</h2>
        </div>
        <div className="divide-y divide-slate-800/50">
          {analyzedClients.map((data, idx) => (
            <div key={data.client.id || idx} className="p-5 hover:bg-slate-800/30 transition-colors flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              
              {/* Client Info */}
              <div className="w-full lg:w-1/4">
                <h3 className="text-lg font-bold text-white mb-1">{data.client.business_name}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    data.riskLevel === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                    data.riskLevel === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {data.riskLevel} Risk
                  </span>
                  <span className="text-xs text-slate-400">{data.setup?.onboarding_stage || 'No Setup'}</span>
                </div>
              </div>

              {/* Insights */}
              <div className="w-full lg:w-2/4 space-y-2">
                {data.insights.length > 0 ? (
                  data.insights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{insight}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-400">All systems nominal. No immediate issues detected.</span>
                  </div>
                )}
              </div>

              {/* Recommended Action */}
              <div className="w-full lg:w-1/4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">AI Recommended Action</p>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-blue-400">{data.nextAction}</p>
                  <Link 
                    to={`/c/${data.client.id}`} 
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                  >
                    View Portal <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>
          ))}

          {analyzedClients.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <Search className="w-8 h-8 text-slate-700 mx-auto mb-3" />
              <p>No clients found to analyze.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}