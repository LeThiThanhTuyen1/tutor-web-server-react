"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Mail,
  MapPin,
  Phone,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>

      {/* Wave SVG */}
      <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-16 transform rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#ffffff"
            fillOpacity="0.05"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-white/10 p-1.5 rounded mr-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L15 8L21 9L17 14L18 20L12 17.5L6 20L7 14L3 9L9 8L12 2Z"
                    fill="white"
                  />
                </svg>
              </span>
              TutorConnect
            </h3>
            <p className="text-indigo-100 mb-4">
              Connecting students with expert tutors for personalized learning
              experiences that help achieve academic goals.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white hover:text-indigo-200 transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="#"
                className="text-white hover:text-indigo-200 transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="text-white hover:text-indigo-200 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-indigo-100 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-indigo-100 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/tutors"
                  className="text-indigo-100 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Find Tutors</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="text-indigo-100 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Browse Courses</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              {/* <li>
                <Link
                  to="/help"
                  className="text-indigo-100 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Help Center</span>
                </Link>
              </li> */}
              <li>
                <Link
                  to="/faq"
                  className="text-indigo-100 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>FAQ</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-indigo-100 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-indigo-100 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-indigo-100 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Terms of Service</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-indigo-300 flex-shrink-0 mt-0.5" />
                <span className="text-indigo-100">
                  123 Education Street, Learning City, 10001
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-indigo-300 flex-shrink-0" />
                <span className="text-indigo-100">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-indigo-300 flex-shrink-0" />
                <span className="text-indigo-100">info@tutorconnect.com</span>
              </li>
            </ul>
            {/* <div className="mt-6">
              <Link
                to="/contact"
                className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Get in Touch
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </div> */}
          </motion.div>
        </div>

        {/* Newsletter */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold">Subscribe to Our Newsletter</h3>
              <p className="text-indigo-100 mt-2">
                Stay updated with the latest educational resources and tips.
              </p>
            </div>
            <div className="md:col-span-2">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-indigo-200"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </motion.div> */}

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-indigo-200 text-sm mb-4 md:mb-0"
          >
            © {currentYear} TutorConnect. All rights reserved. Made with{" "}
            <Heart className="inline-block h-3 w-3 text-red-400" /> by Our Team
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex space-x-6"
          >
            <Link
              to="/privacy"
              className="text-sm text-indigo-200 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-indigo-200 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="text-sm text-indigo-200 hover:text-white transition-colors"
            >
              Cookie Policy
            </Link>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
