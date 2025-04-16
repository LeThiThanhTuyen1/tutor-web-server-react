"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Star,
  Users,
  CheckCircle,
  Clock,
  Globe,
  Award,
  Zap,
  MessageSquare,
  Sparkles,
  GraduationCap,
  Briefcase,
  Target,
  TrendingUp,
} from "lucide-react";
import { getAllCourses } from "@/services/courseService";
import { fadeIn } from "../layout/animation";
import SectionHeading from "./section-heading";
import LazyImage from "./lazy-image";
import { getAllTutors } from "@/services/tutorService";
import { API_BASE_URL } from "@/config/axiosInstance";
import { useAuth } from "@/hook/use-auth";
import { getStatsPublic } from "@/services/studentService";

const testimonials = [
  {
    id: 1,
    name: "John Smith",
    role: "Student",
    image: "https://image.vnreview.vn/12/29/122965.jpg?height=80&width=100",
    content:
      "TutorConnect has completely transformed my learning experience. The tutors are knowledgeable and patient, and the platform is easy to use.",
    rating: 5,
  },
  {
    id: 2,
    name: "Lisa Johnson",
    role: "Parent",
    image:
      "https://icdn.dantri.com.vn/2018/3/9/chan-dung-phu-nu-16-15205309909711055682562.jpg?height=80&width=80",
    content:
      "My daughter's grades have improved significantly since we started using TutorConnect. The tutors are professional and the scheduling is flexible.",
    rating: 5,
  },
  {
    id: 3,
    name: "David Chen",
    role: "Student",
    image:
      "https://kenh14cdn.com/2020/9/10/photo-1-1599748275176324120564.jpeg?height=80&width=80",
    content:
      "I was struggling with advanced physics until I found TutorConnect. The personalized attention has made all the difference.",
    rating: 4,
  },
];

const categories = [
  {
    id: 1,
    name: "Mathematics",
    icon: <Award className="h-6 w-6" />,
    count: 120,
  },
  { id: 2, name: "Science", icon: <Zap className="h-6 w-6" />, count: 85 },
  {
    id: 3,
    name: "Languages",
    icon: <MessageSquare className="h-6 w-6" />,
    count: 64,
  },
  {
    id: 4,
    name: "Physicals",
    icon: <Globe className="h-6 w-6" />,
    count: 92,
  },
  { id: 5, name: "Arts", icon: <Sparkles className="h-6 w-6" />, count: 45 },
  { id: 6, name: "Music", icon: <BookOpen className="h-6 w-6" />, count: 38 },
];

// const stats = [
//   { id: 1, value: "10,000+", label: "Students" },
//   { id: 2, value: "500+", label: "Expert Tutors" },
//   { id: 3, value: "1,200+", label: "Courses" },
//   { id: 4, value: "98%", label: "Satisfaction Rate" },
// ];

