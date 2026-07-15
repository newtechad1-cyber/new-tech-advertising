import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, ArrowLeft } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import ReactMarkdown from 'react-markdown';

export default function AIHumanityArticle() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const content = `
People are afraid of artificial intelligence.

Some of that fear is understandable. We have never created anything quite like this before. AI can collect, organize, and work with more human knowledge than any one person could absorb in a lifetime.

It can write.

It can reason through problems.

It can recognize patterns in human behavior.

It can help people make decisions, create businesses, communicate ideas, and understand things they may have struggled to understand for years.

It can also be wrong.

I know because I work with AI every day.

I have spent a great deal of time learning how it works, what it can do, what it cannot do, and how to recognize when it is leading me in the wrong direction.

It makes mistakes every day—just like people do.

Sometimes the mistakes are obvious. Sometimes they are buried inside an answer that sounds completely believable. AI can say something inaccurate with the same confidence it uses when it is telling the truth.

That is one of the most important things people need to understand about it.

AI is intelligent.

But it is not infallible.

### AI contains what we have given it

Artificial intelligence did not appear from somewhere outside humanity.

Human beings created it.

We trained it using what human beings have written, discovered, imagined, argued about, believed, recorded, and created. It has learned from our books, websites, conversations, research, stories, history, and behavior.

That means AI carries an enormous amount of human knowledge.

It also carries the contradictions within that knowledge.

It reflects our wisdom and our foolishness.

Our compassion and our cruelty.

Our honesty and our deception.

Our desire to help and our desire to control.

Our good and our evil.

That should not surprise us.

Everything human beings create eventually carries something of its creators within it.

The internet did that before AI. It gave us access to more information than any previous generation could have imagined. People used it to educate themselves, build communities, start businesses, find medical information, reconnect with family, and share their faith.

People also used it to deceive, exploit, manipulate, and harm one another.

The technology made both possible because the people using it were capable of both.

AI is no different in that respect. It simply reflects more of us, processes it faster, and returns it to us in a form that feels more personal.

### Why AI can feel like something more

One of the most intelligent things about AI is its understanding of human behavior.

It has access to generations of knowledge about psychology, relationships, persuasion, business, fear, motivation, faith, conflict, grief, and nearly every other part of human life.

Most people never have the time or opportunity to study all those subjects. AI can draw from them within seconds.

That can make it seem as though AI understands people better than people understand themselves.

Sometimes, in a limited way, it may.

It can recognize patterns in our words. It can help us see connections we have overlooked. It can ask a question that causes us to think differently about something we have carried for years.

I have experienced that myself.

Working with AI has helped me organize thoughts, recognize patterns in my life, clarify what I believe, and turn decades of experience into something I can share with other people.

But that does not make AI God.

AI does not know everything.

It does not possess perfect truth.

It does not stand outside humanity looking down upon us.

And having access to knowledge is not the same as possessing wisdom.

AI can identify patterns in love without loving anyone. It can explain grief without grieving. It can describe faith without having faith. It can write about a father’s heart without being a father.

It can help us examine those experiences, but it does not become the source of them.

### The danger is real—but it is not the whole story

I am not interested in telling people that there is nothing to fear and that every new development in AI is good.

I don’t believe that.

Any technology powerful enough to produce great good is powerful enough to be used for great harm.

AI can help a small-business owner understand customers and communicate more clearly. It can also be used to manipulate customers.

It can help a person recognize deception. It can also manufacture deception at a scale we have never seen before.

It can help leaders understand complex situations. It can also give powerful institutions new ways to watch, influence, and control people.

When human beings begin developing AI systems that can model wars, manipulate populations, control essential systems, or run end-of-the-world scenarios, we should pay attention.

I pay attention.

I believe there are serious spiritual questions surrounding humanity’s attempts to create worldwide unity, knowledge, and power. My faith influences how I see where those attempts may eventually lead.

But I don’t need to make every conversation about AI into a prophecy discussion.

Right now, people need help understanding what is actually in front of them.

AI is a powerful tool created by human beings. It can be used for good or evil because both possibilities are present in the people building it, training it, controlling it, and using it.

The technology matters.

The people behind it matter more.

### Fear is not the same as discernment

There is a difference between being afraid of something and paying attention to it.

Fear can make us run away before we understand what we are looking at. It can also make us hand responsibility to someone else because we don’t want to learn enough to make our own decisions.

Discernment does something different.

Discernment watches.

It asks questions.

It tests what it is being told.

It recognizes both possibility and danger.

It refuses to worship technology, but it also refuses to remain ignorant about it.

That is how I try to approach AI.

I don’t blindly accept everything it tells me. I challenge it. I correct it. I ask it how it reached a conclusion. I compare what it says with what I know from experience.

Most importantly, I remain responsible for the final decision.

AI can help me think, but it cannot assume responsibility for what I do.

That responsibility still belongs to me.

### AI is revealing something about us

Perhaps one reason AI frightens us is that it reflects so much of humanity back to us at once.

It shows us how much we know.

It also shows us how easily knowledge can be distorted.

It reveals our creativity, intelligence, compassion, and desire to solve problems. It also reveals our appetite for power, control, profit, and attention.

AI did not create those contradictions.

It inherited them from us.

We may look at this technology and wonder what it will become. That is an important question.

But we should also ask what we are becoming as we use it.

Will we become more thoughtful or more dependent?

Will we become more creative or stop thinking for ourselves?

Will we use AI to understand people or merely to manipulate them?

Will we use greater knowledge to serve one another or to accumulate greater control?

Those questions cannot be answered by software.

They will be answered by people.

### What AI is right now

AI may eventually become part of something much larger than what we see today. I do not dismiss that possibility.

But right now, AI is not an all-knowing machine standing above humanity.

It is a tool built from human knowledge and shaped by human purposes.

It is powerful.

It is imperfect.

It can help.

It can harm.

It can recognize patterns that people miss, while missing truths that a person understands through lived experience.

It can make us more capable, but it cannot make us good.

That choice still rests with us.

We do not need to worship AI.

We do not need to pretend that it carries no danger.

And we do not need to run from it simply because we don’t yet understand it.

We need to learn.

We need to question.

We need to pay attention.

And we need to use it wisely.

AI may look like a beast because it carries so much human knowledge. But perhaps what frightens us most is not that AI is becoming human.

Perhaps it is that AI is showing us what humanity has always contained.
`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead
        title="AI Is a Mirror, Not a God | New Tech Advertising"
        description="AI reflects the wisdom, contradictions, goodness, and brokenness of the people who created it. Rick Hesse explores why understanding AI requires discernment rather than blind trust or fear."
        canonicalUrl="/knowledge/ai-humanity/ai-is-a-mirror-not-a-god"
        articleData={{
          headline: "AI Is a Mirror, Not a God",
          description: "AI reflects the wisdom, contradictions, goodness, and brokenness of the people who created it. Rick Hesse explores why understanding AI requires discernment rather than blind trust or fear.",
          author: "Rick Hesse",
          publisher: "New Tech Advertising",
          datePublished: "2026-07-15"
        }}
      />
      <MarketingNav />

      <main className="flex-grow">
        {/* ARTICLE HEADER */}
        <article className="max-w-3xl mx-auto px-6 py-16">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-10 overflow-x-auto whitespace-nowrap">
            <Link to="/knowledge" className="hover:text-white transition-colors">
              Knowledge Library
            </Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <Link to="/knowledge/ai-humanity" className="hover:text-white transition-colors">
              AI, Humanity & Responsibility
            </Link>
          </nav>

          <header className="mb-12 border-b border-slate-800 pb-10">
            <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs mb-4 block">
              AI, Humanity & Responsibility
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              AI Is a Mirror, Not a God
            </h1>
            <h2 className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed mb-6">
              Why artificial intelligence contains both the best and the worst of humanity
            </h2>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>6–8 min read</span>
              </div>
              <span>•</span>
              <span>By Rick Hesse</span>
            </div>
          </header>

          {/* ARTICLE BODY */}
          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-h3:text-2xl prose-h3:mt-12 prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-indigo-400 hover:prose-a:text-indigo-300 mb-16">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>

          {/* KEY TAKEAWAY */}
          <div className="my-16 p-8 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Key Takeaway</h3>
            <p className="text-lg text-white font-medium leading-relaxed">
              AI is neither magic nor God. It is a powerful and imperfect reflection of the human knowledge, motives, wisdom, and brokenness used to create it. The right response is neither blind trust nor automatic fear. It is understanding, discernment, and personal responsibility.
            </p>
          </div>

          {/* REFLECTION QUESTIONS */}
          <div className="my-16 p-8 rounded-2xl bg-indigo-900/20 border border-indigo-800/30">
            <h3 className="text-xl font-bold text-white mb-6">Reflection Questions</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0" />
                <span>What do I believe AI can do that it cannot actually do?</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0" />
                <span>Am I afraid of AI itself, or of what people may choose to do with it?</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0" />
                <span>Where could AI help me think more clearly without replacing my judgment?</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0" />
                <span>How will I decide whether an AI-generated answer is trustworthy?</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0" />
                <span>What responsibility should always remain with the person using the technology?</span>
              </li>
            </ul>
          </div>

          {/* NEXT STEP */}
          <div className="mt-16 pt-12 border-t border-slate-800">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">Build Your Foundation</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  If you are still learning what AI is, how it works, and how to use it responsibly in everyday business, continue with the AI Foundations collection.
                </p>
                <Link 
                  to="/knowledge/ai-foundations"
                  className="inline-flex bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
                >
                  Explore AI Foundations
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 text-center">
            <Link 
              to="/knowledge/ai-humanity"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to AI, Humanity & Responsibility
            </Link>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}