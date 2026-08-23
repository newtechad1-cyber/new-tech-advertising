import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

const FINAL_TASK_STATUSES = new Set(['SUCCEEDED', 'FAILED', 'CANCELED']);

function unwrap(response) {
  return response?.data ?? response;
}

function formatTimestamp(value) {
  return typeof value === 'number'
    ? new Date(value).toLocaleString()
    : '—';
}

function taskLabel(task) {
  const id = String(task?.id || '');
  return id ? id.slice(0, 12) + '…' : 'Unknown task';
}

export default function MeshyConnectionConsole() {
  const { user, isLoadingAuth, navigateToLogin } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [status, setStatus] = useState(null);
  const [selectedRigId, setSelectedRigId] = useState('');
  const [selectedBehavior, setSelectedBehavior] = useState('hello');
  const [activeTask, setActiveTask] = useState(null);
  const [rigAsset, setRigAsset] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingRigAsset, setLoadingRigAsset] = useState(false);
  const [startingAnimation, setStartingAnimation] = useState(false);
  const [error, setError] = useState('');

  const rigCandidates = Array.isArray(status?.rig_candidates) ? status.rig_candidates : [];
  const approvedActions = Array.isArray(status?.approved_actions) ? status.approved_actions : [];
  const recentAnimations = Array.isArray(status?.recent_animation_tasks)
    ? status.recent_animation_tasks
    : [];

  const selectedAction = useMemo(
    () => approvedActions.find(action => action.behavior === selectedBehavior),
    [approvedActions, selectedBehavior],
  );

  async function invoke(action, payload = {}) {
    const response = await base44.functions.invoke('meshyApiStatus', { action, ...payload });
    return unwrap(response);
  }

  async function refreshStatus() {
    setLoadingStatus(true);
    setError('');

    try {
      const result = await invoke('status');
      setStatus(result);

      const candidates = Array.isArray(result?.rig_candidates) ? result.rig_candidates : [];
      setSelectedRigId(current => (
        candidates.some(candidate => candidate.id === current)
          ? current
          : (candidates[0]?.id || '')
      ));

      const actions = Array.isArray(result?.approved_actions) ? result.approved_actions : [];
      setSelectedBehavior(current => (
        actions.some(action => action.behavior === current)
          ? current
          : (actions[0]?.behavior || '')
      ));

      if (!result?.ok) {
        setError(result?.error || 'Meshy did not return a successful status result.');
      }
    } catch (caught) {
      setError(caught?.message || 'Meshy status check failed.');
    } finally {
      setLoadingStatus(false);
    }
  }

  async function prepareRigAsset() {
    if (!selectedRigId || loadingRigAsset) return;

    setLoadingRigAsset(true);
    setError('');

    try {
      const result = await invoke('get_rig_asset', { rig_task_id: selectedRigId });
      if (!result?.ok || !result?.rig?.rigged_character_glb_url) {
        throw new Error(result?.error || 'Meshy did not return the selected rig GLB.');
      }
      setRigAsset(result.rig);
    } catch (caught) {
      setError(caught?.message || 'Could not prepare the source rig download.');
    } finally {
      setLoadingRigAsset(false);
    }
  }

  async function startAnimation() {
    if (!selectedRigId || !selectedBehavior || startingAnimation) return;

    const actionName = selectedAction?.name || selectedBehavior;
    const confirmed = window.confirm(
      'Start ' + actionName + '? This sends one paid Meshy animation request for the selected Free AI Guy rig.',
    );
    if (!confirmed) return;

    setStartingAnimation(true);
    setError('');

    try {
      const result = await invoke('start_animation', {
        rig_task_id: selectedRigId,
        behavior: selectedBehavior,
      });

      if (!result?.ok || !result?.task_id) {
        throw new Error(result?.error || 'Meshy did not return an animation task ID.');
      }

      setActiveTask({
        id: result.task_id,
        status: result.status || 'PENDING',
        behavior: result.behavior,
        action: result.action,
      });
    } catch (caught) {
      setError(caught?.message || 'Could not start the Meshy animation.');
    } finally {
      setStartingAnimation(false);
    }
  }

  useEffect(() => {
    if (isAdmin) refreshStatus();
  }, [isAdmin]);

  useEffect(() => {
    if (!activeTask?.id || FINAL_TASK_STATUSES.has(activeTask.status)) return undefined;

    let cancelled = false;

    async function pollTask() {
      try {
        const result = await invoke('get_animation', {
          animation_task_id: activeTask.id,
        });

        if (!cancelled && result?.animation) {
          setActiveTask(result.animation);
          if (FINAL_TASK_STATUSES.has(result.animation.status)) {
            refreshStatus();
          }
        }
      } catch (caught) {
        if (!cancelled) {
          setError(caught?.message || 'Could not refresh the Meshy animation task.');
        }
      }
    }

    pollTask();
    const timer = window.setInterval(pollTask, 6000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [activeTask?.id, activeTask?.status]);

  if (isLoadingAuth) {
    return <main className="min-h-screen bg-slate-950 p-8 text-white">Checking admin access…</main>;
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-8">
          <h1 className="text-2xl font-bold">Meshy Admin Tools</h1>
          <p className="mt-3 text-slate-300">
            Sign in with the NTA administrator account to run the Free AI Guy animation workflow.
          </p>
          <button
            className="mt-6 rounded bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500"
            onClick={navigateToLogin}
          >
            Sign in
          </button>
        </div>
      </main>
    );
  }

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Admin-only</p>
          <h1 className="mt-2 text-3xl font-bold">Free AI Guy — Meshy Motion Console</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            This console uses the stored server-side key. It shows only completed rig candidates and the approved
            website-guide motions. The key is never displayed.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Connection and available rigs</h2>
              <p className="mt-1 text-sm text-slate-400">
                {status
                  ? (status.meshy_authenticated
                    ? 'Meshy authentication is responding.'
                    : 'Meshy authentication needs attention.')
                  : 'Run the status check to read the secure server-side result.'}
              </p>
            </div>
            <button
              className="rounded border border-blue-400 px-4 py-2 text-sm font-medium text-blue-200 hover:bg-blue-400/10 disabled:opacity-50"
              disabled={loadingStatus}
              onClick={refreshStatus}
            >
              {loadingStatus ? 'Checking…' : 'Refresh status'}
            </button>
          </div>

          {status && (
            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-lg bg-slate-800 p-3">
                <dt className="text-slate-400">Rigging endpoint</dt>
                <dd className="mt-1 font-semibold">{status.endpoint_status?.rigging ?? '—'}</dd>
              </div>
              <div className="rounded-lg bg-slate-800 p-3">
                <dt className="text-slate-400">Animation endpoint</dt>
                <dd className="mt-1 font-semibold">{status.endpoint_status?.animations ?? '—'}</dd>
              </div>
              <div className="rounded-lg bg-slate-800 p-3">
                <dt className="text-slate-400">Completed rig candidates</dt>
                <dd className="mt-1 font-semibold">{rigCandidates.length}</dd>
              </div>
            </dl>
          )}

          {error && (
            <p className="mt-5 rounded-lg border border-rose-500/60 bg-rose-950/30 p-3 text-sm text-rose-200">
              {error}
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Create one approved motion</h2>
          <p className="mt-1 text-sm text-slate-400">
            No motion is created until you click the button below. Each request uses Meshy animation credits.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium">
              Completed Free AI Guy rig
              <select
                className="mt-2 w-full rounded border border-slate-600 bg-slate-800 p-3 text-white disabled:opacity-50"
                value={selectedRigId}
                onChange={event => {
                  setSelectedRigId(event.target.value);
                  setRigAsset(null);
                }}
                disabled={!rigCandidates.length}
              >
                {!rigCandidates.length && <option value="">No completed rig returned yet</option>}
                {rigCandidates.map(rig => (
                  <option key={rig.id} value={rig.id}>
                    {taskLabel(rig)} · completed {formatTimestamp(rig.finished_at)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium">
              Website-guide behavior
              <select
                className="mt-2 w-full rounded border border-slate-600 bg-slate-800 p-3 text-white disabled:opacity-50"
                value={selectedBehavior}
                onChange={event => setSelectedBehavior(event.target.value)}
                disabled={!approvedActions.length}
              >
                {approvedActions.map(action => (
                  <option key={action.behavior} value={action.behavior}>
                    {action.behavior.replace('_', ' ')} · {action.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              className="rounded border border-emerald-400 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-400/10 disabled:opacity-50"
              disabled={!selectedRigId || loadingRigAsset}
              onClick={prepareRigAsset}
            >
              {loadingRigAsset ? 'Preparing source rig…' : 'Prepare source rig GLB'}
            </button>
            {rigAsset?.rigged_character_glb_url && (
              <a
                className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500"
                href={rigAsset.rigged_character_glb_url}
                rel="noreferrer"
                target="_blank"
              >
                Download selected source rig GLB
              </a>
            )}
          </div>
          <p className="mt-3 text-xs text-slate-400">
            This is a read-only download for material and texture inspection; it does not regenerate or change Free AI Guy.
          </p>

          <button
            className="mt-5 rounded bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!selectedRigId || !selectedBehavior || startingAnimation}
            onClick={startAnimation}
          >
            {startingAnimation ? 'Starting Meshy task…' : 'Start selected motion'}
          </button>
        </section>

        {activeTask && (
          <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Current animation task</h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-slate-400">Task</dt>
                <dd className="mt-1 font-medium">{taskLabel(activeTask)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Status</dt>
                <dd className="mt-1 font-medium">{activeTask.status || '—'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Progress</dt>
                <dd className="mt-1 font-medium">
                  {typeof activeTask.progress === 'number' ? activeTask.progress + '%' : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Completed</dt>
                <dd className="mt-1 font-medium">{formatTimestamp(activeTask.finished_at)}</dd>
              </div>
            </dl>

            {activeTask.task_error && (
              <p className="mt-4 rounded-lg border border-rose-500/60 bg-rose-950/30 p-3 text-sm text-rose-200">
                {activeTask.task_error}
              </p>
            )}

            {activeTask.animation_glb_url && (
              <a
                className="mt-5 inline-flex rounded bg-emerald-600 px-4 py-2 font-medium hover:bg-emerald-500"
                href={activeTask.animation_glb_url}
                rel="noreferrer"
                target="_blank"
              >
                Download animation GLB
              </a>
            )}
          </section>
        )}

        {!!recentAnimations.length && (
          <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Recent API animation tasks</h2>
            <ul className="mt-4 divide-y divide-slate-700 text-sm">
              {recentAnimations.map(task => (
                <li className="flex flex-wrap items-center justify-between gap-2 py-3" key={task.id}>
                  <span>{taskLabel(task)}</span>
                  <span className="text-slate-400">
                    {task.status || 'Unknown'} · {formatTimestamp(task.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
