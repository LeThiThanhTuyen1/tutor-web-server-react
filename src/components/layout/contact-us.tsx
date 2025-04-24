"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import { fadeIn } from "@/components/layout/animation";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [message, setMessage] = useState("");
  // const [subject, setSubject] = useState("");
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const { toast, toasts, dismiss } = useToast();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // Basic validation
  //   if (!name || !email || !message || !subject) {
  //     toast({
  //       title: "Error",
  //       description: "Please fill in all fields",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   // Simulate form submission
  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  //   toast({
  //     title: "Success",
  //     description: "Your message has been sent. We'll get back to you soon.",
  //     variant: "success",
  //   });

  //   // Reset form
  //   setName("");
  //   setEmail("");
  //   setMessage("");
  //   setSubject("");
  //   setIsSubmitting(false);
  // };

  return (
    <div className="container mx-auto py-10 px-4">
      <motion.div
        variants={fadeIn("up", 0.1)}
        initial="hidden"
        animate="show"
        className="max-w-8xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white dark:bg-gray-800 rounded-md">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-gray-600 dark:text-gray-300">
                +1 (123) 456-7890
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Mon-Fri 9am-5pm
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 rounded-md">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-300">
                support@tutorconnect.com
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                info@tutorconnect.com
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 rounded-md">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <p className="text-gray-600 dark:text-gray-300">
                123 Education Ave
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                San Francisco, CA 94105
              </p>
            </CardContent>
          </Card>
        </div>

        {/* <Card className="bg-white dark:bg-gray-800 rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
              Send Us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-2"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700"
                  placeholder="Type your message here..."
                ></textarea>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card> */}

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <Card
                className="bg-white dark:bg-gray-800 rounded-md"
                key={index}
              >
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {item.question}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.div>
      {/* <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
        dismiss={dismiss}
      /> */}
    </div>
  );
}

const faqItems = [
  {
    question: "How do I sign up as a tutor?",
    answer:
      "To sign up as a tutor, you'll need to create an account, select the 'Tutor' option during registration, and complete your profile with your qualifications, experience, and subjects you can teach.",
  },
  {
    question: "How do payments work?",
    answer:
      "Payments are handled securely through our platform. Students pay for classes through TutorConnect, and tutors receive payment after the session is completed, minus a small platform fee.",
  },
  {
    question: "Can I cancel a booked session?",
    answer:
      "Yes, both tutors and students can cancel sessions with at least 24 hours notice without penalty. Cancellations with less notice may result in partial charges depending on your agreement.",
  },
  {
    question: "How are tutors vetted?",
    answer:
      "All tutors go through a verification process that includes checking credentials, experience, and subject knowledge. We also use a rating system to ensure quality standards are maintained.",
  },
];
