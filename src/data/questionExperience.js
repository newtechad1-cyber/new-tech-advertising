/**
 * Question-first enhancements for existing NTA Knowledge Library answers.
 *
 * These additions deliberately reuse and connect existing NTA teaching. They
 * are not a second article library: each entry gives a visitor practical
 * examples, healthy boundaries for AI, and the next related NTA door.
 */
export const questionExperienceBySlug = {
  "why-does-ai-give-bad-answers": {
    "examples": [
      {
        "title": "Illustrative facts and a wrong draft",
        "text": "Made-up approved facts: a customer requested a service visit; the office will call to arrange it; no date or price is confirmed. A draft saying “We’ll be there tomorrow for $99” has added two promises the facts do not support."
      },
      {
        "title": "Correct it against the source",
        "text": "Ask: “Use only the approved facts. Remove the invented appointment and price. Tell me what still needs confirmation.” A suitable revised draft would say: “We received your request. Our office will contact you to arrange the visit.”"
      },
      {
        "title": "Check the revision yourself",
        "text": "Compare the new draft with each source fact. A person still needs to confirm the appointment, price, and any other missing details before including them. A second AI answer can still be wrong, so the revision is not its own proof."
      }
    ],
    "aiCanHelp": "AI can revise a draft, point out missing information, and help compare wording with an approved source.",
    "aiCannotHelp": "It cannot make an unsupported price or appointment true. The person responsible for the work must verify the facts and the final message."
  },
  "how-do-i-compare-ai-cost-with-business-value": {
    "examples": [
      {
        "title": "Use the same task and standard",
        "text": "The worksheet uses a fictional task: 20 customer-update drafts in a month, each checked by an employee. Both approaches must meet the same factual and service standard before their costs are compared."
      },
      {
        "title": "Count the whole job",
        "text": "Include gathering information, prompting, review, corrections, and final preparation. Include the task’s share of subscription and usage costs. Record setup separately so the first month does not look the same as an established routine."
      },
      {
        "title": "Give the result a practical meaning",
        "text": "In this illustration, the first month costs the same under both approaches; a later month uses $30 less in combined time value and tool cost. That difference is an estimate for this example, not a promised saving, payroll reduction, or new revenue."
      }
    ],
    "worksheet": {
      "title": "Illustrative monthly cost worksheet",
      "introduction": "Copy this comparison into your notes and replace the fictional figures with your own. The $30 hourly value is an example for valuing time, not a wage recommendation or a measured NTA result.",
      "columns": [
        "What to compare",
        "Usual process",
        "AI trial"
      ],
      "rows": [
        [
          "Finished work and quality",
          "20 checked customer updates",
          "20 checked customer updates, same standard"
        ],
        [
          "Complete time per update",
          "15 minutes",
          "10 minutes, including preparation, review, and corrections"
        ],
        [
          "Monthly working time",
          "20 × 15 = 300 minutes",
          "20 × 10 = 200 minutes"
        ],
        [
          "Illustrative value of time",
          "$30 per hour",
          "$30 per hour"
        ],
        [
          "Monthly time value",
          "300 ÷ 60 × $30 = $150",
          "200 ÷ 60 × $30 = $100"
        ],
        [
          "Added subscription and usage cost",
          "$0",
          "$20 per month for this task"
        ],
        [
          "One-time setup",
          "$0",
          "60 minutes × $30 per hour = $30"
        ],
        [
          "First-month total",
          "$150",
          "$100 + $20 + $30 = $150"
        ],
        [
          "Later-month total",
          "$150",
          "$100 + $20 = $120"
        ]
      ],
      "note": "Use the actual time and costs from your trial. Time freed is capacity you can use elsewhere; it becomes a cash saving only if an actual expense falls. If quality drops or review takes longer, include that in the decision."
    },
    "aiCanHelp": "AI can help organize the comparison and explain differences after you provide checked inputs.",
    "aiCannotHelp": "It cannot prove a business return from a fictional worksheet or decide whether the quality and risk fit your business."
  },
  'how-can-a-small-business-use-ai': {
    examples: [
      {
        title: 'Prepare a customer reply',
        text: 'Give AI the customer’s question and the facts you want included. Let it prepare a first draft, then have the person who knows the work review it before anything is sent.'
      },
      {
        title: 'Turn rough notes into a useful starting point',
        text: 'Use it to organize meeting notes, job notes, or a voice memo into a checklist, summary, or follow-up draft that a person can improve.'
      },
      {
        title: 'Make a repeated task easier to begin',
        text: 'Ask it to prepare the first version of a weekly plan, a customer explanation, or a list of questions. The owner and team still decide what is right.'
      }
    ],
    aiCanHelp: 'AI can help people prepare, organize, summarize, compare options, and create a first version of work that still needs human review.',
    aiCannotHelp: 'It cannot know your customers the way your people do, make a promise on the business’s behalf, decide what matters most, or carry responsibility for the final result.',
    video: {
      title: 'AI Finally Taught Me How to Multitask',
      description: 'A practical NTA Growth Show conversation about using AI as helpful support without giving away judgment.',
      href: 'https://youtu.be/6lhiYFHFsCQ'
    }
  },
  'where-should-i-start-with-ai': {
    examples: [
      {
        title: 'Start with one recurring task',
        text: 'Choose a task that takes too long or creates unnecessary back-and-forth. Define the result you want before you ask a tool to help.'
      },
      {
        title: 'Give the tool the business context it needs',
        text: 'Share the approved facts, audience, tone, and limits that a person would need to do the work well. Better context makes a better starting point.'
      },
      {
        title: 'Review the result together',
        text: 'Let the owner or the person closest to the work decide whether the result is useful enough to repeat or improve.'
      }
    ],
    aiCanHelp: 'AI can make an existing piece of work easier to start, easier to organize, and easier to improve.',
    aiCannotHelp: 'It cannot choose the right work for you or fix a confused process by itself. A bad process simply moves faster when it is automated too soon.'
  },
  'what-can-chatgpt-do-for-a-small-business': {
    examples: [
      {
        title: 'Prepare for a customer conversation',
        text: 'Ask ChatGPT to turn a rough list of customer questions into a clear outline your team can check and personalize.'
      },
      {
        title: 'Create a first draft from your own knowledge',
        text: 'Give it the answer your best person would give, then use it to organize that answer into a useful email, FAQ, checklist, or post.'
      },
      {
        title: 'Think through options before deciding',
        text: 'Use it to list questions, tradeoffs, or next steps. Keep the final business decision with the owner or the person responsible for the work.'
      }
    ],
    aiCanHelp: 'ChatGPT can help a small business prepare, organize, explain, and explore options when it has useful context and a clear job.',
    aiCannotHelp: 'It should not be treated as a source of unquestioned facts, a substitute for customer relationships, or the person who makes a business promise.'
  },
  'what-ai-tools-does-a-small-business-really-need': {
    examples: [
      {
        title: 'One dependable assistant',
        text: 'A single approved AI assistant can support many early jobs: first drafts, summaries, checklists, and better questions.'
      },
      {
        title: 'One protected source of business information',
        text: 'Keep approved customer, service, and process information where the right people can review and update it. AI is more useful when it has trusted context.'
      },
      {
        title: 'One job worth improving',
        text: 'Choose a real task before adding another subscription. A tool earns its place when it makes that work better without creating more confusion.'
      }
    ],
    aiCanHelp: 'AI tools can support clearly defined work and reduce repetitive setup when the business chooses them for a specific purpose.',
    aiCannotHelp: 'No stack of tools can replace a clear process, responsible people, or a decision about what the business is trying to improve.'
  },
  'how-can-employees-use-ai-at-work': {
    examples: [
      {
        "title": "Illustrative workflow: before AI",
        "text": "An employee reads approved job notes, finds the relevant service details, writes a customer update, checks every fact, and sends it through the business’s usual process. This is a made-up workflow, not a reported client result."
      },
      {
        "title": "The same workflow with AI support",
        "text": "The employee gives an approved tool only the information it needs and asks for a draft plus a list of missing facts. The employee compares it with the notes, corrects the wording, confirms any promise, and decides when it is ready to send."
      },
      {
        "title": "Ask the person doing the work",
        "text": "Compare complete working time, corrections, and whether the customer receives a clearer update. Ask the employee what became easier and what still caused friction. One trial can guide the next improvement; it does not predict jobs, headcount, or guaranteed time savings."
      }
    ],
    aiCanHelp: 'AI can give a small-business team more support around preparation, organization, and repeated communication.',
    aiCannotHelp: 'It cannot replace the relationships, judgment, accountability, and care that employees bring to customers and to each other.'
  },
  'why-isnt-my-website-generating-leads': {
    examples: [
      {
        title: 'Answer the first question sooner',
        text: 'Use the language customers already use to explain what you do, who you help, and why someone should keep reading.'
      },
      {
        title: 'Make proof easy to find',
        text: 'Show useful service details, real customer evidence, and a clear next action instead of making a visitor hunt for reassurance.'
      },
      {
        title: 'Follow the inquiry after it arrives',
        text: 'A useful website gives the next person in the business enough information to respond clearly and promptly.'
      }
    ],
    aiCanHelp: 'AI can help identify repeated customer questions, organize a first draft of clearer content, and make the right information easier to maintain.',
    aiCannotHelp: 'It cannot make a weak offer trustworthy, replace real evidence, or repair customer follow-up that never happens.',
    caseStudy: {
      title: 'Johnson Heating & Air Conditioning',
      description: 'See how connected website, visibility, content, and follow-up work can support a clearer customer path.',
      path: '/case-studies/johnson-heating'
    },
    service: {
      title: 'When a stronger website path would help',
      description: 'If the problem is bigger than one page of copy, NTA can help examine the full path from discovery to inquiry and follow-up.',
      path: '/services/website-rebuilds',
      label: 'Explore website support'
    }
  },
  'how-do-i-market-a-local-service-business': {
    examples: [
      {
        title: 'Be clear where people look first',
        text: 'Keep the business information, services, proof, and next step understandable on your website, in local search, and anywhere customers compare options.'
      },
      {
        title: 'Turn real questions into useful teaching',
        text: 'A customer question can become a clearer service page, short video, FAQ, or follow-up explanation that keeps helping the next person.'
      },
      {
        title: 'Connect attention to a response',
        text: 'Every campaign, post, or referral should lead somewhere useful and have a clear way for the business to respond.'
      }
    ],
    aiCanHelp: 'AI can help organize the questions customers ask, prepare useful drafts, and support a more consistent content and follow-up rhythm.',
    aiCannotHelp: 'It cannot create trust without clear information, real proof, a dependable customer experience, and people who follow through.',
    caseStudy: {
      title: 'Monson Plumbing, Heating & Excavating',
      description: 'Explore a local-business example of connected website, visibility, campaign, and follow-up work.',
      path: '/case-studies/monson-plumbing'
    }
  },
  'is-social-media-enough-for-a-small-business': {
    examples: [
      {
        title: 'Use a post as a doorway',
        text: 'A useful post gives someone a reason to visit a clearer page with service details, proof, and an easy next step.'
      },
      {
        title: 'Reuse what customers already ask',
        text: 'A good answer from a real conversation can become a short post, a video topic, a website answer, and an easier response for the team.'
      },
      {
        title: 'Keep the path connected',
        text: 'When someone is interested, the business should know where to send them and what should happen after they respond.'
      }
    ],
    aiCanHelp: 'AI can help plan, organize, and prepare social content from real customer questions while the business keeps its own voice and judgment.',
    aiCannotHelp: 'It cannot make generic posts meaningful, replace the website and follow-up path, or build trust through activity alone.'
  },
  'how-can-ai-use-knowledge-already-inside-my-company': {
    examples: [
      {
        "title": "Illustrative approved procedure",
        "text": "Imagine a shop whose team has approved this rule: record the item a customer wants, have a staff member check current availability, and confirm delivery details before making a promise. These are fictional facts for this example, not a real shop’s policy."
      },
      {
        "title": "Turn the procedure into a reusable answer",
        "text": "Using only that rule, AI could prepare: “Tell us which item you’re considering. We’ll check availability and confirm the delivery details with you.” A staff member checks the wording against the procedure before adding it to the team’s approved answers."
      },
      {
        "title": "Keep the source and access clear",
        "text": "Keep the approved procedure with its owner and review date. Give staff access according to their jobs, and share only the relevant approved facts with the AI tool. If a source is missing, out of date, or conflicts with another rule, stop and ask the responsible person."
      }
    ],
    aiCanHelp: 'AI can help people find, organize, and apply approved business knowledge once the business has made that knowledge clear enough to review.',
    aiCannotHelp: 'It cannot responsibly invent the business’s judgment or use customer information without clear permission, boundaries, and human accountability.'
  },
  'how-can-ai-help-with-customer-follow-up': {
    examples: [
      {
        title: 'Prepare a timely first response',
        text: 'AI can help prepare a reply using the approved facts about a service, a customer’s question, and the next step a person should confirm.'
      },
      {
        title: 'Keep the next step visible',
        text: 'A simple follow-up system can remind the right person to check back, record what happened, and avoid relying on memory alone.'
      },
      {
        title: 'Learn from repeated questions',
        text: 'When the same question keeps appearing, turn it into clearer website content, a saved response, or a better process for the team.'
      }
    ],
    aiCanHelp: 'AI can help prepare, organize, summarize, and remind people about follow-up work when the business has clear rules and someone remains accountable.',
    aiCannotHelp: 'It cannot replace a real relationship, decide what is appropriate to promise, or send sensitive customer information through tools the business has not approved.',
    caseStudy: {
      title: 'Johnson Heating & Air Conditioning',
      description: 'See a connected customer path that brings website, visibility, campaign work, and follow-up together.',
      path: '/case-studies/johnson-heating'
    },
    service: {
      title: 'When follow-up needs a stronger system',
      description: 'NTA can help a business connect the information, tasks, and customer path behind dependable follow-up when a one-off reminder is not enough.',
      path: '/back-office-solutions',
      label: 'Explore connected back-office support'
    }
  },
  'how-can-ai-help-market-my-small-business': {
    examples: [
      {
        title: 'Turn one real question into useful teaching',
        text: 'Start with a customer question your team has answered before. Use AI to prepare a first draft for a page, post, email, or video outline, then have the business check it for truth and usefulness.'
      },
      {
        title: 'Reuse work that already helped someone',
        text: 'A useful explanation does not have to disappear after one conversation. AI can help adapt approved teaching for different places while the business keeps the message consistent.'
      },
      {
        title: 'Prepare before choosing a campaign',
        text: 'Use AI to organize the audience, questions, proof, and next step behind an idea before spending money to put it in front of more people.'
      }
    ],
    aiCanHelp: 'AI can help prepare, organize, and reuse useful marketing work that begins with real customer questions and approved business knowledge.',
    aiCannotHelp: 'It cannot decide the business promise, create genuine proof, or make disconnected activity turn into a reliable customer path.'
  },
  'how-can-ai-help-me-get-more-customers': {
    examples: [
      {
        title: 'Make the first explanation clearer',
        text: 'Use the language customers already use to make service pages, answers, and calls to action easier to understand.'
      },
      {
        title: 'Turn repeated questions into assets',
        text: 'A question from one customer can become an approved answer that helps the next person learn, trust, and take a useful next step.'
      },
      {
        title: 'Support a timely response',
        text: 'AI can help organize the inquiry and prepare a first response so the right person can follow up with the facts and judgment the situation needs.'
      }
    ],
    aiCanHelp: 'AI can help make the business easier to understand and support the work around a dependable customer path.',
    aiCannotHelp: 'It cannot guarantee customers, replace real evidence, or take the place of good service and responsible follow-through.',
    caseStudy: {
      title: 'Johnson Heating & Air Conditioning',
      description: 'See how website, visibility, content, and follow-up work can become a clearer path for customers.',
      path: '/case-studies/johnson-heating'
    }
  },
  'how-can-ai-save-me-time-in-my-business': {
    examples: [
      {
        title: 'Organize the starting information',
        text: 'Turn notes, voice memos, or a rough outline into a first checklist, summary, or draft that the responsible person can review.'
      },
      {
        title: 'Prepare repeated communication',
        text: 'Use approved facts to prepare the first version of recurring explanations, status updates, or internal handoffs instead of beginning from a blank page.'
      },
      {
        title: 'Make a process easier to begin',
        text: 'Ask AI to list the questions, missing information, or next steps behind a familiar task. The team still decides what is right for this situation.'
      }
    ],
    aiCanHelp: 'AI can reduce repeated setup and help people prepare work faster when the task has a clear purpose and a person reviews the result.',
    aiCannotHelp: 'It cannot make an unclear process clear by itself or remove the judgment required when a task affects a customer, a promise, or a meaningful decision.',
    video: {
      title: 'AI Finally Taught Me How to Multitask',
      description: 'A practical NTA Growth Show conversation about using AI as support for real work without giving away judgment.',
      href: 'https://youtu.be/6lhiYFHFsCQ'
    }
  },
  'how-can-ai-help-with-social-media-for-my-business': {
    examples: [
      {
        "title": "Begin with an approved lesson",
        "text": "NTA’s “Start With the Work, Not the Tool” lesson answers a common starting question: where can AI be useful in this business? The lesson supplies the idea; the social post gives someone a short, useful way into it.",
        "link": {
          "label": "Read the source lesson",
          "path": "/knowledge/ai-foundations/start-with-the-work-not-the-tool"
        }
      },
      {
        "title": "Illustrative post draft",
        "text": "“AI feels less confusing when it has one clear job. Pick a repeated piece of work, give it the facts it needs, and check the result. What task would you start with? Here’s a practical place to begin.” This is a sample for review, not a published post.",
        "link": {
          "label": "Read the fuller answer the post would link to",
          "path": "/knowledge/questions/where-should-i-start-with-ai"
        }
      },
      {
        "title": "Follow the response back",
        "text": "Check that the post and linked page agree. After an approved post is published, record the destination, meaningful questions, visits where available, and any inquiries you can actually trace. Use those responses to improve the next answer."
      }
    ],
    aiCanHelp: 'AI can help prepare and organize social content from real questions and approved information.',
    aiCannotHelp: 'It cannot make generic content trustworthy, replace the business voice, or make social media carry the entire customer path.'
  },
  'how-can-ai-help-my-small-business-website': {
    examples: [
      {
        title: 'Answer a repeated question clearly',
        text: 'Use AI to organize an approved answer into a useful page structure. The people who know the business should still check facts, tone, and promises.'
      },
      {
        title: 'Find gaps a visitor may feel',
        text: 'Compare a customer question with the page they would land on. AI can help identify where the explanation, proof, or next step is missing.'
      },
      {
        title: 'Keep useful information easier to maintain',
        text: 'When something important changes, AI can help prepare a draft update so the site stays accurate after human review.'
      }
    ],
    aiCanHelp: 'AI can help the website answer real questions, organize clear first drafts, and maintain useful information more consistently.',
    aiCannotHelp: 'It cannot replace a clear offer, real evidence, accessibility, technical quality, or the person who follows up after an inquiry.',
    caseStudy: {
      title: 'Johnson Heating & Air Conditioning',
      description: 'See a connected customer path that brings website, visibility, campaign work, and follow-up together.',
      path: '/case-studies/johnson-heating'
    },
    service: {
      title: 'When the whole customer path needs attention',
      description: 'If the problem goes beyond one page, NTA can help examine the connected path from discovery through inquiry and follow-up.',
      path: '/services/website-rebuilds',
      label: 'Explore website support'
    }
  },
  'how-can-my-business-show-up-in-chatgpt-and-ai-search': {
    examples: [
      {
        title: 'Be specific about the work',
        text: 'Explain each important service in the words customers use, including the useful details that help someone understand whether the business is a fit.'
      },
      {
        title: 'Keep public information consistent',
        text: 'Check that website details, business listings, hours, service area, and customer-facing facts agree where people and search systems may find them.'
      },
      {
        title: 'Publish answers that deserve to be reused',
        text: 'Turn honest answers to customer questions into accessible website content that people can understand and systems can discover.'
      }
    ],
    aiCanHelp: 'AI can help organize questions, find inconsistencies, and prepare clear first drafts from approved business information.',
    aiCannotHelp: 'It cannot guarantee a recommendation, control what any AI system says, or substitute thin claims for accurate, useful evidence.'
  },
  'what-should-i-automate-in-my-small-business': {
    examples: [
      {
        "title": "Illustrative process: a new inquiry",
        "text": "Imagine a new service request arriving through a website. A fixed rule can place it in the right queue. An AI assistant can help a person summarize it or draft a reply when asked. An agent can choose and carry out steps using tools it has been permitted to use. These are different levels of responsibility."
      },
      {
        "title": "Give it a small, clear job",
        "text": "In this fictional trial, the system may read the request and approved service facts, prepare an internal summary, and create a draft for review. It may not send the reply, set a price, confirm an appointment, or make a customer promise."
      },
      {
        "title": "Give exceptions a person",
        "text": "Missing information, conflicting service details, or an unusual customer situation should go to the named owner with the original request attached. Record what happened and what still needs a decision. Test ordinary and exception cases before approving any wider action."
      }
    ],
    aiCanHelp: 'AI can help automate repeated preparation, organization, reminders, and handoffs after the business has made the process clear.',
    aiCannotHelp: 'It should not be left to make unreviewed decisions, resolve unusual customer situations, set promises, or handle sensitive information without approved safeguards.',
    service: {
      title: 'When a repeated process needs a connected system',
      description: 'NTA can help a business clarify and connect the information, tasks, and people behind a process before adding technology to it.',
      path: '/back-office-solutions',
      label: 'Explore connected back-office support'
    }
  },
  'is-ai-safe-for-my-small-business-and-customer-data': {
    examples: [
      {
        title: 'Set an approved-use boundary',
        text: 'Give the team a short, clear rule about what types of information may be used with an AI tool and what information must not be entered.'
      },
      {
        title: 'Check the tool before using it',
        text: 'Use the business account and settings you have approved. Understand who can access it, what its privacy controls are, and how it handles information.'
      },
      {
        title: 'Keep customer-facing work accountable',
        text: 'Have a person check any customer-facing draft, especially when it involves a promise, a personal situation, a price, or sensitive information.'
      }
    ],
    aiCanHelp: 'AI can support work more safely when the business chooses approved tools, sets clear boundaries, and keeps human review around meaningful outcomes.',
    aiCannotHelp: 'It cannot make a business compliant by itself or remove the need for privacy, security, legal, or industry-specific judgment when those are relevant.'
  },
  'is-ai-worth-it-for-a-small-business': {
    examples: [
      {
        title: 'Measure a real task',
        text: 'Test AI against one repeated job and compare the time, quality, and amount of rework before deciding whether it is worth continuing.'
      },
      {
        title: 'Keep the first experiment small',
        text: 'Use a low-risk task with a clear owner and a clear result instead of buying a large bundle of tools or changing every process at once.'
      },
      {
        title: 'Look for work that leaves an asset behind',
        text: 'The best early use often creates an approved answer, a repeatable checklist, or clearer business knowledge that keeps helping after the first test.'
      }
    ],
    aiCanHelp: 'AI can be worth the effort when it improves a clear piece of work and leaves the business with more useful knowledge, time, or consistency.',
    aiCannotHelp: 'It cannot create value from a vague goal, compensate for a weak process, or justify a tool nobody has a responsible plan to use.'
  }
};

export function getQuestionExperience(slug) {
  return questionExperienceBySlug[String(slug || '').toLowerCase()] || null;
}
