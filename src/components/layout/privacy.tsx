import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { fadeIn } from "@/components/layout/animation";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <motion.div
        variants={fadeIn("up", 0.1)}
        initial="hidden"
        animate="show"
        className="max-w-8xl mx-auto"
      >
        <header className="mb-10">
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 mr-3 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: April 21, 2024
          </p>
        </header>

        <Card className="mb-8 bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="mb-4">
              TutorConnect ("we," "our," or "us") is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our
              website and use our services.
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree
              with the terms of this Privacy Policy, please do not access the
              site or use our services.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              Information We Collect
            </h2>

            <h3 className="text-xl font-medium mt-6 mb-3">
              Personal Information
            </h3>
            <p>
              We may collect personal information that you voluntarily provide
              to us when you:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Register for an account</li>
              <li>
                Express interest in obtaining information about us or our
                services
              </li>
              <li>Participate in activities on our platform</li>
              <li>Contact us</li>
            </ul>
            <p>Personal information may include:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Mailing address</li>
              <li>Profile photo</li>
              <li>Educational background</li>
              <li>Payment information</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">
              Information Automatically Collected
            </h3>
            <p>
              When you access our platform, we automatically collect certain
              information about your device and usage of our services,
              including:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Device type</li>
              <li>Browser type</li>
              <li>Operating system</li>
              <li>IP address</li>
              <li>Access times</li>
              <li>Pages viewed</li>
              <li>Links clicked</li>
              <li>Interactions with our platform</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              How We Use Your Information
            </h2>
            <p>
              We may use the information we collect for various purposes,
              including:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Facilitating account creation and authentication</li>
              <li>Providing and maintaining our services</li>
              <li>Connecting tutors with students</li>
              <li>Processing payments and transactions</li>
              <li>Responding to your inquiries and support requests</li>
              <li>Sending you service updates and administrative messages</li>
              <li>
                Sending marketing and promotional communications (with your
                consent)
              </li>
              <li>Improving our platform and user experience</li>
              <li>Protecting our services and preventing fraud</li>
              <li>Complying with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              Sharing Your Information
            </h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>
                <strong>Other Users:</strong> When you're a tutor, certain
                profile information will be visible to students, and vice versa,
                to facilitate connections.
              </li>
              <li>
                <strong>Service Providers:</strong> Third parties that help us
                operate our platform and provide our services (e.g., payment
                processors, cloud storage providers).
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to
                protect our rights or the safety of our users.
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a
                merger, acquisition, or sale of assets.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              Cookies and Tracking Technologies
            </h2>
            <p>
              We use cookies and similar tracking technologies to enhance your
              experience on our platform, analyze usage patterns, and remember
              your preferences. You can set your browser to refuse all or some
              cookies, but some parts of our platform may not function properly.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect the security of your personal information. However, no
              method of transmission over the Internet or electronic storage is
              completely secure, and we cannot guarantee absolute security.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              Your Rights and Choices
            </h2>
            <p>
              Depending on your location, you may have certain rights regarding
              your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your data</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information
              provided in the "Contact Us" section below.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p>
              Our platform is not intended for children under 16 years of age.
              We do not knowingly collect personal information from children
              under 16. If you are a parent or guardian and believe your child
              has provided us with personal information, please contact us, and
              we will delete such information.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              Updates to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or for other operational, legal, or
              regulatory reasons. We will notify you of any material changes by
              posting the updated policy on this page and updating the "Last
              updated" date.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have questions, concerns, or requests regarding this
              Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4">
              <p>
                <strong>TutorConnect</strong>
              </p>
              <p>123 Education Ave</p>
              <p>San Francisco, CA 94105</p>
              <p>Email: privacy@tutorconnect.com</p>
              <p>Phone: +1 (123) 456-7890</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
