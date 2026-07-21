import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ArticleRenderer({ content, className = '' }) {
  return (
    <div className={`
      max-w-[780px] mx-auto w-full
      text-[17px] md:text-[19px] leading-[1.75] text-slate-300
      prose prose-invert max-w-none
      prose-p:mb-[1.5em] prose-p:leading-[1.75]
      prose-headings:font-black prose-headings:text-white
      prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:mt-12 prose-h1:mb-8 [&>h1]:break-after-avoid
      prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-14 prose-h2:mb-6 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-4 [&>h2]:break-after-avoid
      prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-10 prose-h3:mb-4 [&>h3]:break-after-avoid
      prose-h4:text-xl md:prose-h4:text-2xl prose-h4:mt-8 prose-h4:mb-4 [&>h4]:break-after-avoid
      prose-ul:pl-6 prose-ul:mb-8 prose-ul:list-disc
      prose-ol:pl-6 prose-ol:mb-8 prose-ol:list-decimal
      prose-li:my-2 prose-li:pl-2 prose-li:leading-[1.7]
      prose-blockquote:bg-slate-800/50 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:py-5 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:my-10 prose-blockquote:not-italic prose-blockquote:text-slate-200
      prose-a:text-blue-400 prose-a:underline hover:prose-a:text-blue-300 hover:prose-a:no-underline
      prose-strong:text-white prose-strong:font-bold
      pb-12
      ${className}
    `}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}