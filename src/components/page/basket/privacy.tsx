import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { fadeIn } from "@/components/ui/animation";
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
            <h1 className="text-3xl font-bold">Chính sách bảo mật</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Cập nhật lần cuối: 21 tháng 4 năm 2024
          </p>
        </header>

        <Card className="mb-8 bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Giới thiệu</h2>
            <p className="mb-4">
              TutorConnect ("chúng tôi") cam kết bảo vệ quyền riêng tư của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, tiết lộ và bảo vệ thông tin của bạn khi bạn truy cập trang web và sử dụng dịch vụ của chúng tôi.
            </p>
            <p>
              Vui lòng đọc kỹ Chính sách bảo mật này. Nếu bạn không đồng ý với các điều khoản của Chính sách bảo mật này, vui lòng không truy cập trang web hoặc sử dụng dịch vụ của chúng tôi.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              Thông tin chúng tôi thu thập
            </h2>

            <h3 className="text-xl font-medium mt-6 mb-3">
              Thông tin cá nhân
            </h3>
            <p>
              Chúng tôi có thể thu thập thông tin cá nhân mà bạn tự nguyện cung cấp khi bạn:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Đăng ký tài khoản</li>
              <li>
                Thể hiện sự quan tâm đến việc nhận thông tin về chúng tôi hoặc dịch vụ của chúng tôi
              </li>
              <li>Tham gia các hoạt động trên nền tảng của chúng tôi</li>
              <li>Liên hệ với chúng tôi</li>
            </ul>
            <p>Thông tin cá nhân có thể bao gồm:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Tên</li>
              <li>Địa chỉ email</li>
              <li>Số điện thoại</li>
              <li>Địa chỉ thư tín</li>
              <li>Ảnh hồ sơ</li>
              <li>Trình độ học vấn</li>
              <li>Thông tin thanh toán</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">
              Thông tin tự động thu thập
            </h3>
            <p>
              Khi bạn truy cập nền tảng của chúng tôi, chúng tôi tự động thu thập một số thông tin về thiết bị và cách bạn sử dụng dịch vụ của chúng tôi, bao gồm:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Loại thiết bị</li>
              <li>Loại trình duyệt</li>
              <li>Hệ điều hành</li>
              <li>Địa chỉ IP</li>
              <li>Thời gian truy cập</li>
              <li>Trang đã xem</li>
              <li>Liên kết đã nhấp</li>
              <li>Tương tác với nền tảng của chúng tôi</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              Cách chúng tôi sử dụng thông tin của bạn
            </h2>
            <p>
              Chúng tôi có thể sử dụng thông tin thu thập được cho nhiều mục đích khác nhau, bao gồm:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Tạo và xác thực tài khoản</li>
              <li>Cung cấp và duy trì dịch vụ của chúng tôi</li>
              <li>Kết nối gia sư với học viên</li>
              <li>Xử lý thanh toán và giao dịch</li>
              <li>Trả lời các câu hỏi và yêu cầu hỗ trợ của bạn</li>
              <li>Gửi cập nhật dịch vụ và thông báo quản trị</li>
              <li>
                Gửi thông tin tiếp thị và quảng cáo (với sự đồng ý của bạn)
              </li>
              <li>Cải thiện nền tảng và trải nghiệm người dùng</li>
              <li>Bảo vệ dịch vụ của chúng tôi và ngăn chặn gian lận</li>
              <li>Tuân thủ các nghĩa vụ pháp lý</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              Chia sẻ thông tin của bạn
            </h2>
            <p>Chúng tôi có thể chia sẻ thông tin của bạn với:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>
                <strong>Người dùng khác:</strong> Nếu bạn là gia sư, một số thông tin hồ sơ sẽ hiển thị với học viên, và ngược lại, để hỗ trợ kết nối.
              </li>
              <li>
                <strong>Nhà cung cấp dịch vụ:</strong> Các bên thứ ba giúp chúng tôi vận hành nền tảng và cung cấp dịch vụ (ví dụ: bộ xử lý thanh toán, nhà cung cấp lưu trữ đám mây).
              </li>
              <li>
                <strong>Yêu cầu pháp lý:</strong> Khi luật pháp yêu cầu hoặc để bảo vệ quyền lợi của chúng tôi hoặc sự an toàn của người dùng.
              </li>
              <li>
                <strong>Chuyển giao kinh doanh:</strong> Liên quan đến việc sáp nhập, mua lại hoặc bán tài sản.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              Cookies và công nghệ theo dõi
            </h2>
            <p>
              Chúng tôi sử dụng cookies và các công nghệ theo dõi tương tự để nâng cao trải nghiệm của bạn trên nền tảng, phân tích mô hình sử dụng và ghi nhớ tùy chọn của bạn. Bạn có thể cài đặt trình duyệt để từ chối tất cả hoặc một số cookies, nhưng một số phần của nền tảng có thể không hoạt động bình thường.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              Bảo mật dữ liệu
            </h2>
            <p>
              Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ an toàn thông tin cá nhân của bạn. Tuy nhiên, không có phương thức truyền tải qua Internet hoặc lưu trữ điện tử nào hoàn toàn an toàn, và chúng tôi không thể đảm bảo an toàn tuyệt đối.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              Quyền và lựa chọn của bạn
            </h2>
            <p>
              Tùy thuộc vào vị trí của bạn, bạn có thể có một số quyền liên quan đến thông tin cá nhân của mình, bao gồm:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Truy cập thông tin cá nhân của bạn</li>
              <li>Sửa chữa dữ liệu không chính xác</li>
              <li>Xóa dữ liệu của bạn</li>
              <li>Hạn chế xử lý dữ liệu</li>
              <li>Chuyển giao dữ liệu</li>
              <li>Phản đối việc xử lý dữ liệu</li>
            </ul>
            <p>
              Để thực thi các quyền này, vui lòng liên hệ với chúng tôi bằng thông tin được cung cấp trong phần "Liên hệ với chúng tôi" bên dưới.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              Quyền riêng tư của trẻ em
            </h2>
            <p>
              Nền tảng của chúng tôi không dành cho trẻ em dưới 16 tuổi. Chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em dưới 16 tuổi. Nếu bạn là phụ huynh hoặc người giám hộ và tin rằng con bạn đã cung cấp thông tin cá nhân cho chúng tôi, vui lòng liên hệ với chúng tôi, và chúng tôi sẽ xóa thông tin đó.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              Cập nhật Chính sách bảo mật này
            </h2>
            <p>
              Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian để phản ánh các thay đổi trong thực tiễn của chúng tôi hoặc vì các lý do vận hành, pháp lý hoặc quy định khác. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi quan trọng nào bằng cách đăng chính sách cập nhật trên trang này và cập nhật ngày "Cập nhật lần cuối".
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 rounded-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              Liên hệ với chúng tôi
            </h2>
            <p>
              Nếu bạn có câu hỏi, thắc mắc hoặc yêu cầu liên quan đến Chính sách bảo mật này hoặc các phương thức xử lý dữ liệu của chúng tôi, vui lòng liên hệ với chúng tôi tại:
            </p>
            <div className="mt-4">
              <p>
                <strong>TutorConnect</strong>
              </p>
              <p>123 Đường Giáo dục</p>
              <p>Hà Nội, Việt Nam</p>
              <p>Email: baomat@tutorconnect.com</p>
              <p>Điện thoại: +84 123 456 7890</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}