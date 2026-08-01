import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import growthGuideSurfer from '@/assets/brand/nta-growth-guide-surfer.webp';

const growthSteps = [
  {
    title: 'Build a Strong Foundation',
    description: 'Strengthen your website, message, and essential systems before spending more on promotion.'
  },
  {
    title: 'Help More Customers Find You',
    description: 'Improve visibility so the right local customers can discover and understand your business.'
  },
  {
    title: 'Build Trust and Relationships',
    description: 'Use helpful content, reputation, and consistent follow-up to turn attention into confidence.'
  },
  {
    title: 'Save Time with Practical AI',
    description: 'Automate repetitive work and improve follow-up without losing the human judgment that makes your business valuable.'
  }
];

export default function HeroSection() {
  const openGrowthGuide = () => {
    window.dispatchEvent(new CustomEvent('nta:open-growth-guide', {
      detail: { source: 'homepage_hero' }
    }));
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://media.base44.com/images/public/691f41a18de4a7f498c8f884/edfc63215_Minimalisticrobotdeskworkspace.png")' }}
      >
        <div className="absolute inset-0 bg-slate-950/85" />
      </div>

      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-30 pointer-events-none blur-3xl z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="text-center max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400 mb-5"
          >
            Welcome to the NTA Digital Growth Office™
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-8"
          >
            Work with AI without changing how you work.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed space-y-5"
          >
            <p>
              Speak naturally or type a note. The Digital Growth Guide helps you explain your business, organize what matters, and find the right next step—with human judgment still in control.
            </p>
            <p>
              Behind the conversation is NTA's practical AI education, business knowledge, and hands-on help. You can learn at your own pace, talk through a problem, or ask Rick to join when a human conversation would help.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-14"
        >
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400 mb-3">Learn it. Apply it. Build with it.</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white">How Practical AI Becomes Useful</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {growthSteps.map((step, index) => (
              <div key={step.title} className="bg-slate-900/75 border border-slate-700/80 rounded-2xl p-6 text-left backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-full bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-300 font-bold">
                    {index + 1}
                  </span>
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button type="button" onClick={openGrowthGuide} size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] border-0 px-8">
            <img src={growthGuideSurfer} alt="" className="w-9 h-9 -ml-3 mr-2 object-contain" />
            Talk to My Office™
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-slate-950/40 border-slate-600 text-white hover:bg-slate-800 hover:text-white px-8">
            <Link to="/operating-system">
              See How the System Works
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Start by talking. The Guide can help you think it through, and Rick can join when you want a person involved.
        </p>
      </div>
    </section>
  );
}
