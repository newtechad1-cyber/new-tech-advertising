import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Handshake,
  HeartHandshake,
  Lightbulb,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import MarketingNav from "@/components/nav/MarketingNav";
import SiteFooter from "@/components/marketing/SiteFooter";
import SEOHead from "@/components/shared/SEOHead";

const STARTING_POINTS = [
  {
    title: "Explore the learning first",
    text: "Use the free NTA lessons, books, Growth Show, and Your Digital Growth Guide™ yourself. You do not need to buy a course or memorize a presentation before you begin.",
    icon: BookOpen,
  },
  {
    title: "Listen for the real questions",
    text: "Talk with business owners, members, or neighbors about what they are trying to understand, what is changing, and where they feel stuck.",
    icon: HeartHandshake,
  },
  {
    title: "Bring people into a useful conversation",
    text: "Share a lesson, invite people to a learning session, or introduce NTA when a real question comes up. The first goal is understanding.",
    icon: MessageCircle,
  },
  {
    title: "Decide what serves the community",
    text: "If there is a meaningful next step, NTA helps shape it with the people involved. Nobody is pushed into a decision they do not understand.",
    icon: CheckCircle2,
  },
];

const INDIVIDUAL_FIT = [
  "People early in a career who want to learn something useful and build relationships.",
  "Working professionals who want a meaningful part-time opportunity.",
  "Retired or semi-retired people with trusted community and business relationships.",
  "Media, sales, business-development, nonprofit, or community-minded people who enjoy helping others learn.",
];

const ORGANIZATION_FIT = [
  "Chambers of Commerce and business associations",
  "Economic-development and Main Street organizations",
  "Local media, banks, professional groups, and community nonprofits",
  "Any organization that wants to give local businesses practical, free learning before asking them to make a decision",
];

const EMPTY_FORM = {
  full_name: "",
  email: "",
  phone: "",
  city: "",
  partner_path: "",
  organization_name: "",
  organization_type: "",
  organization_website: "",
  relationship_context: "",
  interest_reason: "",
  website: "",
};