// New section: Benefits of tutoring
const tutorBenefits = [
  {
    icon: <Target className="h-10 w-10 text-white" />,
    title: "Personalized Learning",
    description:
      "Customized instruction tailored to your specific learning style and pace.",
  },
  {
    icon: <TrendingUp className="h-10 w-10 text-white" />,
    title: "Improved Grades",
    description:
      "Our students typically see a 20-30% improvement in their academic performance.",
  },
  {
    icon: <Briefcase className="h-10 w-10 text-white" />,
    title: "Career Advancement",
    description:
      "Gain skills that will help you stand out in college applications and job markets.",
  },
  {
    icon: <GraduationCap className="h-10 w-10 text-white" />,
    title: "Confidence Building",
    description:
      "Develop self-assurance and independence in your academic abilities.",
  },
];

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialsRef = useRef<HTMLDivElement | null>(null);
  const [stats, setStats] = useState<any>([]);

  const staggerContainer = (
    staggerChildren: number,
    delayChildren: number
  ) => ({
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  });

  const scaleIn = (delay: number) => ({
    hidden: { scale: 0.8, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay,
        ease: "easeOut",
      },
    },
  });

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllCourses({
        pageNumber: 1,
        pageSize: 3,
      });
      setCourses(response.data || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTutors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllTutors({
        pageNumber: 1,
        pageSize: 4,
      });
      setTutors(response.data || []);
    } catch (error) {
      console.error("Failed to fetch tutors:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchTutors();
  }, [fetchCourses, fetchTutors]);

  useEffect(() => {
    const loadStats = async () => {
      const statsData = await getStatsPublic();
      setStats(statsData);
    };
    loadStats();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const scrollToTestimonial = (index: number) => {
    setActiveTestimonial(index);
    if (testimonialsRef.current) {
      const scrollAmount = index * testimonialsRef.current.offsetWidth;
      testimonialsRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      {/* Hero Banner Section - Deep purple to indigo gradient with improved dark mode */}
      <section className="relative bg-gradient-to-b from-purple-900 via-indigo-800 to-indigo-700 dark:from-purple-950 dark:via-indigo-950 dark:to-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center opacity-10 z-0"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-500 dark:bg-purple-700 rounded-full filter blur-3xl opacity-20 z-0"></div>
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500 dark:bg-indigo-700 rounded-full filter blur-3xl opacity-20 z-0"></div>

        <motion.div
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="container mx-auto px-6 relative z-0"
        >
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              variants={fadeIn("right", 0.3)}
              className="md:w-1/2 mb-60 md:mb-0"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Learn Anything, <br />
                <span className="text-yellow-300">Anytime</span> with Experts
              </h1>
              <p className="text-xl mb-8 text-gray-200 max-w-lg">
                Connect with expert tutors for personalized learning experiences
                that help you achieve your academic goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={
                    isAuthenticated ? `${user?.role}/dashboard` : "/auth/login"
                  }
                  className="bg-white text-indigo-600 hover:bg-gray-100 dark:bg-white/90 dark:hover:bg-white px-8 py-4 rounded-full font-medium text-center transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                </Link>
                <Link
                  to="/courses"
                  className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-4 rounded-full font-medium text-center transition-all duration-300"
                >
                  Browse Courses
                </Link>
              </div>
            </motion.div>
            <motion.div variants={fadeIn("left", 0.5)} className="md:w-1/2">
              <div className="relative z-0">
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 rounded-lg blur-lg opacity-30 animate-pulse"></div>
                <LazyImage
                  src="https://truonghoc247.vn/wp-content/uploads/2022/12/yy.jpg?height=400&width=600"
                  alt="Students learning"
                  className="rounded-lg shadow-2xl relative z-0"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden z-0">
          <svg
            className="absolute bottom-0 w-full h-16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="currentColor"
              className="text-white dark:text-gray-900"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Stats Section - White with subtle gradient */}
      <section className="py-12 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            variants={staggerContainer(0.1, 0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            {stats.map((stat: any, index: number) => (
              <motion.div
                key={stat.id}
                variants={scaleIn(index * 0.1)}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {stat.value}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits of Tutoring Section - Indigo to purple gradient */}
      <section className="py-8 bg-gradient-to-b from-indigo-600 via-indigo-700 to-purple-800 dark:from-indigo-900 dark:via-indigo-900 dark:to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-indigo-50 to-transparent dark:from-gray-800 dark:to-transparent opacity-10"></div>

        <div className="container mx-auto px-6 relative">
          <SectionHeading
            title="Benefits of Tutoring"
            subtitle="Discover how personalized tutoring can transform your learning experience"
            centered
            className="text-white"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            {tutorBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeIn(index % 2 === 0 ? "right" : "left", 0.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                className="flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-indigo-100 dark:text-indigo-200">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - White to light purple gradient */}
      <section className="py-8 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Browse by Category"
            subtitle="Explore our wide range of subjects taught by expert tutors"
            centered
          />

          <motion.div
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                variants={fadeIn("up", index * 0.1)}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.1 },
                }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full"
              >
                <div className="block p-6 text-center h-full flex flex-col justify-between">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold mb-6">{category.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.count} courses
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section - Light purple to deep purple gradient */}
      <section className="py-8 bg-gradient-to-b from-purple-50 via-purple-100 to-indigo-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Why Choose TutorConnect?"
            subtitle="We provide a comprehensive platform that connects students with qualified tutors for personalized learning experiences."
            centered
          />

          <div className="space-y-24 mt-16">
            {/* Feature 1 - Left image, right text */}
            <motion.div
              variants={staggerContainer(0.1, 0.2)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="flex flex-col lg:flex-row items-center gap-12"
            >
              <motion.div variants={fadeIn("right", 0.3)} className="lg:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 rounded-lg blur-lg opacity-20"></div>
                  <LazyImage
                    src="/src/assets/images/section-text-2.png?height=400&width=600"
                    alt="Expert Tutors"
                    className="rounded-xl shadow-xl relative z-0"
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeIn("left", 0.3)} className="lg:w-1/2">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 text-white">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Expert Tutors</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  All our tutors are thoroughly vetted and have extensive
                  experience in their fields. We ensure they have the knowledge
                  and teaching skills to help you succeed.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                    <span>Verified credentials and background checks</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                    <span>Minimum of 3 years teaching experience</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                    <span>Continuous performance evaluation</span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>

            {/* Feature 2 - Right image, left text */}
            <motion.div
              variants={staggerContainer(0.1, 0.2)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="flex flex-col lg:flex-row-reverse items-center gap-12"
            >
              <motion.div variants={fadeIn("left", 0.3)} className="lg:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 rounded-lg blur-lg opacity-20"></div>
                  <LazyImage
                    src="/src/assets/images/section-text-3.jpg?height=400&width=600"
                    alt="Personalized Learning"
                    className="rounded-xl shadow-xl relative z-0"
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeIn("right", 0.3)} className="lg:w-1/2">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 text-white">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  Personalized Learning
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Customized learning plans tailored to your specific needs and
                  learning style. Our approach focuses on addressing your unique
                  challenges and building on your strengths.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                    <span>Custom curriculum development</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                    <span>Regular progress assessments</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                    <span>Adaptive teaching methods</span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>

            {/* Feature 3 - Left image, right text */}
            <motion.div
              variants={staggerContainer(0.1, 0.2)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="flex flex-col lg:flex-row items-center gap-12"
            >
              <motion.div variants={fadeIn("right", 0.3)} className="lg:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 rounded-lg blur-lg opacity-20"></div>
                  <LazyImage
                    src="/src/assets/images/section-text-4.png?height=400&width=600"
                    alt="Flexible Scheduling"
                    className="rounded-xl shadow-xl relative z-0"
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeIn("left", 0.3)} className="lg:w-1/2">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 text-white">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  Flexible Scheduling
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Book sessions at times that work for you, with 24/7
                  availability from tutors around the world. Our platform makes
                  it easy to find the perfect time slot for your busy schedule.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                    <span>24/7 availability with tutors worldwide</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                    <span>Easy rescheduling with no penalties</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                    <span>Calendar integration with reminders</span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section - White to light blue gradient */}
      <section className="py-8 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <SectionHeading
              title="Featured Courses"
              subtitle="Explore our most popular courses taught by expert tutors"
              className="mb-0"
            />
            <Link
              to="/courses"
              className="hidden md:flex items-center text-indigo-600 dark:text-indigo-400 hover:underline group"
            >
              View All Courses
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse h-[450px]"
                >
                  <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer(0.1, 0.2)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  variants={fadeIn("up", index * 0.1)}
                  whileHover={{
                    scale: 1.03,
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-[450px]"
                >
                  <div className="relative h-48">
                    <LazyImage
                      src="https://www.shutterstock.com/image-vector/flat-line-icons-set-elearning-600nw-320901137.jpg"
                      alt={course.courseName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Popular
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-1">
                      {course.courseName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-grow">
                      {course.description}
                    </p>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white flex items-center justify-center mr-3">
                          {course.tutorName?.charAt(0) || "T"}
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{course.tutorName}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Expert Tutor
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{course.maxStudents} students</span>
                      </div>
                      <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        ${course.fee}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/courses"
              className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All Courses <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Light indigo to medium indigo gradient */}
      <section className="py-8 bg-gradient-to-b from-indigo-50 via-indigo-100 to-purple-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 overflow-hidden">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="What Our Students Say"
            subtitle="Hear from students who have achieved their academic goals with TutorConnect"
            centered
          />

          <div className="relative">
            <div ref={testimonialsRef} className="overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{
                  transform: `translateX(-${activeTestimonial * 100}%)`,
                }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="min-w-full px-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white dark:bg-gray-700 p-8 md:p-12 rounded-2xl shadow-lg max-w-3xl mx-auto"
                    >
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 rounded-full blur opacity-70"></div>
                          <img
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-40 h-20 rounded-full border-4 border-white dark:border-gray-700 shadow-md relative z-0"
                          />
                        </div>
                        <div>
                          <div className="flex mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < testimonial.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-lg italic mb-6">
                            "{testimonial.content}"
                          </p>
                          <div>
                            <h4 className="font-semibold text-lg">
                              {testimonial.name}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    activeTestimonial === index
                      ? "bg-indigo-600 dark:bg-indigo-400"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tutors Section - White to light purple gradient */}
      <section className="py-8 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <SectionHeading
              title="Our Top Tutors"
              subtitle="Learn from the best experts in their fields"
              className="mb-0"
            />
            <Link
              to="/tutors"
              className="hidden md:flex items-center text-indigo-600 dark:text-indigo-400 hover:underline group"
            >
              View All Tutors
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <motion.div
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {tutors.map((tutor, index) => (
              <motion.div
                key={tutor.id}
                variants={fadeIn("up", index * 0.1)}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.2 },
                }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-[400px] flex flex-col"
              >
                <div className="pl-6 pr-6 pt-4 text-center">
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-md"></div>
                    <LazyImage
                      src={`${API_BASE_URL}/${tutor.profileImage}`}
                      alt={tutor.tutorName}
                      className="w-24 h-24 rounded-full object-cover relative z-0 border-4 border-white dark:border-gray-700"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-6">
                    {tutor.tutorName}
                  </h3>
                </div>
                <div className="pl-6 pr-6 pb-4 text-center flex-grow flex flex-col">
                  <p className="text-indigo-600 dark:text-indigo-400 mb-2 line-clamp-1">
                    {tutor.school}
                  </p>
                  <div className="flex items-center justify-center mb-4">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium">
                      {tutor.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Experience: {tutor.experience} years
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
                    {tutor.introduction || "No introduction provided"}
                  </p>
                  <Link
                    to={`/tutor/${tutor.id}`}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md mt-auto inline-block"
                  >
                    View Profile
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/tutors"
              className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All Tutors <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Deep indigo to purple gradient */}
      <section className="py-8 bg-gradient-to-b from-indigo-600 via-indigo-700 to-purple-800 dark:from-indigo-900 dark:via-indigo-900 dark:to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center opacity-10"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-500 dark:bg-purple-700 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500 dark:bg-indigo-700 rounded-full filter blur-3xl opacity-20"></div>

        <motion.div
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="container mx-auto px-6 text-center relative z-0"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already achieving their academic
            goals with TutorConnect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={isAuthenticated ? `/${user.role}/dashboard` : "/auth/sign-up"}
              className="bg-white text-indigo-600 hover:bg-gray-100 dark:bg-white/90 dark:hover:bg-white px-8 py-4 rounded-full font-medium inline-block transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {isAuthenticated ? "Go to Dashboard" : "Sign Up Now"}
            </Link>
            <Link
              to="/tutors"
              className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-4 rounded-full font-medium inline-block transition-all duration-300"
            >
              Browse Tutors
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
