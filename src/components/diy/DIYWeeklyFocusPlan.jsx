import React, { useState } from 'react';
import { CheckCircle2, Circle, Star } from 'lucide-react';
import { generateWeeklyFocusPlan } from './ntaRetentionEngine';

export default function DIYWeeklyFocusPlan({ metrics, subscription }) {
  const [completedTasks, setCompletedTasks] = useState([]);

  if (!metrics) return null;

  const tasks = generateWeeklyFocusPlan(metrics, subscription);
  const completionRate = Math.round((completedTasks.length / tasks.length) * 100);

  const handleToggleTask = (taskId) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter((id) => id !== taskId));
    } else {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  const highPriorityTasks = tasks.filter((t) => t.priority === 'high');
  const normalTasks = tasks.filter((t) => t.priority !== 'high');

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-white text-lg">Weekly Focus Plan</h3>
          <p className="text-sm text-slate-400 mt-1">Recommended tasks for this week</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-violet-400">{completionRate}%</div>
          <div className="text-xs text-slate-400">Completed</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-2 mb-6 overflow-hidden">
        <div
          className="h-full bg-violet-600 transition-all"
          style={{ width: `${completionRate}%` }}
        />
      </div>

      {/* High Priority Tasks */}
      {highPriorityTasks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300">HIGH PRIORITY</span>
          </div>
          <div className="space-y-2">
            {highPriorityTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isCompleted={completedTasks.includes(task.id)}
                onToggle={() => handleToggleTask(task.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Normal Tasks */}
      {normalTasks.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-3">THIS WEEK</div>
          <div className="space-y-2">
            {normalTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isCompleted={completedTasks.includes(task.id)}
                onToggle={() => handleToggleTask(task.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskItem({ task, isCompleted, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left ${
        isCompleted
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
      }`}
    >
      {/* Checkbox */}
      <div className="flex-shrink-0 mt-1">
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        ) : (
          <Circle className="w-5 h-5 text-slate-500" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4
          className={`font-semibold text-sm ${
            isCompleted ? 'text-slate-400 line-through' : 'text-white'
          }`}
        >
          {task.title}
        </h4>
        <p className="text-xs text-slate-400 mt-0.5">{task.description}</p>
      </div>

      {/* Points */}
      <div className="flex-shrink-0 text-right">
        <div className={`text-xs font-semibold ${
          isCompleted ? 'text-green-400' : 'text-slate-400'
        }`}>
          +{task.points}
        </div>
        <div className="text-xs text-slate-500">pts</div>
      </div>
    </button>
  );
}