import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, ChevronDown, ChevronUp, Search } from "lucide-react";
import { fadeIn } from "@/components/ui/animation";
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
  const [activeCategory, setActiveCategory] = useState<string>("tất cả");
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
      activeCategory === "tất cả" || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    "tất cả",
    ...Array.from(new Set(faqItems.map((item) => item.category))),
  ];

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
            <HelpCircle className="h-8 w-8 mr-3 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-3xl font-bold">Câu hỏi thường gặp</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Tìm câu trả lời cho các câu hỏi phổ biến về TutorConnect, dịch vụ
            của chúng tôi và cách nền tảng hoạt động.
          </p>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm câu hỏi hoặc từ khóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-gray-800 rounded-md pl-10 py-3 w-full"
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
                      Danh mục:{" "}
                      <span className="capitalize">{item.category}</span>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Chúng tôi không tìm thấy câu hỏi thường gặp nào phù hợp với tìm
                kiếm của bạn. Hãy thử các từ khóa khác hoặc duyệt theo danh mục.
              </p>
            </div>
          )}
        </div>

        {/* Still Have Questions */}
        <div className="mt-16 bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Vẫn còn thắc mắc?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Nếu bạn không tìm thấy câu trả lời cần thiết, đội ngũ hỗ trợ của
            chúng tôi sẵn sàng giúp đỡ. Liên hệ với chúng tôi và chúng tôi sẽ
            phản hồi sớm nhất có thể.
          </p>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
            onClick={() => (window.location.href = "/contact")}
          >
            Liên hệ hỗ trợ
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

