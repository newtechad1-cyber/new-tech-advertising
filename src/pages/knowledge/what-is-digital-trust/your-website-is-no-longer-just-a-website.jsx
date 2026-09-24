// Generated native lesson page. Source content: src/data/masterCurriculum.js.
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import LessonArticle from '@/components/knowledge/LessonArticle';
import ContentNextSteps from '@/components/knowledge/ContentNextSteps';
import { addCompletedModule, getJourneyMemory, updateJourneyMemory } from '@/lib/journeyMemory';

// The lesson text is part of this native Base44 page's source so its first HTML
// can contain the complete answer at the existing canonical URL.
const TITLE = "Your Website Is No Longer Just a Website";
const LESSON_PATH = "/knowledge/what-is-digital-trust/your-website-is-no-longer-just-a-website";
const COLLECTION_PATH = "/knowledge/what-is-digital-trust";
const COLLECTION_TITLE = "What Is Digital Trust?";
const LESSON_NUMBER = 2;
const READING_TIME = "6–8 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Previous Lesson: What Is Digital Trust?";
const NEXT_LABEL = "Next Lesson: Why Traditional Marketing Is No Longer Enough";
const PUBLISHED_DATE = "2026-07-15";
const MODIFIED_DATE = "2026-07-23";
const READER_RESPONSE = null;
const DESCRIPTION = "A modern business website should help people find, understand, trust, and connect with the business. It is becoming the central connection point between what your business knows and the people who need that knowledge.";
const CONTENT = "### The Common Misconception\n\nMany business owners still think of a website as an online brochure.\n\nIt tells people who the company is, lists its services, displays a few photographs, and gives customers a phone number or contact form.\n\nOnce the website is built, the owner considers the job finished.\n\nThat made more sense when websites first became common. Businesses needed a place online, and simply having one helped establish credibility.\n\nBut the role of the website has changed.\n\nToday, your website may be the first place a customer encounters your business. It may be where search engines learn what you do, where artificial intelligence systems look for reliable information, and where potential customers decide whether they understand and trust you.\n\nYour website is no longer just a website.\n\nIt is becoming the central connection point between what your business knows and the people who need that knowledge.\n\n### The Principle\n\nA modern business website should help people find, understand, trust, and connect with the business.\n\nThat requires more than listing services.\n\nThe website should help customers answer four important questions:\n\n* Am I in the right place?\n* Does this business understand my situation?\n* Can I trust how these people think and work?\n* What is the next reasonable step?\n\nA website that answers those questions is doing more than advertising.\n\nIt is guiding the customer.\n\nIt teaches before the sales conversation begins. It organizes the business’s knowledge. It connects questions to answers, problems to lessons, and interest to an appropriate next step.\n\nThe website becomes a working part of the business.\n\n### Real-World Examples and Experience\n\nI have been involved with advertising since long before websites became the center of business communication.\n\nTelevision, radio, newspapers, direct mail, and other traditional advertising usually had one primary purpose: get the customer’s attention.\n\nThe message had to work within a limited amount of time or space.\n\nA television commercial might have 30 seconds.\n\nA newspaper advertisement might have one page.\n\nA radio commercial had to communicate without anything for the customer to see.\n\nThose limitations forced advertisers to simplify the message and direct people toward the next step.\n\nThe website changed that.\n\nFor the first time, a business could create a place where customers could learn at their own pace.\n\nThey could read about the company, explore services, look at examples, and contact the business when they were ready.\n\nBut many companies continued treating the website like another advertisement.\n\nThey filled it with promotional claims:\n\n“We provide excellent service.”\n\n“We care about our customers.”\n\n“We are committed to quality.”\n\nThen they waited for people to call.\n\nThe website had more space than an advertisement, but it was not giving customers much more understanding.\n\nThat opportunity still exists today.\n\nA business can use its website to answer the questions that could never fit inside a 30-second commercial.\n\nIt can explain how decisions should be made.\n\nIt can share what years of experience have taught.\n\nIt can prepare customers for conversations, reduce uncertainty, and help people recognize whether the business is a good fit.\n\nThe website can teach.\n\n### Your Website Is Often Your First Conversation\n\nImagine a potential customer sitting across the table from you.\n\nThey explain the problem they are trying to solve.\n\nYou listen.\n\nYou ask questions.\n\nYou clarify what they mean.\n\nYou explain the available choices.\n\nYou share a story about someone who faced a similar situation.\n\nYou help them understand what they should consider before deciding.\n\nA good website should begin doing some of that work.\n\nIt cannot listen in the same way a person can, but it can anticipate the questions customers usually bring.\n\nIt can organize information around their concerns instead of around the company’s internal structure.\n\nIt can say:\n\n“If this is what you are experiencing, begin here.”\n\n“Before you spend money, understand these things.”\n\n“Here are the choices people commonly consider.”\n\n“This is why we follow this process.”\n\n“Here is what you can expect if we work together.”\n\nThat feels more like guidance than promotion.\n\nThe customer begins the real conversation with more understanding and better questions.\n\n### A Website Should Reflect How Customers Think\n\nBusinesses often organize websites around departments, products, or industry terminology.\n\nThat makes sense to the people inside the business.\n\nIt may not make sense to the customer.\n\nCustomers usually begin with their own situation.\n\nThey may be thinking:\n\n* Something is not working.\n* I do not understand my choices.\n* I am afraid of making an expensive mistake.\n* I have tried this before, and it did not help.\n* I know I need to do something, but I do not know where to begin.\n* I am trying to determine whom I can trust.\n\nA helpful website meets people at that point.\n\nIt does not require them to understand the business before the business helps them understand the problem.\n\nThis is why customer questions are so valuable. They reveal how the website should be organized and what it should teach.\n\nThe structure of the business may determine how the work is delivered.\n\nThe customer’s journey should help determine how the knowledge is presented.\n\n### The Website Is the Home of the Business’s Knowledge\n\nSocial media is useful, but the business does not control those platforms.\n\nAlgorithms change.\n\nAccounts can be limited.\n\nOlder posts become difficult to find.\n\nPeople may see one small part of the message without understanding how it connects to everything else.\n\nThe website gives the business a permanent home for its knowledge.\n\nA social post can introduce an idea and lead back to a complete lesson.\n\nA video can connect to the written explanation.\n\nA customer question can lead to a related story or process.\n\nA Journal article can become part of a larger learning path.\n\nInstead of scattering disconnected content across the internet, the business creates one connected source of understanding.\n\nThat is the role of the NTA Knowledge Library.\n\nIt gives each lesson a place and connects that lesson to the others around it.\n\nThe website becomes the doorway into that body of knowledge.\n\n### The Website Is Also a Source for AI\n\nThe website is no longer read only by people and traditional search engines.\n\nArtificial intelligence systems are also interpreting online information.\n\nA customer may ask an AI assistant:\n\n* Which businesses near me provide this service?\n* What should I understand before making this decision?\n* What is the difference between these options?\n* Which company appears to specialize in my situation?\n* What does this business believe about serving customers?\n\nThe quality of the answer depends partly on what reliable information the AI can find.\n\nIf the website contains only promotional claims, the system learns very little about the business.\n\nIf the website contains clear explanations, connected lessons, useful stories, consistent information, and demonstrated expertise, it provides a much stronger foundation.\n\nThis does not mean businesses should fill their websites with awkward language written for machines.\n\nThe best information for AI is often the same information that helps people:\n\n* Clear questions.\n* Direct answers.\n* Accurate details.\n* Useful examples.\n* Consistent language.\n* Well-organized knowledge.\n\nA website that teaches people clearly also gives technology a better opportunity to understand the business accurately.\n\n### The Website Should Connect to the Real Business\n\nA website becomes much more valuable when it is connected to what happens inside the company.\n\nA customer fills out a form.\n\nWhat happens next?\n\nSomeone reads a lesson.\n\nIs there a related conversation they can request?\n\nA new customer begins working with the business.\n\nCan the website help prepare them for the process?\n\nAn employee hears a recurring question.\n\nCan that question become a new Knowledge Library lesson?\n\nA business process changes.\n\nIs the public explanation updated too?\n\nA Growth Show episode is published.\n\nDoes it connect to the deeper lesson and supporting resources?\n\nWhen these activities are connected, the website stops being a separate marketing project.\n\nIt becomes part of the NTA Operating System.\n\nThe website helps move knowledge into conversations, conversations into relationships, and experience back into the Knowledge Library.\n\n### A Website Should Keep Learning\n\nA website should not be considered finished merely because the design is complete.\n\nThe business continues learning, so the website should continue learning too.\n\nNew customer questions appear.\n\nThe business develops better explanations.\n\nA process changes.\n\nA story reveals an important principle.\n\nCustomers show which information is confusing.\n\nEmployees discover a recurring misunderstanding.\n\nEach of these experiences can improve the website.\n\nThat does not mean redesigning it every few months.\n\nIt means treating it as a living knowledge system rather than a finished brochure.\n\nThe design provides the structure.\n\nThe knowledge gives the website continuing value.\n\n### More Pages Are Not Always the Answer\n\nA valuable website is not measured simply by how many pages it contains.\n\nA hundred disconnected articles can create more confusion than ten well-organized lessons.\n\nThe important questions are:\n\n* Does each page have a purpose?\n* Does it answer a real customer question?\n* Is the information accurate?\n* Does it connect naturally to related knowledge?\n* Does it help the visitor decide what to do next?\n* Does it reflect the principles and current practices of the business?\n\nThe goal is not to create the largest website.\n\nIt is to create the most useful path toward understanding.\n\nA connected body of knowledge becomes more valuable than a pile of content because each part strengthens the others.\n\n### The NTA Perspective\n\nAt NTA, I do not see the website as the final product.\n\nI see it as part of a larger growth system.\n\nThe NTA Knowledge Library contains what the business knows and teaches.\n\nThe NTA Operating System connects that knowledge to customer questions, relationships, publishing, sales conversations, processes, and artificial intelligence.\n\nThe website is where much of that becomes visible to the outside world.\n\nIt can serve as:\n\n* The business’s digital front door\n* Its teaching center\n* Its source of approved public knowledge\n* Its customer guidance system\n* Its trust-building platform\n* Its home for articles, lessons, stories, and videos\n* Its connection point between content and conversation\n* A reliable source for search engines and AI systems\n\nThat is much more valuable than an online brochure.\n\nThe website should not merely say that the business understands customers.\n\nIt should demonstrate that understanding by helping them.\n\n### Key Takeaway\n\nYour website is no longer just a website.\n\nIt is the central place where customers, search engines, and artificial intelligence systems try to understand your business.\n\nIt should do more than describe your services.\n\nIt should teach, guide, answer questions, demonstrate experience, reduce uncertainty, and connect people to the next appropriate step.\n\nWhen the website is connected to the business’s knowledge and operating system, it can keep creating value long after the original page was published.\n\n***\n\n### Reflection Questions\n\n* Does your website primarily promote your business, or does it help customers understand their situation?\n* Can a first-time visitor quickly tell whether they are in the right place?\n* Does the website answer the questions customers actually ask?\n* Is it organized around your company’s internal structure or the customer’s journey?\n* What valuable explanations do you give in person that are missing from the website?\n* Does each page lead naturally to another useful lesson, answer, or next step?\n* Could an AI system accurately understand your business from the information on your website?\n* What happens inside your business after someone contacts you through the site?\n* What is one existing page you could turn from a promotional page into a useful teaching resource?\n\n### Continue Your Journey\n\nThe website has become the home of the business’s digital knowledge and one of the most important places customers go to develop understanding and trust.\n\nBut the website cannot work alone.\n\nCustomers move among search engines, social platforms, videos, reviews, email, AI assistants, personal recommendations, and offline conversations. Traditional advertising can still introduce the business, but it cannot carry the entire customer journey.\n\nIn the next lesson, we will explore why *Why Traditional Marketing Is No Longer Enough*—and why modern growth depends on connecting attention, knowledge, trust, relationships, and business systems.\n";
const TAKEAWAY = "Your website is no longer just a website. It is the central place where customers, search engines, and artificial intelligence systems try to understand your business.";
const SEO_TITLE = "Why a Small Business Website Is More Than a Brochure | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/what-is-digital-trust/your-website-is-no-longer-just-a-website";
const LESSON_ID = 2;
const PREVIOUS_PATH = "/knowledge/what-is-digital-trust/what-is-digital-trust";
const NEXT_PATH = "/knowledge/what-is-digital-trust/why-traditional-marketing-is-no-longer-enough";
const RELATED_LESSONS = [
  {
    "title": "People Remember How a Business Made Them Feel",
    "description": "The technical result can be correct while the relationship still feels wrong. Long after customers forget the details of the transaction, they often remember how the business made them feel.",
    "path": "/knowledge/how-customers-decide-who-to-trust/people-remember-how-a-business-made-them-feel"
  },
  {
    "title": "Every System Produces Exactly What It Was Designed to Produce",
    "description": "Why your current results are a direct reflection of your current operational structure.",
    "path": "/knowledge/business-foundations/every-system-produces-exactly-what-it-was-designed-to-produce"
  }
];

