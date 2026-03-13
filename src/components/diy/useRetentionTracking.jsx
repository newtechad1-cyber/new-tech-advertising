import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  calculateGrowthScore,
  calculateGrowthTrend,
  calculateStreak,
  detectMilestones,
  calculateRetentionHealth,
} from './ntaRetentionEngine';

/**
 * Hook to track retention metrics and trigger celebrations
 */
export const useRetentionTracking = (subscription) => {
  const [metrics, setMetrics] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!subscription?.id) return;

    const loadMetrics = async () => {
      try {
        setLoading(true);

        // Fetch or create retention metrics
        let metricsList = await base44.entities.ClientRetentionMetrics.filter(
          { subscription_id: subscription.id },
          '-created_date',
          1
        );

        let currentMetrics;

        if (metricsList.length === 0) {
          // First time - create metrics
          currentMetrics = await base44.entities.ClientRetentionMetrics.create({
            subscription_id: subscription.id,
            user_email: subscription.user_email,
            streak_days: 0,
            streak_weeks: 0,
            growth_score_history: JSON.stringify([
              {
                date: new Date().toISOString().split('T')[0],
                score: 0,
              },
            ]),
          });
        } else {
          currentMetrics = metricsList[0];
        }

        // Calculate growth score
        const growthScore = calculateGrowthScore(currentMetrics);
        let scoreHistory = [];
        try {
          scoreHistory = JSON.parse(currentMetrics.growth_score_history || '[]');
        } catch {
          scoreHistory = [];
        }

        // Add today's score to history
        const today = new Date().toISOString().split('T')[0];
        const lastEntry = scoreHistory[scoreHistory.length - 1];
        if (!lastEntry || lastEntry.date !== today) {
          scoreHistory.push({ date: today, score: growthScore });
          // Keep last 30 days
          scoreHistory = scoreHistory.slice(-30);
        }

        const growthTrend = calculateGrowthTrend(scoreHistory);

        // Calculate streak
        const streakInfo = calculateStreak(
          currentMetrics.last_active_date,
          currentMetrics.streak_days,
          currentMetrics.streak_weeks
        );

        // Calculate inactive days
        const today_date = new Date();
        const lastActive = currentMetrics.last_active_date
          ? new Date(currentMetrics.last_active_date)
          : null;
        const inactiveDays = lastActive
          ? Math.floor((today_date - lastActive) / (1000 * 60 * 60 * 24))
          : 0;

        // Calculate days since signup
        const signupDate = new Date(subscription.created_date_custom || subscription.created_date);
        const daysSinceSignup = Math.floor((today_date - signupDate) / (1000 * 60 * 60 * 24));

        // Calculate retention health
        const retentionHealth = calculateRetentionHealth({
          ...currentMetrics,
          growth_score: growthScore,
          inactive_days: inactiveDays,
          streak_weeks: streakInfo.streakWeeks,
        });

        // Prepare updated metrics
        const updatedMetrics = {
          ...currentMetrics,
          growth_score: growthScore,
          growth_score_history: JSON.stringify(scoreHistory),
          growth_trend: growthTrend,
          inactive_days: inactiveDays,
          days_since_signup: daysSinceSignup,
          retention_health_score: retentionHealth,
          ...streakInfo,
        };

        // Detect milestones
        const newMilestones = detectMilestones(updatedMetrics, currentMetrics);
        setMilestones(newMilestones);

        // Update metrics in database
        if (currentMetrics.id) {
          await base44.entities.ClientRetentionMetrics.update(
            currentMetrics.id,
            {
              growth_score: growthScore,
              growth_score_history: JSON.stringify(scoreHistory),
              growth_trend: growthTrend,
              inactive_days: inactiveDays,
              days_since_signup: daysSinceSignup,
              retention_health_score: retentionHealth,
              streak_days: streakInfo.streakDays,
              streak_weeks: streakInfo.streakWeeks,
              ...Object.fromEntries(
                newMilestones
                  .filter((m) => m.type.startsWith('milestone_'))
                  .map((m) => [
                    `milestone_${m.type}`,
                    true,
                  ])
              ),
            }
          );
        }

        setMetrics(updatedMetrics);
        setError(null);
      } catch (err) {
        console.error('Error tracking retention:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [subscription?.id]);

  return {
    metrics,
    milestones,
    loading,
    error,
  };
};