const faqItems: FAQItem[] = [
  {
    question: "Làm thế nào để đăng ký TutorConnect?",
    answer:
      "Để đăng ký TutorConnect, nhấp vào nút 'Đăng ký' ở góc trên bên phải của trang chủ. Bạn sẽ được yêu cầu cung cấp một số thông tin cơ bản và chọn đăng ký với tư cách là học viên hoặc gia sư. Làm theo các bước để hoàn thiện hồ sơ, và bạn sẽ sẵn sàng sử dụng nền tảng của chúng tôi.",
    category: "tài khoản",
  },
  {
    question: "Yêu cầu để trở thành gia sư là gì?",
    answer:
      "Để trở thành gia sư trên TutorConnect, bạn cần có chuyên môn trong các môn học bạn muốn giảng dạy, cung cấp xác minh về trình độ của mình (như bằng cấp, chứng chỉ hoặc kinh nghiệm liên quan), vượt qua kiểm tra lý lịch của chúng tôi và hoàn thành quy trình giới thiệu gia sư. Chúng tôi cũng yêu cầu gia sư duy trì tiêu chuẩn cao về tính chuyên nghiệp và chất lượng giảng dạy.",
    category: "gia sư",
  },
  {
    question: "Sử dụng TutorConnect tốn bao nhiêu chi phí?",
    answer:
      "Đối với học viên, việc tạo tài khoản trên TutorConnect là miễn phí. Bạn chỉ trả tiền cho các buổi học mà bạn đặt. Học phí của gia sư khác nhau tùy thuộc vào kinh nghiệm, trình độ và môn học. Đối với gia sư, chúng tôi tính một khoản phí dịch vụ nhỏ cho mỗi buổi học hoàn thành, giúp chúng tôi duy trì và cải thiện nền tảng.",
    category: "thanh toán",
  },
  {
    question: "Thanh toán hoạt động như thế nào?",
    answer:
      "TutorConnect xử lý tất cả thanh toán một cách an toàn qua nền tảng của chúng tôi. Học viên thanh toán cho các buổi học tại thời điểm đặt lịch hoặc theo lịch thanh toán đã thỏa thuận. Gia sư nhận thanh toán sau khi buổi học hoàn tất, trừ đi phí dịch vụ của chúng tôi. Chúng tôi hỗ trợ nhiều phương thức thanh toán bao gồm thẻ tín dụng/thẻ ghi nợ và PayPal.",
    category: "thanh toán",
  },
  {
    question: "Tôi có thể hủy một buổi học đã đặt không?",
    answer:
      "Có, cả học viên và gia sư đều có thể hủy buổi học. Để được hoàn tiền đầy đủ, việc hủy phải được thực hiện ít nhất 24 giờ trước buổi học đã lên lịch. Hủy với thông báo ngắn hơn có thể dẫn đến tính phí một phần, tùy thuộc vào chính sách hủy của gia sư. Các tình huống khẩn cấp được xử lý theo từng trường hợp bởi đội ngũ hỗ trợ của chúng tôi.",
    category: "buổi học",
  },
  {
    question: "Gia sư được kiểm tra như thế nào?",
    answer:
      "Chúng tôi rất chú trọng đến chất lượng gia sư. Tất cả gia sư đều trải qua quy trình xác minh toàn diện bao gồm kiểm tra chứng chỉ, kinh nghiệm và kiến thức môn học. Chúng tôi cũng tiến hành kiểm tra lý lịch và yêu cầu gia sư thể hiện khả năng giảng dạy của mình. Ngoài ra, hệ thống đánh giá và nhận xét của chúng tôi giúp duy trì tiêu chuẩn chất lượng.",
    category: "gia sư",
  },
  {
    question: "Có những môn học nào để học kèm?",
    answer:
      "TutorConnect cung cấp dịch vụ học kèm cho nhiều môn học bao gồm toán học, khoa học, ngôn ngữ, nhân văn, luyện thi, âm nhạc, nghệ thuật và hơn thế nữa. Bạn có thể duyệt các môn học có sẵn thông qua tính năng tìm kiếm hoặc lọc gia sư theo chuyên môn môn học.",
    category: "buổi học",
  },
  {
    question: "Tôi có thể chọn giữa học kèm trực tuyến và trực tiếp không?",
    answer:
      "Có, TutorConnect cung cấp cả tùy chọn học kèm trực tuyến và trực tiếp. Khi tìm kiếm gia sư, bạn có thể lọc theo sở thích hình thức giảng dạy. Các buổi học trực tuyến được thực hiện qua nền tảng video tích hợp của chúng tôi, trong khi các buổi học trực tiếp được sắp xếp giữa gia sư và học viên tại một địa điểm thuận tiện chung.",
    category: "buổi học",
  },
  {
    question: "Làm thế nào để đánh giá gia sư của tôi?",
    answer:
      "Sau khi hoàn thành một buổi học, bạn sẽ nhận được lời nhắc để đánh giá gia sư của mình. Bạn có thể đánh giá trải nghiệm trên thang điểm từ 1-5 sao và cung cấp nhận xét bằng văn bản. Đánh giá giúp duy trì chất lượng trên nền tảng của chúng tôi và hỗ trợ các học viên khác tìm được gia sư phù hợp với nhu cầu của họ.",
    category: "buổi học",
  },
  {
    question: "Nếu tôi không hài lòng với buổi học kèm thì sao?",
    answer:
      "Nếu bạn không hài lòng với buổi học kèm, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi trong vòng 24 giờ sau khi buổi học hoàn tất. Chúng tôi xem xét các mối quan ngại về chất lượng một cách nghiêm túc và sẽ làm việc với bạn để giải quyết vấn đề, có thể bao gồm hoàn tiền một phần hoặc toàn bộ tùy thuộc vào hoàn cảnh.",
    category: "buổi học",
  },
  {
    question: "Làm thế nào để đặt lại mật khẩu?",
    answer:
      "Để đặt lại mật khẩu, nhấp vào nút 'Đăng nhập', sau đó chọn 'Quên mật khẩu'. Nhập địa chỉ email liên kết với tài khoản của bạn, và chúng tôi sẽ gửi hướng dẫn để tạo mật khẩu mới. Nếu bạn không nhận được email, hãy kiểm tra thư mục spam hoặc liên hệ với đội ngũ hỗ trợ của chúng tôi để được hỗ trợ.",
    category: "tài khoản",
  },
  {
    question: "Tôi có thể đổi gia sư sau khi bắt đầu một khóa học không?",
    answer:
      "Có, bạn có thể đổi gia sư nếu cảm thấy họ không phù hợp với nhu cầu học tập của bạn. Liên hệ với đội ngũ hỗ trợ của chúng tôi, và chúng tôi sẽ giúp bạn tìm một gia sư mới và chuyển bất kỳ buổi học trả trước nào còn lại. Lưu ý rằng một số gia sư có thể có chính sách cụ thể liên quan đến việc chuyển khóa học.",
    category: "buổi học",
  },
  {
    question: "Làm thế nào để theo dõi tiến độ của tôi với tư cách là học viên?",
    answer:
      "TutorConnect cung cấp một bảng điều khiển nơi học viên có thể theo dõi tiến độ của mình. Điều này bao gồm lịch sử buổi học, các buổi học sắp tới, tài liệu khóa học và phản hồi từ gia sư. Một số gia sư cũng cung cấp báo cáo tiến độ và đánh giá để giúp bạn theo dõi sự cải thiện của mình theo thời gian.",
    category: "học viên",
  },
  {
    question: "Với tư cách là gia sư, tôi được thanh toán như thế nào?",
    answer:
      "Gia sư nhận thanh toán thông qua hệ thống thanh toán an toàn của chúng tôi. Sau khi hoàn thành một buổi học, thanh toán được xử lý và chuyển vào tài khoản ngân hàng hoặc phương thức thanh toán được liên kết của bạn, trừ đi phí dịch vụ của chúng tôi. Thanh toán thường được xử lý trong vòng 3-5 ngày làm việc sau khi buổi học được đánh dấu là hoàn thành.",
    category: "thanh toán",
  },
  {
    question: "Tôi có thể lên lịch các buổi học định kỳ không?",
    answer:
      "Có, cả gia sư và học viên đều có thể thiết lập các buổi học định kỳ. Khi đặt một buổi học, chọn tùy chọn 'Tạo định kỳ' và chọn tần suất mong muốn (hàng tuần, hai tuần một lần, v.v.). Bạn có thể quản lý hoặc hủy các buổi học định kỳ thông qua bảng điều khiển của mình bất kỳ lúc nào.",
    category: "buổi học",
  },
  {
    question: "Tôi cần công nghệ gì cho học kèm trực tuyến?",
    answer:
      "Đối với học kèm trực tuyến, bạn sẽ cần một máy tính hoặc máy tính bảng với kết nối internet ổn định, webcam và micro. Chúng tôi khuyên bạn nên sử dụng phiên bản mới nhất của các trình duyệt Chrome, Firefox hoặc Safari. Một số buổi học có thể yêu cầu phần mềm hoặc công cụ bổ sung tùy thuộc vào môn học (ví dụ: môi trường lập trình, bảng trắng kỹ thuật số), mà gia sư của bạn sẽ thông báo trước.",
    category: "kỹ thuật",
  },
  {
    question: "Làm thế nào để báo cáo hành vi không phù hợp?",
    answer:
      "Chúng tôi rất chú trọng đến sự an toàn và thoải mái của người dùng. Nếu bạn gặp hành vi không phù hợp, vui lòng báo cáo ngay lập tức thông qua nút 'Báo cáo' trên hồ sơ hoặc chi tiết buổi học của người dùng, hoặc liên hệ trực tiếp với đội ngũ hỗ trợ của chúng tôi. Tất cả báo cáo được xử lý bí mật và điều tra nhanh chóng.",
    category: "an toàn",
  },
  {
    question: "Tôi có thể được hoàn tiền nếu cần hủy đăng ký không?",
    answer:
      "Chính sách hoàn tiền cho đăng ký phụ thuộc vào các điều khoản cụ thể của gói đăng ký của bạn. Nói chung, chúng tôi cung cấp hoàn tiền theo tỷ lệ cho các phần chưa sử dụng của thời hạn đăng ký. Vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi với tình huống cụ thể của bạn, và chúng tôi sẽ làm việc với bạn để tìm giải pháp công bằng.",
    category: "thanh toán",
  },
  {
    question: "Làm thế nào để trở thành gia sư nổi bật trên nền tảng?",
    answer:
      "Gia sư nổi bật được chọn dựa trên một số yếu tố bao gồm đánh giá cao liên tục, tỷ lệ hoàn thành buổi học, phản hồi của học viên và chuyên môn môn học. Để tăng cơ hội, hãy duy trì chất lượng dịch vụ xuất sắc, hoàn thiện đầy đủ hồ sơ, nhận được đánh giá tích cực và tham gia tích cực vào cộng đồng TutorConnect.",
    category: "gia sư",
  },
  {
    question: "Thông tin cá nhân của tôi có an toàn không?",
    answer:
      "Có, bảo vệ thông tin cá nhân của bạn là ưu tiên hàng đầu của chúng tôi. Chúng tôi sử dụng mã hóa tiêu chuẩn ngành và các biện pháp bảo mật để bảo vệ dữ liệu của bạn. Chúng tôi không bao giờ chia sẻ thông tin cá nhân của bạn với bên thứ ba mà không có sự đồng ý của bạn, trừ khi luật pháp yêu cầu. Để biết thêm chi tiết, vui lòng xem lại Chính sách quyền riêng tư của chúng tôi.",
    category: "an toàn",
  },
];