export default function CommunityPartnerProgram() {
  const formRef = useRef(null);
  const [formStartedAt] = useState(() => Date.now());
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const params = new URLSearchParams(window.location.search);
    const campaign = {
      source: params.get("utm_source") || params.get("source") || "website",
      medium: params.get("utm_medium") || params.get("medium") || "",
      name: params.get("utm_campaign") || params.get("campaign") || "",
      path: window.location.pathname + window.location.search,
    };

    try {
      const response = await base44.functions.invoke("ntaUnifiedIntake", {
        submission_type: "community_partner_inquiry",
        offer_type: "community_partnership",
        mapping_confidence: "hardcoded",
        mapping_notes: "NTA Community Partnership inquiry.",
        source_system: "website",
        source_page: campaign.path,
        source_campaign: "community_partnership",
        name: form.full_name,
        business_name: form.organization_name || "NTA Community Partnership",
        email: form.email,
        phone: form.phone,
        city: form.city,
        notes: [
          "NTA Community Partnership inquiry.",
          form.partner_path ? "Partnership path: " + form.partner_path : "",
          form.organization_name ? "Organization: " + form.organization_name : "",
          form.organization_type ? "Organization type: " + form.organization_type : "",
          form.organization_website ? "Organization website: " + form.organization_website : "",
          form.relationship_context ? "Relationships, market, or community: " + form.relationship_context : "",
          form.interest_reason ? "What they want to explore: " + form.interest_reason : "",
          campaign.source ? "Campaign source: " + campaign.source : "",
          campaign.medium ? "Campaign medium: " + campaign.medium : "",
          campaign.name ? "Campaign: " + campaign.name : "",
        ].filter(Boolean).join("\n"),
        detected_route: campaign.path,
        detected_component: "CommunityPartnerProgram",
        priority: "high",
        is_high_intent: true,
        skip_webhook: true,
        anti_spam: {
          honeypot: form.website,
          form_started_at: formStartedAt,
        },
      });
      const data = response?.data ?? response;

      if (data?.error || data?.success === false) {
        throw new Error(data?.error || "We could not save your message.");
      }

      setSubmitted(true);
    } catch (submitError) {
      console.error("NTA Community Partnership inquiry error:", submitError);
      setError(submitError?.message || "Something went wrong. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <SEOHead
        title="Community Partnership | Practical AI Learning for Local Businesses | New Tech Advertising"
        description="Help your community explore practical AI and digital-growth learning through a relationship built on education, trust, and shared value."
        canonical="https://newtechadvertising.com/community-partner"
      />
      <MarketingNav />

      <main>
        <section className="relative overflow-hidden bg-slate-950 px-6 pb-24 pt-32 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,.3),transparent_52%),linear-gradient(135deg,#0f172a,#020617)]" />
          <div className="relative mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1.5 text-sm font-semibold text-blue-200">
              <Handshake className="h-4 w-4" />
              NTA Community Partnership
            </div>
            <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Help your community learn what comes next.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
              New Tech Advertising helps trusted people and organizations give local business owners a place to understand AI, technology, and digital growth without a hard sell. The knowledge is free to explore. The work begins by opening an honest conversation.
            </p>
            <div className="mx-auto mt-7 max-w-3xl rounded-2xl border border-cyan-300/20 bg-slate-900/70 px-5 py-4 text-left text-slate-200">
              <p className="font-semibold text-cyan-200">
                No course to buy. No script to memorize. No decision required before people understand what they are looking at.
              </p>
            </div>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white transition hover:bg-blue-500"
              >
                Start a partnership conversation <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/community-growth-conversation"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-900 px-6 py-3.5 font-bold text-white transition hover:border-slate-400 hover:bg-slate-800"
              >
                Explore the community conversation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Why this is built differently</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Give away the understanding first.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Too many people have been sold the next program, secret, or shortcut and then left to figure it out alone. NTA takes the opposite approach: the Knowledge Library, Growth Show, Free AI Guy, and Your Digital Growth Guide™ are there to help people learn before they decide whether to become involved.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              A community partner is not asked to pressure people into a purchase. They help useful knowledge reach people who can benefit from it.
            </p>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-100 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Two ways to participate</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">A person can open a door. An organization can open many.</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <HeartHandshake className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-slate-900">Individual community connector</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  This is for people at any stage of life who enjoy learning, care about their local business community, and know how to start a genuine conversation. It is also a way to build a book of relationships that can produce upfront and ongoing residual commissions.
                </p>
                <ul className="mt-6 space-y-3 text-slate-700">
                  {INDIVIDUAL_FIT.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                  <Building2 className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-slate-900">Community organization</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  This is for groups that want to create practical member value and help businesses respond to changing technology together. The individual who brings the organization can participate personally, and the organization can also receive agreed relationship-based revenue.
                </p>
                <ul className="mt-6 space-y-3 text-slate-700">
                  {ORGANIZATION_FIT.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">How it begins</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">Start with learning. Let the right work grow from there.</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                The first goal is not to make a sale. It is to help people see what is changing and decide whether a next step would be useful.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {STARTING_POINTS.map(({ title, text, icon: Icon }, index) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <Icon className="h-7 w-7 text-blue-700" />
                    <span className="text-2xl font-black text-slate-300">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-900 px-6 py-20 text-white">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">What NTA brings</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">You bring the trust. NTA brings the learning and support system.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-300">
                You do not have to become an AI or marketing expert. NTA has been built to help people learn, ask better questions, and find a realistic path forward.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Free Knowledge Library lessons and videos",
                "The Free AI Guy and Your Digital Growth Guide™ for questions and learning",
                "The NTA Growth Show and practical examples",
                "Discovery conversations that listen before recommending",
                "Growth Roadmaps when a business is ready for a next step",
                "Human guidance, strategy, and delivery support",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                  <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                  <p className="text-sm leading-relaxed text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-700 bg-slate-950 px-6 py-20 text-white">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-4xl text-center">
              <CircleDollarSign className="mx-auto h-10 w-10 text-cyan-300" />
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">Build a relationship-based residual income</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">The goal is not to start from zero every month.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-300">
                A community partner is building a book of active client relationships. As those clients continue with NTA, the relationship can continue generating residual commissions under the written agreement. That gives a person the chance to build income over time instead of relying only on the next new sale.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <article className="rounded-2xl border border-cyan-300/20 bg-cyan-400/5 p-6">
                <h3 className="text-xl font-bold text-white">Individual partner</h3>
                <p className="mt-3 leading-relaxed text-slate-300">
                  You can earn agreed upfront commissions when a new relationship begins and residual commissions while the clients you introduced remain active.
                </p>
              </article>
              <article className="rounded-2xl border border-blue-300/20 bg-blue-500/10 p-6">
                <h3 className="text-xl font-bold text-white">Organization partner—and the person who opened the door</h3>
                <p className="mt-3 leading-relaxed text-slate-300">
                  When you bring an organization to NTA, the arrangement can create income for you personally and for the organization you represent. It is both: a personal opportunity and a way to create new, relationship-based revenue for the organization.
                </p>
              </article>
            </div>
            <p className="mx-auto mt-7 max-w-4xl text-center text-sm leading-relaxed text-slate-400">
              Actual commissions, residuals, and payment terms are set out in writing before a commitment is made. They depend on the agreement and on clients remaining active.
            </p>
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-20">
          <div className="mx-auto max-w-4xl rounded-3xl border border-blue-200 bg-blue-50 p-8 text-center md:p-12">
            <MapPin className="mx-auto h-9 w-9 text-blue-700" />
            <h2 className="mt-5 text-3xl font-bold text-slate-900">Strong businesses help build strong communities.</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-700">
              When a partnership creates useful work and an ongoing relationship, it can create meaningful value for the community and ongoing residual income for the people and organizations that helped build it. NTA discusses the terms plainly and puts them in writing before anyone commits.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              A Chamber, organization, or individual can help introduce the learning. NTA remains responsible for listening carefully, deciding whether it can genuinely help, and supporting the work that follows.
            </p>
          </div>
        </section>

        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm md:p-12" ref={formRef}>
            {submitted ? (
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
                <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Conversation started</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">Thank you for reaching out.</h2>
                <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
                  Rick or the NTA team will review your note and follow up about a private conversation.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link to="/community-growth-conversation" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white hover:bg-blue-700">
                    Keep exploring the community conversation <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/account-manager" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3.5 font-bold text-slate-900 hover:border-blue-400 hover:bg-blue-50">
                    Explore the individual opportunity <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mx-auto max-w-3xl text-center">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Begin with a real conversation</p>
                  <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">Tell us what community or organization you care about.</h2>
                  <p className="mt-5 text-lg leading-relaxed text-slate-600">
                    This is not a purchase or a commitment. It is the beginning of a private conversation about the people, relationships, and local opportunity you have in mind.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-3xl space-y-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Full name *
                      <input required name="full_name" value={form.full_name} onChange={updateForm} autoComplete="name" placeholder="Jane Smith" className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Email *
                      <input required type="email" name="email" value={form.email} onChange={updateForm} autoComplete="email" placeholder="jane@example.com" className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Phone <span className="font-normal text-slate-500">(optional)</span>
                      <input type="tel" name="phone" value={form.phone} onChange={updateForm} autoComplete="tel" placeholder="(507) 000-0000" className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Your city or region *
                      <input required name="city" value={form.city} onChange={updateForm} placeholder="Mason City, Iowa" className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </label>
                  </div>

                  <label className="block text-sm font-semibold text-slate-700">
                    I am reaching out as *
                    <select required name="partner_path" value={form.partner_path} onChange={updateForm} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                      <option value="">Choose one</option>
                      <option value="Individual community connector">An individual who wants to help a community learn</option>
                      <option value="Organization representative">Someone representing a Chamber, organization, or group</option>
                    </select>
                  </label>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Organization or group {form.partner_path === "Organization representative" ? "*" : "(optional)"}
                      <input required={form.partner_path === "Organization representative"} name="organization_name" value={form.organization_name} onChange={updateForm} placeholder="North Iowa Chamber" className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Organization type <span className="font-normal text-slate-500">(optional)</span>
                      <input name="organization_type" value={form.organization_type} onChange={updateForm} placeholder="Chamber, nonprofit, bank, media..." className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </label>
                  </div>

                  <label className="block text-sm font-semibold text-slate-700">
                    Organization website <span className="font-normal text-slate-500">(optional)</span>
                    <input type="url" name="organization_website" value={form.organization_website} onChange={updateForm} placeholder="https://example.org" className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                  </label>

                  <label className="block text-sm font-semibold text-slate-700">
                    Tell us about the business relationships, market, or community you know
                    <textarea name="relationship_context" value={form.relationship_context} onChange={updateForm} rows={4} placeholder="Who do you already know, what businesses or members do you serve, or what conversations could you naturally begin?" className="mt-1.5 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                  </label>

                  <label className="block text-sm font-semibold text-slate-700">
                    What would you like to explore?
                    <textarea name="interest_reason" value={form.interest_reason} onChange={updateForm} rows={4} placeholder="A few sentences are enough." className="mt-1.5 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                  </label>

                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="community-partner-website">Website</label>
                    <input id="community-partner-website" name="website" value={form.website} onChange={updateForm} tabIndex="-1" autoComplete="off" />
                  </div>

                  {error && <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

                  <button type="submit" disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 text-lg font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                    {submitting ? "Sending…" : <>Start the partnership conversation <ArrowRight className="h-5 w-5" /></>}
                  </button>
                  <p className="text-center text-sm leading-relaxed text-slate-500">
                    Your information is used to respond to this partnership inquiry. Please do not include confidential information from a current or former employer.
                  </p>
                </form>
              </>
            )}
          </div>
        </section>

        <section className="bg-slate-950 px-6 py-16 text-center text-white">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">Building your own opportunity?</p>
            <h2 className="mt-3 text-3xl font-bold">The individual Account Manager path may be a better fit.</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">
              If you want to begin with your own relationships, learn alongside business owners, and build a relationship-based opportunity one conversation at a time, start there.
            </p>
            <Link to="/account-manager" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-300">
              Explore the Account Manager opportunity <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
