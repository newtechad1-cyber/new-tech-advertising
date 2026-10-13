// Governing source for both the native page and curriculum reader.
// Prepared from Rick's October 13, 2026 conversation; Rick reviews and publishes.
export const AI_CONFUSION_PATH = '/knowledge/ai-foundations/is-using-ai-cheating';

export const AI_CONFUSION_SOURCES = [
  { id: 'fda-list', publisher: 'U.S. Food and Drug Administration', title: 'AI-enabled medical devices', url: 'https://www.fda.gov/medical-devices/artificial-intelligence-enabled-medical-devices/list-artificial-intelligence-enabled-medical-devices', note: 'A periodically updated, non-exhaustive list of devices authorized for particular intended uses; not approval of AI in general.' },
  { id: 'fda-gi-genius', publisher: 'U.S. Food and Drug Administration', title: 'GI Genius authorization announcement — April 9, 2021', url: 'https://content.govdelivery.com/accounts/USFDA/bulletins/2cc3133', note: 'Explains the evaluated colonoscopy assistance and its limits. The clinician assesses the highlighted area; the device does not supply a pathology diagnosis or treatment decision.' },
  { id: 'abms', publisher: 'American Board of Medical Specialties', title: 'Our Story', url: 'https://abms.org/our-story/', note: 'Historical context: the organization began in 1933. Medical specialization did not begin recently.' },
  { id: 'who', publisher: 'World Health Organization', title: 'WHO calls for safe and ethical AI for health — May 16, 2023', url: 'https://www.who.int/news/item/16-05-2023-who-calls-for-safe-and-ethical-ai-for-health', note: 'Supports careful evaluation, expert supervision, transparency and attention to misleading health answers.' },
  { id: 'frontier', publisher: 'Dell’Acqua and colleagues · Organization Science', title: 'Navigating the Jagged Technological Frontier — published March 11, 2026', url: 'https://pubsonline.informs.org/doi/10.1287/orsc.2025.21838', note: 'A randomized study of 758 consultants using GPT-4: assistance improved performance on suitable tasks but reduced correctness on a task outside its capability. Results concern that model, task set and study setting.' },
  { id: 'claude-help', publisher: 'Anthropic · Claude Help Center', title: 'Incorrect or misleading responses', url: 'https://support.claude.com/en/articles/8525154-claude-is-providing-incorrect-or-misleading-responses-what-s-going-on', note: 'The provider describes plausible but inaccurate answers and recommends checking original sources. Product documentation is not independent proof of performance.' },
  { id: 'claude-limits', publisher: 'Anthropic · Claude Platform Docs', title: 'Reduce hallucinations', url: 'https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations', note: 'Documents ways to reduce errors while warning that these techniques do not eliminate them.' },
  { id: 'unesco', publisher: 'UNESCO · Fengchun Miao and Wayne Holmes', title: 'Guidance for generative AI in education and research — 2023', url: 'https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research', note: 'A human-centred approach that considers agency, privacy, inclusion and appropriate educational use; not permission to ignore an assignment’s rules.' },
  { id: 'engelbart', publisher: 'Douglas C. Engelbart · Stanford Research Institute', title: 'Augmenting Human Intellect: A Conceptual Framework — October 1962', url: 'https://www.dougengelbart.org/pubs/augment-3906.html', note: 'Historical primary source on people, tools, concepts and methods working together. This is conceptual context, not evidence that every modern AI system is effective or appropriate.' }
];

const sourceReading = '\n\n## Sources and further reading\n\nThese links let you examine the evidence and follow the ideas beyond this lesson. They support the specific points described here; none is presented as an endorsement of me, NTA, or every conclusion in this lesson. Source pages were checked on October 13, 2026.\n\n' + AI_CONFUSION_SOURCES.map(source => `- **${source.publisher}: [${source.title}](${source.url}).** ${source.note}`).join('\n');

