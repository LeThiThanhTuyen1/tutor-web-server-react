"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, ChevronDown, ChevronUp, Search } from "lucide-react";
import { fadeIn } from "@/components/layout/animation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFAQs = faqItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    ...Array.from(new Set(faqItems.map((item) => item.category))),
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <motion.div
        variants={fadeIn("up", 0.1)}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto"
      >
        <header className="mb-10">
          <div className="flex items-center mb-4">
            <HelpCircle className="h-8 w-8 mr-3 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Find answers to common questions about TutorConnect, our services,
            and how our platform works.
          </p>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for questions or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-gray-800 rounded-mdpl-10 py-3 w-full"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={`capitalize ${
                  activeCategory === category
                    ? "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                    : "bg-white dark:bg-gray-800 rounded-md"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </header>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((item, index) => (
              <Card
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-md overflow-hidden transition-all duration-200 ${
                  expandedItems.includes(index) ? "shadow-md" : ""
                }`}
              >
                <button
                  className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                  onClick={() => toggleItem(index)}
                >
                  <h3 className="text-lg font-medium">{item.question}</h3>
                  {expandedItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {expandedItems.includes(index) && (
                  <CardContent className="pt-0 pb-4">
                    <div className="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none">
                      <p>{item.answer}</p>
                    </div>
                    <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                      Category:{" "}
                      <span className="capitalize">{item.category}</span>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We couldn't find any FAQs matching your search. Try different
                keywords or browse by category.
              </p>
            </div>
          )}
        </div>

        {/* Still Have Questions */}
        <div className="mt-16 bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Still Have Questions?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            If you couldn't find the answer you were looking for, our support
            team is here to help. Reach out to us and we'll get back to you as
            soon as possible.
          </p>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
            onClick={() => (window.location.href = "/contact")}
          >
            Contact Support
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

const faqItems: FAQItem[] = [
  {
    question: "How do I sign up for TutorConnect?",
    answer:
      "To sign up for TutorConnect, click on the 'Sign Up' button in the top right corner of the homepage. You'll be asked to provide some basic information and choose whether you're signing up as a student or a tutor. Follow the prompts to complete your profile, and you'll be ready to start using our platform.",
    category: "account",
  },
  {
    question: "What are the requirements to become a tutor?",
    answer:
      "To become a tutor on TutorConnect, you need to have expertise in the subject(s) you wish to teach, provide verification of your qualifications (such as degrees, certifications, or relevant experience), pass our background check, and complete our tutor onboarding process. We also require tutors to maintain a high standard of professionalism and teaching quality.",
    category: "tutors",
  },
  {
    question: "How much does it cost to use TutorConnect?",
    answer:
      "For students, creating an account on TutorConnect is free. You only pay for the tutoring sessions you book. Tutor rates vary depending on their experience, qualifications, and subject matter. For tutors, we charge a small service fee on each completed session, which helps us maintain and improve the platform.",
    category: "payments",
  },
  {
    question: "How do payments work?",
    answer:
      "TutorConnect handles all payments securely through our platform. Students pay for sessions at the time of booking or according to the payment schedule agreed upon. Tutors receive payment after the session is completed, minus our service fee. We support various payment methods including credit/debit cards and PayPal.",
    category: "payments",
  },
  {
    question: "Can I cancel a booked session?",
    answer:
      "Yes, both students and tutors can cancel sessions. For a full refund, cancellations must be made at least 24 hours before the scheduled session. Cancellations with less notice may result in partial charges, depending on the tutor's cancellation policy. Emergency situations are handled on a case-by-case basis by our support team.",
    category: "sessions",
  },
  {
    question: "How are tutors vetted?",
    answer:
      "We take tutor quality seriously. All tutors go through a comprehensive verification process that includes checking their credentials, experience, and subject knowledge. We also conduct background checks and require tutors to complete a demonstration of their teaching abilities. Additionally, our rating and review system helps maintain quality standards.",
    category: "tutors",
  },
  {
    question: "What subjects are available for tutoring?",
    answer:
      "TutorConnect offers tutoring in a wide range of subjects including mathematics, sciences, languages, humanities, test preparation, music, arts, and more. You can browse available subjects through our search feature or filter tutors by subject specialization.",
    category: "sessions",
  },
  {
    question: "Can I choose between online and in-person tutoring?",
    answer:
      "Yes, TutorConnect offers both online and in-person tutoring options. When searching for tutors, you can filter by teaching mode preference. Online sessions are conducted through our integrated video platform, while in-person sessions are arranged between the tutor and student at a mutually convenient location.",
    category: "sessions",
  },
  {
    question: "How do I leave a review for my tutor?",
    answer:
      "After completing a session, you'll receive a prompt to leave a review for your tutor. You can rate your experience on a scale of 1-5 stars and provide written feedback. Reviews help maintain quality on our platform and assist other students in finding the right tutor for their needs.",
    category: "sessions",
  },
  {
    question: "What if I'm not satisfied with my tutoring session?",
    answer:
      "If you're not satisfied with your tutoring session, please contact our support team within 24 hours of the completed session. We take quality concerns seriously and will work with you to resolve the issue, which may include a partial or full refund depending on the circumstances.",
    category: "sessions",
  },
  {
    question: "How do I reset my password?",
    answer:
      "To reset your password, click on the 'Login' button, then select 'Forgot Password'. Enter the email address associated with your account, and we'll send you instructions to create a new password. If you don't receive the email, check your spam folder or contact our support team for assistance.",
    category: "account",
  },
  {
    question: "Can I change my tutor after starting a course?",
    answer:
      "Yes, you can change your tutor if you feel they're not the right fit for your learning needs. Contact our support team, and we'll help you find a new tutor and transfer any remaining prepaid sessions. Please note that some tutors may have specific policies regarding course transfers.",
    category: "sessions",
  },
  {
    question: "How do I track my progress as a student?",
    answer:
      "TutorConnect provides a dashboard where students can track their progress. This includes session history, upcoming sessions, course materials, and feedback from tutors. Some tutors also provide progress reports and assessments to help you monitor your improvement over time.",
    category: "students",
  },
  {
    question: "As a tutor, how do I get paid?",
    answer:
      "Tutors receive payments through our secure payment system. After completing a session, the payment is processed and transferred to your linked bank account or payment method, minus our service fee. Payments are typically processed within 3-5 business days after the session is marked as completed.",
    category: "payments",
  },
  {
    question: "Can I schedule recurring sessions?",
    answer:
      "Yes, both tutors and students can set up recurring sessions. When booking a session, select the 'Make this recurring' option and choose your preferred frequency (weekly, bi-weekly, etc.). You can manage or cancel recurring sessions through your dashboard at any time.",
    category: "sessions",
  },
  {
    question: "What technology do I need for online tutoring?",
    answer:
      "For online tutoring, you'll need a computer or tablet with a reliable internet connection, a webcam, and a microphone. We recommend using the latest version of Chrome, Firefox, or Safari browsers. Some sessions may require additional software or tools depending on the subject (e.g., coding environments, digital whiteboards), which your tutor will communicate in advance.",
    category: "technical",
  },
  {
    question: "How do I report inappropriate behavior?",
    answer:
      "We take the safety and comfort of our users seriously. If you experience inappropriate behavior, please report it immediately through the 'Report' button on the user's profile or session details, or contact our support team directly. All reports are handled confidentially and investigated promptly.",
    category: "safety",
  },
  {
    question: "Can I get a refund if I need to cancel my subscription?",
    answer:
      "Refund policies for subscriptions depend on the specific terms of your subscription plan. Generally, we offer prorated refunds for unused portions of subscription periods. Please contact our support team with your specific situation, and we'll work with you to find a fair solution.",
    category: "payments",
  },
  {
    question: "How do I become a featured tutor on the platform?",
    answer:
      "Featured tutors are selected based on several factors including consistent high ratings, session completion rate, student feedback, and subject matter expertise. To increase your chances, maintain excellent service quality, complete your profile fully, obtain positive reviews, and actively participate in the TutorConnect community.",
    category: "tutors",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Yes, protecting your personal information is a top priority for us. We use industry-standard encryption and security measures to safeguard your data. We never share your personal information with third parties without your consent, except as required by law. For more details, please review our Privacy Policy.",
    category: "safety",
  },
];
