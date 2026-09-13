
export default function BCTrustBar() {
  const principles = [
    { value: 'Learn', label: 'Use the questions and Guide before sharing contact information.' },
    { value: 'Choose', label: 'Call, text, email, chat, or schedule when it fits.' },
    { value: 'Clarify', label: 'Start with the question in front of your business.' },
    { value: 'Agree', label: 'Scope and price are clear before paid work begins.' },
  ];

  return (
    <section className="bg-gradient-to-r from-slate-900 to-slate-800 border-y border-slate-700/50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {principles.map((principle) => (
            <div key={principle.value} className="text-center">
              <p className="text-3xl font-black text-white mb-1">{principle.value}</p>
              <p className="text-slate-400 text-sm">{principle.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}