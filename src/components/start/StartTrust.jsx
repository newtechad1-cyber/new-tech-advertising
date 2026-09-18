import { ShieldCheck, MessagesSquare, Users, Compass } from 'lucide-react';

const POINTS = [
  { icon: MessagesSquare, text: 'A real conversation—not a sales pitch or a complicated intake' },
  { icon: Users, text: 'Built around what the owner, team, and customers already know' },
  { icon: Compass, text: 'Help figuring out the next useful step—only if one makes sense' },
  { icon: ShieldCheck, text: 'No package to choose, nothing to buy just to talk' },
];

export default function StartTrust() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mt-6">
      <p className="text-white font-semibold text-sm mb-4">What to Expect</p>
      <ul className="space-y-3">
        {POINTS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-3 text-slate-400 text-sm">
            <Icon className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}