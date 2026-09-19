import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Building2, Wrench, Briefcase, Heart } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

export default function IndustriesHub() {
  const industries = [
    {
      icon: Building2,
      title: 'Small Local Businesses',
      description: 'Connect customer questions, team knowledge, visibility, follow-up and everyday operations.',
      href: '/industries/small-local'
    },
    {
      icon: Wrench,
      title: 'Service Trades',
      description: 'Capture field knowledge and connect seasonal demand, customer communication and operations.',
      href: '/industries/service-trades'
    },
    {
      icon: Briefcase,
      title: 'Professional Offices',
      description: 'Turn expertise, client questions and internal knowledge into clearer communication and systems.',
      href: '/industries/professionals'
    },
    {
      icon: Heart,
      title: 'Nonprofits & Community',
      description: 'Help teams preserve knowledge, communicate their mission and make practical growth decisions.',
      href: '/industries/nonprofits'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead title="Digital Growth Roadmaps by Industry | New Tech Advertising" description="See how NTA starts with the people, customers, knowledge, systems and goals inside different kinds of businesses before recommending growth tactics." />
      <MarketingNav />

      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Every Industry Is Different. The Starting Point Is the Business.
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choose an industry to see the kinds of questions worth asking. NTA does not begin with a preset package. We begin with the people, customers, knowledge, systems and goals already inside the business, then build a practical Digital Growth Roadmap™.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <a href={industry.href} key={index} className="block">
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl mb-2">{industry.title}</CardTitle>
                      <CardDescription className="text-base text-slate-600">
                        {industry.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        Explore <ArrowRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 px-6 text-center"><div className="max-w-3xl mx-auto"><h2 className="text-3xl font-black text-white">Your industry gives us context. Your business gives us the Roadmap.</h2><p className="mt-4 text-slate-300">Start with the question or problem you have now. We will help connect it to the larger business.</p><a href="/start" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white hover:bg-blue-500">Start a Free Growth Conversation <ArrowRight className="w-5 h-5" /></a></div></section>
      <SiteFooter />
    </div>
  );
}