export const lesson17 = {
  id: 17,
  slug: 'is-using-ai-cheating',
  title: 'AI Confusion: Is Using AI Cheating?',
  description: 'Understanding the tool without giving up your judgment. A contractor, a doctor, and an everyday example help separate useful assistance from dishonesty, with sources you can examine for yourself.',
  searchDescription: 'Is using AI cheating? Rick Hesse connects familiar examples, healthcare evidence and research to explain assistance, honesty, human judgment and shared knowledge.',
  modifiedDate: '2026-10-13',
  readingTime: '11 min read',
  level: 'Beginner',
  takeaway: 'Using assistance is not automatically cheating. Understand the purpose, respect the agreement, check the result, and be honest about the work. Follow the evidence without giving up your own judgment.',
  sources: AI_CONFUSION_SOURCES,
  relatedLessons: [
    { label: 'AI Can Assist Judgment. It Cannot Own It.', link: '/knowledge/ai-foundations/ai-can-assist-judgment-it-cannot-own-it' },
    { label: 'AI Didn’t Give Me My Experience', link: '/knowledge/what-a-lifetime-in-business-taught-me/ai-didnt-give-me-my-experience' },
    { label: 'I Was Afraid AI Would Take My Voice. It Helped Me Find It.', link: '/knowledge/what-a-lifetime-in-business-taught-me/i-was-afraid-ai-would-take-my-voice-it-helped-me-find-it' }
  ],
  content: `
## Let’s understand what we are calling cheating

When somebody says using AI is cheating, it bothers me a little. Not because I think every use of AI is right. I don’t. It bothers me because that one word can end the conversation before we understand what actually happened.

Are we talking about someone getting help understanding a difficult idea? A business owner organizing notes? A student avoiding work they agreed to do themselves? Someone inventing a customer testimonial? Those are different situations. I don’t think one label explains all of them.

My mission is to help everyday people and small-business owners understand AI: to clear up the confusion, make it less intimidating, and give people a place to ask questions without pressure, judgment, or hype. I’m not trying to win an argument. I want us to have a better conversation.

## Would you tell a contractor not to use power tools?

Imagine hiring a contractor to build your house and saying, “No power saws. No electric drills. No nail guns. You have to do everything by hand, because otherwise you’re not really doing the work.”

Unless you specifically wanted hand-built methods, that restriction would miss what you were hiring the person to do. You want a well-built house. You want sound work, care, and an honest agreement. Making every step harder is not the same thing as making the work better.

But the other half of the comparison matters just as much: owning power tools doesn’t make someone a good contractor. Someone still has to understand the plans, choose materials, recognize mistakes, and take responsibility for the result.

**The tool can help perform the work without making the person’s knowledge irrelevant.**

A person might also choose hand tools because they enjoy the craft or want to learn a skill. That is a perfectly reasonable choice. My point is not that everyone must use the same tools. It is that assistance is not automatically dishonesty, and choosing not to use assistance does not make someone backward.

## Would you want your doctor limited to the past?

I wouldn’t want my doctor limited to the knowledge and tools available when I was a child. I would want the benefit of what people have learned since then. Not every new invention simply because it is new, but appropriate tools that have been evaluated for the job.

I also value specialized knowledge connected back to the whole person. Specialists are not a recent invention: the [American Board of Medical Specialties dates to 1933](https://abms.org/our-story/). The point is not that earlier doctors lacked expertise. It is that I don’t want useful learning to stop.

AI-enabled medical devices are already part of healthcare. The [FDA’s public device list](https://www.fda.gov/medical-devices/artificial-intelligence-enabled-medical-devices/list-artificial-intelligence-enabled-medical-devices) identifies devices authorized for specific uses and links to their regulatory records. The list is not comprehensive, and it is not a blanket approval of AI.

One concrete example is GI Genius. In April 2021, the FDA authorized this system to assist clinicians during colonoscopy by highlighting areas that might contain a polyp or other lesion. The clinician still assesses the area and decides what to do. The system does not supply a pathology diagnosis or a treatment decision. [Read the FDA’s explanation of the device and its limits.](https://content.govdelivery.com/accounts/USFDA/bulletins/2cc3133)

Would I call that cheating? No. I would ask whether the assistance is useful, what supports its use, and what still needs a person’s judgment. I am not asking a doctor to prove they can work without help. I want them to use appropriate knowledge and tools in caring for the patient.

There is an important boundary here. An evaluated medical device for a particular purpose is not interchangeable with an ordinary AI conversation answering a health question. The [World Health Organization warns that language-model answers can sound authoritative while containing serious errors](https://www.who.int/news/item/16-05-2023-who-calls-for-safe-and-ethical-ai-for-health). It calls for evaluation, expert supervision and transparency. This example is about understanding tools, not advice to make medical decisions using AI.

**“Doctors use AI” does not mean every use of AI is good. It means we need to examine the particular use.**

## Useful help is different from hiding the truth

Imagine asking AI, “Explain this idea another way. I’m not understanding it.” Now compare that with, “Complete this assessment for me, even though I agreed to do it without assistance.” The first request seeks understanding. The second avoids an explicit requirement.

Or imagine a business owner who knows what happened on a service call and needs help turning rough notes into a clear customer message. Compare that with inventing a satisfied customer and publishing a testimonial from that imaginary person. Both could involve generated words. Only one starts from a real account of what happened.

The questions I would ask are simple: What was the person trying to do? What were they expected to do themselves? Did they respect the agreement? Are they being truthful about the result and the help they received?

A polished result does not excuse a broken agreement. Nor does an agreement settle every ethical question. Privacy, consent, fair treatment and the effect on other people still matter. [UNESCO’s guidance on generative AI in education and research](https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research) takes a human-centred approach, including attention to human agency and privacy. It is not permission to disregard a teacher’s or an organization’s rules.

## Research gives us more than an opinion

Researchers have examined how people perform with AI assistance, rather than assuming that help is always beneficial or always harmful. In a randomized study involving 758 consultants and GPT-4, AI assistance improved performance on suitable tasks but reduced correctness on a task outside the system’s capabilities. The authors describe this unevenness as a “jagged technological frontier.” [Read the study by Fabrizio Dell’Acqua and colleagues in Organization Science.](https://pubsonline.informs.org/doi/10.1287/orsc.2025.21838)

That study concerns a particular model, set of tasks and group of people. It does not promise the same result for every person, tool, or business. It does support taking the specific job seriously rather than treating AI as one uniform ability. It does not settle whether a use is honest; that is a separate question.

To me, this is a useful connection with the contractor and doctor examples. Assistance can add value, but the fit between the tool, the person and the task matters. That connection is my interpretation of the evidence, not a claim that the researchers endorsed my lesson.

## Assistance does not erase what you bring

This lesson began with a thought I spoke aloud. I supplied the contractor comparison, the concern behind it, and the connection to the work I want to do. Then I brought in the healthcare example and explained why source links matter to me.

AI helped organize the discussion, propose wording, find sources and examine the comparisons. I read what came back, reacted to it, and helped shape the direction. I do not want to hide that help. I want people to understand it.

The concern I’m expressing is mine. The experience I bring is mine. The assistance with language and research is real, too. Those things can all be true together.

**Help expressing a thought is not the same as having no thought of your own.**

At the same time, putting my name on a generated answer does not make me knowledgeable about its subject. I still need to understand what I am saying and have a sound basis for saying it. Reading and approving something is not a substitute for checking it.

That is part of the connection with [AI Didn’t Give Me My Experience](/knowledge/what-a-lifetime-in-business-taught-me/ai-didnt-give-me-my-experience) and [I Was Afraid AI Would Take My Voice. It Helped Me Find It.](/knowledge/what-a-lifetime-in-business-taught-me/i-was-afraid-ai-would-take-my-voice-it-helped-me-find-it).

## A convincing answer still needs to be checked

Here is where the power-tool comparison stops being enough. A language model can produce an explanation or claim that sounds convincing without being accurate. Anthropic’s own [Claude Help Center describes incorrect or misleading responses and recommends checking original sources](https://support.claude.com/en/articles/8525154-claude-is-providing-incorrect-or-misleading-responses-what-s-going-on). Its [technical guidance on reducing hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) also explains that methods for reducing errors do not eliminate them.

That means better instructions are useful, but they are not a guarantee. I need to compare the answer with the information I supplied, check important claims against reliable sources, and recognize when I need someone with deeper subject knowledge. Asking the same AI whether it is sure is not the same as independent verification.

The source links in this lesson are there for that reason. A link should take you to relevant evidence, not merely make a sentence look official. You can read the original, check the date and context, and see whether it supports what I wrote. If it does not, the wording needs to change.

## Try an example you can inspect

Here are some invented notes, not private information about a real person or customer:

> Community cleanup. Saturday, 9–11 a.m. Meet at the park entrance. Bring gloves. Cancel if it rains.

Here is a request someone could make:

> Turn these notes into a friendly invitation. Use only the details I gave you. Do not add promises or activities. Put any questions about missing information below the invitation.

A suitable draft might say:

> Join us for a community cleanup on Saturday from 9–11 a.m. Meet at the park entrance and bring your gloves. We’ll cancel if it rains.

Now inspect it. Is the time right? Did the gloves and rain condition stay in? Did anything invent lunch, free supplies, or another promise? Before this could become a real invitation, someone would need to confirm the calendar date and which park. The tool should flag those gaps, not quietly fill them in.

You could then say, “Make it more conversational, but keep the details the same.” And check it again. A tool may still add or change something despite that instruction.

**Explain. Inspect. Correct. Decide.** That is the whole example, not just the moment words appear. You can learn from it without opening an account or deciding to use AI yourself.

## I don’t see knowledge as mine alone

Sometimes I have carried a thought for years and wondered why I wasn’t finding people who saw it the same way. Then I come across someone who has been thinking along similar lines. It reminds me that my own perspective is part of a much larger conversation.

I recognize connections within knowledge. I notice patterns that emerge as the pieces come together. The way I frame a lesson comes from my life, but that does not mean every idea inside it began with me.

There is a historical connection worth exploring here. In his October 1962 report, [Augmenting Human Intellect: A Conceptual Framework](https://www.dougengelbart.org/pubs/augment-3906.html), Douglas Engelbart considered how a person’s capabilities could be strengthened through tools, concepts and methods working together. He treated the interacting system as important, rather than looking only at an isolated machine.

That is not a study of today’s generative AI, and it does not prove every present-day use works. It does show that the broader question of technology helping people understand and solve problems did not begin with this lesson—or with the latest AI product.

Finding a related idea does not make my conclusion automatically right. It gives me something to examine, learn from and connect. Sometimes another person’s work strengthens what I thought. Sometimes it corrects it. Either way, there is an opportunity to understand more.

**I don’t have to be the only person who sees something for it to be worth sharing.**

## Understanding should leave you free to choose

I’m not asking you to trust AI with everything. I’m not asking you to agree with every way it is used. You may find it useful for organizing notes and decide not to use it for a personal letter. You may want help studying while completing the assessed work independently. You may prefer not to use it at all.

My purpose is not to talk you out of your judgment. It is to help you have enough understanding to use it.

The question is not simply, “Was AI involved?” It is whether the assistance fits the purpose, respects the people and the agreement, and leads to a result somebody has properly checked and can honestly stand behind.

**The NTA Point of View:** Using assistance is not automatically cheating. Understand what the tool is doing, what you still need to know, and what you remain responsible for. Follow the evidence, keep asking questions, and leave room to learn something new.

I’m not asking you to believe something just because I say it. I want to show you what I’ve learned, where the information comes from, and why I think the connection matters. Then we can look at it together.
` + sourceReading
};
