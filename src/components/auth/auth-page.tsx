"use client";

import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoginForm from "./login-form";
import SignupForm from "./signup-form";
import ForgotPasswordForm from "./forgot-password";

export default function AuthPage() {
  const { formType } = useParams<{ formType?: string }>();
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-hidden bg-gradient-to-b from-indigo-600 via-purple-700 to-purple-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="absolute  bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bg-indigo-500 rounded-full filter blur-3xl opacity-20"></div>
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-center min-h-screen relative z-10">
        {/* Left side - Welcome message */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:block md:w-1/2 lg:w-2/5 text-white p-8"
        >
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-bold mb-6">Welcome to TutorConnect</h1>
            <p className="text-xl text-indigo-100 mb-8">
              Connect with expert tutors or manage your students in one place.
            </p>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur opacity-30"></div>
              <img
                src="/src/assets/images/bg-image.png"
                alt="Learning illustration"
                className="relative z-10 rounded-lg shadow-xl w-full max-w-sm mx-auto"
              />
            </div>
          </div>
        </motion.div>

        {/* Right side - Authentication Forms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`w-full md:w-1/2 lg:w-3/5 flex items-center justify-center p-4 ${
            formType === "sign-up" ? "lg:max-w-3xl" : "lg:max-w-md"
          }`}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full">
            {formType === "login" ? (
              <LoginForm
                onSwitchForm={() => navigate("/auth/sign-up")}
                onForgotPassword={() => navigate("/auth/forgot-password")}
              />
            ) : formType === "sign-up" ? (
              <SignupForm onSwitchForm={() => navigate("/auth/login")} />
            ) : (
              <ForgotPasswordForm onBack={() => navigate("/auth/login")} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
