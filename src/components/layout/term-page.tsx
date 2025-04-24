"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { fadeIn } from "@/components/layout/animation";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        variants={fadeIn("up", 0.1)}
        initial="hidden"
        animate="show"
        className="max-w-8xl mx-auto"
      >
        <header className="mb-10">
          <div className="flex items-center mb-4">
            <FileText className="h-8 w-8 mr-3 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-3xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: April 21, 2024
          </p>
        </header>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4 ">
              1. Agreement to Terms
            </h2>
            <p>
              Welcome to TutorConnect. By accessing our website and using our
              services, you agree to be bound by these Terms of Service and our
              Privacy Policy. If you disagree with any part of these terms, you
              may not access our services.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              2. Description of Services
            </h2>
            <p>
              TutorConnect is an online platform that connects students with
              qualified tutors. Our services include:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Tutor profiles and discovery</li>
              <li>Scheduling and booking of tutoring sessions</li>
              <li>Communication tools for tutors and students</li>
              <li>Payment processing for tutoring services</li>
              <li>Online course offerings and educational resources</li>
              <li>Rating and review system</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p>
              To access most features of TutorConnect, you must register for an
              account. You agree to provide accurate, current, and complete
              information during the registration process and to update such
              information to keep it accurate, current, and complete.
            </p>
            <p>
              You are responsible for safeguarding your password and for any
              activities or actions under your account. You agree not to
              disclose your password to any third party. You must notify us
              immediately upon becoming aware of any breach of security or
              unauthorized use of your account.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              4. User Responsibilities
            </h2>

            <h3 className="text-xl font-medium mt-6 mb-3">For All Users</h3>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>
                Use our services in compliance with applicable laws and
                regulations
              </li>
              <li>Respect the intellectual property rights of others</li>
              <li>
                Not engage in any activity that could harm, disable, or impair
                the functioning of our services
              </li>
              <li>
                Not attempt to gain unauthorized access to any part of our
                services
              </li>
              <li>
                Not use our services to distribute unsolicited commercial
                messages or spam
              </li>
              <li>
                Not use our services for any illegal or unauthorized purpose
              </li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">For Tutors</h3>
            <p>In addition to the above, tutors agree to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>
                Provide accurate information about qualifications, experience,
                and expertise
              </li>
              <li>Deliver tutoring services as described and scheduled</li>
              <li>
                Maintain professional conduct in all interactions with students
              </li>
              <li>Not misrepresent credentials or capabilities</li>
              <li>Respect the confidentiality and privacy of students</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">For Students</h3>
            <p>Students agree to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>
                Provide accurate information when booking tutoring services
              </li>
              <li>
                Attend scheduled sessions or provide timely notice of
                cancellation
              </li>
              <li>Treat tutors with respect</li>
              <li>
                Not share tutoring materials provided by tutors without
                permission
              </li>
              <li>Pay for services received as agreed</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">5. Payment Terms</h2>
            <p>
              TutorConnect facilitates payments between students and tutors. By
              using our payment services, you agree to the following:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>All fees are quoted in USD unless otherwise specified</li>
              <li>
                Students will be charged at the time of booking or according to
                the payment schedule agreed upon
              </li>
              <li>
                Tutors will receive payment after the tutoring session is
                completed, minus the platform service fee
              </li>
              <li>
                Our platform fee is a percentage of the total transaction and is
                subject to change with notice
              </li>
              <li>Refunds may be issued according to our refund policy</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              6. Cancellation and Refund Policy
            </h2>
            <p>Our cancellation and refund policy is as follows:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>
                Students may cancel a session without penalty at least 24 hours
                before the scheduled time
              </li>
              <li>
                Late cancellations (less than 24 hours' notice) may result in a
                partial or full charge
              </li>
              <li>No-shows may result in full payment being due</li>
              <li>
                If a tutor cancels a session, the student will receive a full
                refund or credit
              </li>
              <li>
                Disputes will be handled on a case-by-case basis by our support
                team
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              7. Intellectual Property
            </h2>
            <p>
              TutorConnect and its content, features, and functionality are
              owned by us and are protected by international copyright,
              trademark, patent, trade secret, and other intellectual property
              laws.
            </p>
            <p>
              Materials provided by tutors (including lesson plans, worksheets,
              presentations, etc.) remain the intellectual property of the tutor
              unless otherwise agreed between the tutor and student.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              8. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, TutorConnect and its
              affiliates shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss of
              profits or revenues, whether incurred directly or indirectly, or
              any loss of data, use, goodwill, or other intangible losses,
              resulting from:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Your use or inability to use our services</li>
              <li>
                Any unauthorized access to or use of our servers and/or any
                personal information stored therein
              </li>
              <li>
                Any interruption or cessation of transmission to or from our
                services
              </li>
              <li>
                The quality of tutoring services provided by tutors on our
                platform
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              9. Dispute Resolution
            </h2>
            <p>
              Any disputes arising from or relating to these Terms of Service
              shall first be addressed through informal negotiation. If the
              dispute cannot be resolved through negotiation, the parties agree
              to submit to binding arbitration in accordance with the rules of
              the American Arbitration Association.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              10. Modifications to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms of Service at any time.
              We will provide notice of any material changes by posting the
              updated terms on our website and updating the "Last updated" date.
              Your continued use of our services constitutes acceptance of the
              modified terms.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in
              accordance with the laws of the State of California, without
              regard to its conflict of law provisions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              12. Contact Information
            </h2>
            <p>
              Questions or comments about these Terms of Service may be directed
              to:
            </p>
            <div className="mt-4">
              <p>
                <strong>TutorConnect</strong>
              </p>
              <p>123 Education Ave</p>
              <p>San Francisco, CA 94105</p>
              <p>Email: terms@tutorconnect.com</p>
              <p>Phone: +1 (123) 456-7890</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
