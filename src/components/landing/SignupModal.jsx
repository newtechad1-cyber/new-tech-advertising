import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function SignupModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Application received! We\'ll contact you within 24 hours.');
    setIsSubmitting(false);
    onClose();
    setFormData({ name: '', email: '', phone: '', businessName: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Start Your 30-Day Trial
                </h3>
                <p className="text-white/90 text-sm">
                  No payment required today. We'll contact you to get started.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <Label htmlFor="name" className="text-slate-700 font-medium">
                    Your Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-slate-700 font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-2"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="businessName" className="text-slate-700 font-medium">
                    Business Name *
                  </Label>
                  <Input
                    id="businessName"
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="mt-2"
                    placeholder="Your Business LLC"
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-800">
                    ✓ 30-day money-back guarantee<br />
                    ✓ No payment required today<br />
                    ✓ Cancel anytime, no questions asked
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-6 text-lg rounded-xl shadow-lg group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-slate-500 text-center">
                  By submitting, you agree to receive communication about our services.
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}