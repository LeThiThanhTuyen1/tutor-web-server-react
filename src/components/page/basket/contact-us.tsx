import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import { fadeIn } from "@/components/ui/animation";
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
  //       title: "Lỗi",
  //       description: "Vui lòng điền đầy đủ tất cả các trường",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   // Simulate form submission
  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  //   toast({
  //     title: "Thành công",
  //     description: "Tin nhắn của bạn đã được gửi. Chúng tôi sẽ liên hệ lại sớm.",
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
        <h1 className="text-3xl font-bold mb-6">Liên hệ với chúng tôi</h1>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white dark:bg-gray-800 rounded-md">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Điện thoại</h3>
              <p className="text-gray-600 dark:text-gray-300">
                +84 123 456 789
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Thứ Hai - Thứ Sáu, 9h-17h
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
              <h3 className="text-lg font-semibold mb-2">Địa điểm</h3>
              <p className="text-gray-600 dark:text-gray-300">
                123 Đường Giáo dục
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Hà Nội, Việt Nam
              </p>
            </CardContent>
          </Card>
        </div>

        {/* <Card className="bg-white dark:bg-gray-800 rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
              Gửi tin nhắn cho chúng tôi
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
                    Họ và tên
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Địa chỉ email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700"
                    placeholder="nguyenvana@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-2"
                >
                  Chủ đề
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700"
                  placeholder="Chúng tôi có thể giúp gì cho bạn?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Tin nhắn
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700"
                  placeholder="Nhập tin nhắn của bạn tại đây..."
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
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Gửi tin nhắn
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card> */}

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">
            Câu hỏi thường gặp
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
    question: "Làm thế nào để đăng ký làm gia sư?",
    answer:
      "Để đăng ký làm gia sư, bạn cần tạo tài khoản, chọn tùy chọn 'Gia sư' trong quá trình đăng ký, và hoàn thiện hồ sơ với thông tin về trình độ, kinh nghiệm và các môn học bạn có thể giảng dạy.",
  },
  {
    question: "Thanh toán hoạt động như thế nào?",
    answer:
      "Thanh toán được xử lý an toàn qua nền tảng của chúng tôi. Học viên thanh toán cho các buổi học qua TutorConnect, và gia sư nhận thanh toán sau khi buổi học hoàn tất, trừ đi một khoản phí nền tảng nhỏ.",
  },
  {
    question: "Tôi có thể hủy một buổi học đã đặt không?",
    answer:
      "Có, cả gia sư và học viên đều có thể hủy buổi học với thông báo trước ít nhất 24 giờ mà không bị phạt. Hủy buổi học với thông báo ngắn hơn có thể dẫn đến việc tính phí một phần tùy thuộc vào thỏa thuận của bạn.",
  },
  {
    question: "Gia sư được kiểm tra như thế nào?",
    answer:
      "Tất cả gia sư đều trải qua quy trình xác minh bao gồm kiểm tra chứng chỉ, kinh nghiệm và kiến thức môn học. Chúng tôi cũng sử dụng hệ thống đánh giá để đảm bảo duy trì tiêu chuẩn chất lượng.",
  },
];