export default function NativeLessonPage061() {
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setIsComplete(getJourneyMemory().completedModules.includes(LESSON_ID));
    updateJourneyMemory({ lastVisitedLessonId: LESSON_ID });
    window.scrollTo(0, 0);
  }, []);

  const markComplete = () => {
    addCompletedModule(LESSON_ID);
    setIsComplete(true);
    navigate(NEXT_PATH);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead
        title={SEO_TITLE}
        description={DESCRIPTION}
        canonical={CANONICAL}
        articleData={{
          title: TITLE,
          description: DESCRIPTION,
          author: 'Rick Hesse',
          datePublished: PUBLISHED_DATE,
          dateModified: MODIFIED_DATE,
          slug: LESSON_PATH
        }}
        learningData={{
          name: TITLE,
          description: DESCRIPTION,
          educationalLevel: LEVEL,
          learningResourceType: 'lesson'
        }}
      />
      <MarketingNav />
      <main className="flex-grow">
        <header className="border-b border-slate-800 bg-slate-900/30 px-6 pb-12 pt-24">
          <div className="mx-auto max-w-3xl">
            <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
              <Link to="/knowledge" className="hover:text-white"><BookOpen className="mr-1 inline h-4 w-4" />Knowledge Library</Link>
              <span aria-hidden="true">/</span>
              <Link to={COLLECTION_PATH} className="hover:text-white">{COLLECTION_TITLE}</Link>
              <span aria-hidden="true">/</span>
              <span className="text-white">Lesson {LESSON_NUMBER}</span>
            </nav>
            <p className="mb-5 text-xs font-bold uppercase tracking-widest text-blue-400">{['Lesson ', LESSON_NUMBER, ' · ', READING_TIME, ' · ', LEVEL].join('')}</p>
            <h1 className="mb-6 text-3xl font-black leading-tight text-white md:text-5xl">{TITLE}</h1>
            <p className="mb-8 text-lg leading-relaxed text-slate-400">{DESCRIPTION}</p>
            <p className="border-t border-slate-800 pt-6 text-sm font-bold text-white">Rick Hesse <span className="font-normal text-slate-500">· {AUTHOR_LABEL}</span></p>
          </div>
        </header>
        <article className="px-6 py-12"><div className="mx-auto max-w-3xl">
          <LessonArticle content={CONTENT} />
          {READER_RESPONSE && <section className="mt-12 rounded-2xl border border-blue-400/25 bg-blue-500/5 p-6 md:p-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-blue-300">{READER_RESPONSE.label || 'A reader’s response'}</p>
            <blockquote className="text-2xl font-medium leading-relaxed text-white">“{READER_RESPONSE.quote}”</blockquote>
            <p className="mt-5 text-sm font-bold text-slate-200">— {READER_RESPONSE.attribution}</p>
            {READER_RESPONSE.context && <p className="mt-5 text-sm leading-6 text-slate-400">{READER_RESPONSE.context}</p>}
          </section>}
          <aside className="mt-16 border-t border-slate-800 pt-10" aria-labelledby="related-lessons-heading">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-400">Continue Learning</p>
            <h2 id="related-lessons-heading" className="mb-6 text-2xl font-black text-white">Keep exploring this idea</h2>
            <div className="grid gap-4 md:grid-cols-2">{RELATED_LESSONS.map(resource => (
              <Link key={resource.path} to={resource.path} className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 hover:border-blue-500/60">
                <h3 className="mb-2 text-lg font-bold text-white">{resource.title}</h3>
                <p className="text-sm leading-6 text-slate-400">{resource.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-blue-400">Read this next <ArrowRight className="h-4 w-4" /></span>
              </Link>
            ))}</div>
          </aside>
        </div></article>
        <section className="border-t border-slate-800 bg-slate-900 px-6 py-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 rounded-2xl border border-blue-500/20 bg-blue-900/20 p-8">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-400">Key Takeaway</h2>
              <p className="text-xl font-medium leading-relaxed text-white">{TAKEAWAY}</p>
            </div>
            <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:flex-row">
              <div><h2 className="font-bold text-white">Progress Check</h2><p className="text-sm text-slate-400">Marking this complete saves your spot.</p></div>
              <button type="button" onClick={markComplete} disabled={isComplete} className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500 disabled:cursor-default disabled:bg-emerald-950 disabled:text-emerald-400"><CheckCircle className="h-5 w-5" />{isComplete ? 'Lesson Completed' : 'Mark as Complete'}</button>
            </div>
          </div>
        </section>
        <section className="px-6 py-12"><div className="mx-auto max-w-3xl"><ContentNextSteps title={TITLE} path={LESSON_PATH} /></div></section>
        <nav className="border-t border-slate-800 px-6 py-8" aria-label="Lesson navigation">
          <div className="mx-auto flex max-w-4xl flex-col justify-between gap-6 sm:flex-row">
            <Link to={PREVIOUS_PATH} className="flex items-center gap-3 rounded-xl p-4 font-bold text-slate-300 hover:bg-slate-900 hover:text-white"><ArrowLeft className="h-5 w-5" />{PREVIOUS_LABEL}</Link>
            <Link to={NEXT_PATH} className="flex items-center gap-3 rounded-xl p-4 font-bold text-slate-300 hover:bg-slate-900 hover:text-white">{NEXT_LABEL}<ArrowRight className="h-5 w-5" /></Link>
          </div>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
