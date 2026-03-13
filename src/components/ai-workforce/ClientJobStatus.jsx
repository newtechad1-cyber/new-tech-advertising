import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Zap, CheckCircle2, AlertCircle, Pause, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientJobStatus({ clientId, compact = false }) {
  const { data: jobs = [] } = useQuery({
    queryKey: ['client_ai_jobs', clientId],
    queryFn: async () => {
      return await base44.entities.AIJobQueue.filter({
        client_id: clientId,
      });
    },
    refetchInterval: 3000, // Refresh every 3 seconds
  });

  const activeJobs = jobs.filter(j => ['queued', 'running'].includes(j.status));
  const completedToday = jobs.filter(
    j => j.status === 'completed' && 
    new Date(j.completed_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;

  if (compact) {
    // Minimal card for dashboard
    return (
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white text-sm">AI Generation</h3>
          {activeJobs.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-blue-400">
              <Zap className="w-3 h-3 animate-pulse" />
              {activeJobs.length} active
            </div>
          )}
        </div>

        {activeJobs.length > 0 ? (
          <div className="space-y-2">
            {activeJobs.slice(0, 2).map(job => (
              <div key={job.id} className="text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-3 h-3 text-blue-400 animate-pulse" />
                  <span className="text-slate-300">
                    {job.job_type.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded h-1.5">
                  <div
                    className="bg-blue-600 h-full rounded"
                    style={{ width: `${job.progress_percent || 20}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : completedToday > 0 ? (
          <p className="text-xs text-slate-400">
            ✓ {completedToday} completed today
          </p>
        ) : (
          <p className="text-xs text-slate-500">No active jobs</p>
        )}
      </div>
    );
  }

  // Full card view
  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 p-6">
      <h2 className="text-lg font-bold text-white mb-4">Content Generation Status</h2>

      <AnimatePresence>
        {activeJobs.length > 0 ? (
          <div className="space-y-4">
            {activeJobs.map(job => {
              const isRunning = job.status === 'running';
              const progress = job.progress_percent || 0;

              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-slate-800 rounded-lg p-4 border border-slate-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white text-sm">
                        {job.job_type.replace(/_/g, ' ')}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isRunning ? '🚀 In Progress' : '⏳ Waiting in queue'}
                      </p>
                    </div>
                    {isRunning && (
                      <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
                    )}
                  </div>

                  {isRunning && (
                    <>
                      <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ ease: 'easeInOut', duration: 0.5 }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 text-right">
                        {progress}% complete
                      </p>
                    </>
                  )}

                  {job.estimated_completion_time && (
                    <p className="text-xs text-slate-500 mt-2">
                      ETA: {new Date(job.estimated_completion_time).toLocaleTimeString()}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : completedToday > 0 ? (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mx-auto mb-3"
            >
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </motion.div>
            <p className="text-slate-300 text-sm">
              ✓ {completedToday} content pieces generated today
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Your content is ready to review and approve
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm">No active generation jobs</p>
            <p className="text-slate-500 text-xs mt-2">
              Your AI assistants are ready to create content when you need them
            </p>
          </div>
        )}
      </AnimatePresence>

      {jobs.filter(j => j.status === 'failed').length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-red-400 font-semibold mb-2">
            ⚠ {jobs.filter(j => j.status === 'failed').length} failed job(s)
          </p>
          {jobs.filter(j => j.status === 'failed').slice(0, 2).map(job => (
            <p key={job.id} className="text-xs text-red-300/70 mb-1">
              {job.job_type.replace(/_/g, ' ')}: {job.last_error?.substring(0, 40)}...
            </p>
          ))}
        </div>
      )}
    </div>
  );
}