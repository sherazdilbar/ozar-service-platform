'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    inquiryType: 'General Inquiry',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => setIsSubmitting(false), 1500);
  };

  const faqs = [
    {
      question: 'How quickly will I get a response?',
      answer: 'We typically respond within 24 hours during business days. For urgent service issues, please check your booking confirmation for direct provider contact details.'
    },
    {
      question: 'How do I report an issue with a service provider?',
      answer: 'You can report issues directly through your booking page or by emailing us at teamozarhu@gmail.com. We take all reports seriously and investigate immediately.'
    },
    {
      question: 'Can I request a specific professional?',
      answer: 'Yes, you can search for and request specific professionals by name or browse their profiles to see availability before booking.'
    },
    {
      question: 'What areas does Ozar cover?',
      answer: 'We currently operate in Budapest and surrounding areas. We are expanding to other major cities in Hungary soon.'
    },
    {
      question: 'How do I become a service provider on Ozar?',
      answer: 'Visit our Partner page or send us a Partnership inquiry using the form on this page. We review all applications within 3-5 business days.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative w-full py-16 md:py-20 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                Contact Us
              </h1>
              <div className="w-16 h-0.5 bg-teal-600 mb-8 rounded-full" />
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                We'd love to hear from you. Reach out and we'll respond as soon as we can.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="w-full py-16 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-sm font-medium tracking-widest text-teal-600 uppercase mb-2">
                Get in Touch
              </h2>
            </div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
            >
              {/* Email */}
              <motion.a
                href="mailto:teamozarhu@gmail.com"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                }}
                className="group flex flex-col items-start p-4 pl-6 border-l-2 border-teal-100 dark:border-teal-900 hover:border-teal-600 dark:hover:border-teal-500 transition-colors duration-300"
              >
                <div className="flex items-center mb-3">
                  <Mail className="w-5 h-5 text-teal-600 dark:text-teal-500 mr-3" />
                  <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Email
                  </span>
                </div>
                <span className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                  teamozarhu@gmail.com
                </span>
              </motion.a>

              {/* Phone */}
              <motion.a
                href="tel:+36705681248"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                }}
                className="group flex flex-col items-start p-4 pl-6 border-l-2 border-teal-100 dark:border-teal-900 hover:border-teal-600 dark:hover:border-teal-500 transition-colors duration-300"
              >
                <div className="flex items-center mb-3">
                  <Phone className="w-5 h-5 text-teal-600 dark:text-teal-500 mr-3" />
                  <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Call
                  </span>
                </div>
                <span className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                  +36 70 568 1248
                </span>
              </motion.a>

              {/* Location */}
              <motion.a
                href="#"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                }}
                className="group flex flex-col items-start p-4 pl-6 border-l-2 border-teal-100 dark:border-teal-900 hover:border-teal-600 dark:hover:border-teal-500 transition-colors duration-300"
              >
                <div className="flex items-center mb-3">
                  <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-500 mr-3" />
                  <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Visit
                  </span>
                </div>
                <span className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                  Budapest, Hungary
                </span>
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* Contact Form & FAQ Section */}
        <section className="w-full py-20 bg-gray-50/50 dark:bg-gray-800/30">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
              {/* Left Column: Contact Form */}
              <div className="w-full lg:w-7/12">
                <h2 className="text-sm font-medium tracking-widest text-teal-600 uppercase mb-8">
                  Send Us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-3 px-4"
                        placeholder="Jane Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-3 px-4"
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="inquiryType"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Inquiry Type
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-3 px-4"
                    >
                      <option>General Inquiry</option>
                      <option>Service Issue</option>
                      <option>Partnership</option>
                      <option>Billing</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-3 px-4"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-3 px-4 resize-y"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70 transition-colors duration-200"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Typically responds within 24 hours</span>
                  </div>
                </form>
              </div>

              {/* Right Column: FAQ */}
              <div className="w-full lg:w-5/12">
                <h2 className="text-sm font-medium tracking-widest text-teal-600 uppercase mb-8">
                  Frequently Asked Questions
                </h2>

                <div className="space-y-1">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full py-4 flex items-center justify-between text-left focus:outline-none group"
                      >
                        <span
                          className={`text-sm md:text-base font-medium transition-colors duration-200 ${
                            openIndex === index
                              ? 'text-teal-700 dark:text-teal-400'
                              : 'text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400'
                          }`}
                        >
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform duration-300 ${
                            openIndex === index
                              ? 'transform rotate-180 text-teal-600 dark:text-teal-400'
                              : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {openIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
