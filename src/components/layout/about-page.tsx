"use client"

import { motion } from "framer-motion"
import { BookOpen, Users, Shield } from "lucide-react"
import { fadeIn } from "@/components/layout/animation"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <motion.div variants={fadeIn("up", 0.1)} initial="hidden" animate="show" className="max-w-8xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About TutorConnect</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-6">
            TutorConnect is a modern educational platform designed to bridge the gap between skilled tutors and eager
            students. We're dedicated to making high-quality education accessible, personalized, and effective.
          </p>

          <h2 className="text-2xl font-semibold mb-4 mt-10">Our Mission</h2>
          <p>
            Our mission is to empower both students and educators by creating a seamless, transparent platform that
            facilitates meaningful educational connections. We believe that education should be personalized,
            accessible, and tailored to individual needs.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full mr-4">
                  <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold">For Students</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Access to qualified tutors across various subjects, flexible scheduling options, personalized learning
                experiences, and a secure platform for managing educational relationships.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold">For Tutors</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                A platform to showcase expertise, connect with motivated students, manage scheduling and payments
                efficiently, and build a professional teaching portfolio.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full mr-3 mt-1">
                <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <strong>Quality Education:</strong> We maintain high standards for our tutors and educational content.
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full mr-3 mt-1">
                <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <strong>Accessibility:</strong> Education should be available to everyone, regardless of location or
                background.
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full mr-3 mt-1">
                <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <strong>Innovation:</strong> We continuously improve our platform to enhance the learning experience.
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full mr-3 mt-1">
                <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <strong>Community:</strong> We foster a supportive community of learners and educators.
              </div>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <p>
            TutorConnect was founded by a team of education enthusiasts and technology experts who recognized the need
            for a modern solution to connect tutors and students. Our diverse team brings together experience from
            education, technology, and customer service to create a platform that truly meets the needs of our users.
          </p>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg my-12">
            <h3 className="text-xl font-semibold mb-4">Join Our Community</h3>
            <p className="mb-4">
              Whether you're a student looking for educational support or a tutor wanting to share your knowledge,
              TutorConnect provides the tools and community you need to succeed.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/auth/signup"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Sign Up Today
              </a>
              <a
                href="/courses"
                className="inline-flex items-center px-4 py-2 border border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                Browse Courses
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
