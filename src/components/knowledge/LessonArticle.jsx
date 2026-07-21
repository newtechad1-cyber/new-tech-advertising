import ReactMarkdown from 'react-markdown';

const WORD_TARGET = 58;
const wordCount = (value) => value.trim().split(/\s+/).filter(Boolean).length;
const isStructuralLine = (line) => /^(#{1,6}\s|[-*+]\s|\d+\.\s|>\s|```|~~~|(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})/.test(line.trim());

// Rejoin sentence fragments from older lessons while preserving Markdown structure.
export function reflowLessonMarkdown(markdown = '') {
  const lines = markdown.trim().split(/\r?\n/);
  const output = [];
  let prose = [];
  let proseWords = 0;
  const flush = () => {
    if (!prose.length) return;
    output.push(prose.join(' '));
    prose = [];
    proseWords = 0;
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    const nextLine = lines.slice(index + 1).find(candidate => candidate.trim())?.trim() || '';
    if (!line) return;
    if (isStructuralLine(line)) {
      flush();
      const previous = output.at(-1) || '';
      const isListItem = /^(?:[-*+]\s|\d+\.\s)/.test(line);
      const followsListItem = /(?:^|\n)(?:[-*+]\s|\d+\.\s)/.test(previous);
      if (isListItem && followsListItem) {
        output[output.length - 1] = `${previous}\n${line}`;
      } else {
        output.push(line);
      }
      return;
    }
    prose.push(line);
    proseWords += wordCount(line);
    if ((/[:：]$/.test(line) && isStructuralLine(nextLine)) || proseWords >= WORD_TARGET || wordCount(line) >= 90) flush();
  });
  flush();
  return output.join('\n\n');
}

export default function LessonArticle({ content, accent = 'blue', className = '' }) {
  const accentOptions = {
    emerald: 'prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-li:marker:text-emerald-400',
    purple: 'prose-a:text-purple-400 hover:prose-a:text-purple-300 prose-li:marker:text-purple-400',
    blue: 'prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-li:marker:text-blue-400',
  };
  const accents = accentOptions[accent] || accentOptions.blue;
  return (
    <article className={`prose prose-invert prose-lg max-w-none text-[1.075rem] md:text-[1.125rem] ${accents} ${className}`}>
      <ReactMarkdown components={{
        h2: ({ children }) => <h2 className="mt-16 mb-6 text-3xl font-black leading-tight text-white">{children}</h2>,
        h3: ({ children }) => <h3 className="mt-14 mb-5 text-2xl font-bold leading-tight text-white">{children}</h3>,
        p: ({ children }) => <p className="mb-7 leading-8 text-slate-300">{children}</p>,
        ul: ({ children }) => <ul className="my-8 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/55 px-6 py-5 text-slate-300">{children}</ul>,
        ol: ({ children }) => <ol className="my-8 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/55 px-6 py-5 text-slate-300">{children}</ol>,
        li: ({ children }) => <li className="pl-2 leading-7">{children}</li>,
        blockquote: ({ children }) => <blockquote className="my-8 rounded-r-xl border-l-4 border-blue-500 bg-blue-950/25 px-6 py-4 text-slate-200">{children}</blockquote>,
        hr: () => <hr className="my-14 border-slate-700" />,
        strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
      }}>{reflowLessonMarkdown(content)}</ReactMarkdown>
    </article>
  );
}
