import { motion } from "framer-motion";
import { BookOpen, Users, Shield } from "lucide-react";
import { fadeIn } from "@/components/ui/animation";

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 container mx-auto py-10 px-4">
      <motion.div
        variants={fadeIn("up", 0.1)}
        initial="hidden"
        animate="show"
        className="max-w-8xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6">Giới thiệu về TutorConnect</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-6">
            TutorConnect là một nền tảng giáo dục hiện đại được thiết kế để kết
            nối giữa các gia sư tài năng và học viên nhiệt huyết. Chúng tôi cam
            kết mang đến giáo dục chất lượng cao, cá nhân hóa và hiệu quả.
          </p>

          <h2 className="text-2xl font-semibold mb-4 mt-10">Sứ mệnh của chúng tôi</h2>
          <p>
            Sứ mệnh của chúng tôi là trao quyền cho cả học viên và gia sư bằng
            cách tạo ra một nền tảng liền mạch, minh bạch, giúp thúc đẩy các kết
            nối giáo dục ý nghĩa. Chúng tôi tin rằng giáo dục nên được cá nhân
            hóa, dễ tiếp cận và phù hợp với nhu cầu riêng của từng cá nhân.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full mr-4">
                  <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold">Dành cho học viên</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Tiếp cận với các gia sư chất lượng ở nhiều môn học, lịch học linh
                hoạt, trải nghiệm học tập cá nhân hóa và một nền tảng an toàn để
                quản lý các mối quan hệ giáo dục.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold">Dành cho gia sư</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Một nền tảng để thể hiện chuyên môn, kết nối với học viên có động
                lực, quản lý lịch trình và thanh toán hiệu quả, đồng thời xây
                dựng hồ sơ giảng dạy chuyên nghiệp.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Giá trị của chúng tôi</h2>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full mr-3 mt-1">
                <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <strong>Giáo dục chất lượng:</strong> Chúng tôi duy trì các tiêu
                chuẩn cao cho gia sư và nội dung giáo dục.
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full mr-3 mt-1">
                <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <strong>Khả năng tiếp cận:</strong> Giáo dục nên dành cho tất cả
                mọi người, bất kể địa điểm hay hoàn cảnh.
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full mr-3 mt-1">
                <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <strong>Đổi mới:</strong> Chúng tôi không ngừng cải tiến nền tảng
                để nâng cao trải nghiệm học tập.
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full mr-3 mt-1">
                <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <strong>Cộng đồng:</strong> Chúng tôi xây dựng một cộng đồng hỗ
                trợ cho cả học viên và gia sư.
              </div>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">Đội ngũ của chúng tôi</h2>
          <p>
            TutorConnect được thành lập bởi một đội ngũ đam mê giáo dục và các
            chuyên gia công nghệ, những người nhận ra nhu cầu về một giải pháp
            hiện đại để kết nối gia sư và học viên. Đội ngũ đa dạng của chúng tôi
            kết hợp kinh nghiệm từ giáo dục, công nghệ và dịch vụ khách hàng để
            tạo ra một nền tảng thực sự đáp ứng nhu cầu của người dùng.
          </p>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg my-12">
            <h3 className="text-xl font-semibold mb-4">Tham gia cộng đồng của chúng tôi</h3>
            <p className="mb-4">
              Dù bạn là học viên đang tìm kiếm sự hỗ trợ giáo dục hay gia sư muốn
              chia sẻ kiến thức, TutorConnect cung cấp các công cụ và cộng đồng
              bạn cần để thành công.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/auth/sign-up"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Đăng ký ngay
              </a>
              <a
                href="/courses"
                className="inline-flex items-center px-4 py-2 border border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                Xem các khóa học
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}