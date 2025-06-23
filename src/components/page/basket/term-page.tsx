import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { fadeIn } from "@/components/ui/animation";
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
            <h1 className="text-3xl font-bold">Điều khoản sử dụng</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Cập nhật lần cuối: 21 tháng 4 năm 2024
          </p>
        </header>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              1. Thỏa thuận về điều khoản
            </h2>
            <p>
              Chào mừng bạn đến với TutorConnect. Bằng cách truy cập trang web
              và sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các Điều
              khoản sử dụng này và Chính sách bảo mật của chúng tôi. Nếu bạn
              không đồng ý với bất kỳ phần nào của các điều khoản này, bạn
              không được phép sử dụng dịch vụ của chúng tôi.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              2. Mô tả dịch vụ
            </h2>
            <p>
              TutorConnect là một nền tảng trực tuyến kết nối học viên với các
              gia sư có trình độ. Dịch vụ của chúng tôi bao gồm:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Hồ sơ gia sư và tìm kiếm gia sư</li>
              <li>Lập lịch và đặt lịch các buổi học kèm</li>
              <li>Công cụ giao tiếp cho gia sư và học viên</li>
              <li>Xử lý thanh toán cho dịch vụ học kèm</li>
              <li>Khóa học trực tuyến và tài nguyên giáo dục</li>
              <li>Hệ thống đánh giá và nhận xét</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              3. Tài khoản người dùng
            </h2>
            <p>
              Để truy cập hầu hết các tính năng của TutorConnect, bạn phải đăng
              ký tài khoản. Bạn đồng ý cung cấp thông tin chính xác, cập nhật
              và đầy đủ trong quá trình đăng ký và cập nhật thông tin đó để
              đảm bảo tính chính xác, cập nhật và đầy đủ.
            </p>
            <p>
              Bạn chịu trách nhiệm bảo vệ mật khẩu của mình và mọi hoạt động
              hoặc hành động dưới tài khoản của bạn. Bạn đồng ý không tiết lộ
              mật khẩu cho bất kỳ bên thứ ba nào. Bạn phải thông báo ngay cho
              chúng tôi khi biết về bất kỳ vi phạm bảo mật hoặc việc sử dụng
              tài khoản của bạn mà không được phép.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              4. Trách nhiệm của người dùng
            </h2>

            <h3 className="text-xl font-medium mt-6 mb-3">
              Đối với tất cả người dùng
            </h3>
            <p>Bạn đồng ý:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>
                Sử dụng dịch vụ của chúng tôi tuân thủ các luật và quy định áp
                dụng
              </li>
              <li>Tôn trọng quyền sở hữu trí tuệ của người khác</li>
              <li>
                Không tham gia vào bất kỳ hoạt động nào có thể gây hại, vô hiệu
                hóa hoặc làm suy giảm chức năng của dịch vụ của chúng tôi
              </li>
              <li>
                Không cố gắng truy cập trái phép vào bất kỳ phần nào của dịch
                vụ của chúng tôi
              </li>
              <li>
                Không sử dụng dịch vụ của chúng tôi để phân phối các thông điệp
                thương mại không được yêu cầu hoặc thư rác
              </li>
              <li>
                Không sử dụng dịch vụ của chúng tôi cho bất kỳ mục đích bất
                hợp pháp hoặc không được phép nào
              </li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">
              Đối với gia sư
            </h3>
            <p>Ngoài các điều trên, gia sư đồng ý:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>
                Cung cấp thông tin chính xác về trình độ, kinh nghiệm và chuyên
                môn
              </li>
              <li>
                Cung cấp dịch vụ học kèm như đã mô tả và theo lịch trình
              </li>
              <li>
                Duy trì thái độ chuyên nghiệp trong mọi tương tác với học viên
              </li>
              <li>Không trình bày sai về chứng chỉ hoặc khả năng</li>
              <li>Tôn trọng sự bảo mật và quyền riêng tư của học viên</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">
              Đối với học viên
            </h3>
            <p>Học viên đồng ý:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>
                Cung cấp thông tin chính xác khi đặt dịch vụ học kèm
              </li>
              <li>
                Tham gia các buổi học theo lịch hoặc thông báo hủy kịp thời
              </li>
              <li>Tôn trọng gia sư</li>
              <li>
                Không chia sẻ tài liệu học kèm do gia sư cung cấp mà không có
                sự cho phép
              </li>
              <li>Thanh toán cho các dịch vụ nhận được theo thỏa thuận</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              5. Điều khoản thanh toán
            </h2>
            <p>
              TutorConnect hỗ trợ thanh toán giữa học viên và gia sư. Bằng cách
              sử dụng dịch vụ thanh toán của chúng tôi, bạn đồng ý với các điều
              khoản sau:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Tất cả phí được báo giá bằng VND trừ khi có quy định khác</li>
              <li>
                Học viên sẽ bị tính phí tại thời điểm đặt lịch hoặc theo lịch
                thanh toán đã thỏa thuận
              </li>
              <li>
                Gia sư sẽ nhận thanh toán sau khi buổi học kèm hoàn tất, trừ đi
                phí dịch vụ nền tảng
              </li>
              <li>
                Phí nền tảng của chúng tôi là một tỷ lệ phần trăm của tổng giao
                dịch và có thể thay đổi với thông báo trước
              </li>
              <li>Hoàn tiền có thể được thực hiện theo chính sách hoàn tiền của chúng tôi</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              6. Chính sách hủy và hoàn tiền
            </h2>
            <p>Chính sách hủy và hoàn tiền của chúng tôi như sau:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>
                Học viên có thể hủy buổi học mà không bị phạt ít nhất 24 giờ
                trước thời gian đã định
              </li>
              <li>
                Hủy muộn (thông báo dưới 24 giờ) có thể dẫn đến tính phí một
                phần hoặc toàn bộ
              </li>
              <li>Không tham gia buổi học có thể dẫn đến việc phải thanh toán
                đầy đủ</li>
              <li>
                Nếu gia sư hủy buổi học, học viên sẽ nhận được hoàn tiền đầy đủ
                hoặc tín dụng
              </li>
              <li>
                Các tranh chấp sẽ được đội hỗ trợ của chúng tôi xử lý theo từng
                trường hợp cụ thể
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              7. Sở hữu trí tuệ
            </h2>
            <p>
              TutorConnect và nội dung, tính năng, chức năng của nó thuộc sở
              hữu của chúng tôi và được bảo vệ bởi luật sở hữu trí tuệ quốc tế,
              bao gồm bản quyền, thương hiệu, bằng sáng chế, bí mật thương mại
              và các luật khác.
            </p>
            <p>
              Tài liệu do gia sư cung cấp (bao gồm kế hoạch bài học, bảng công
              tác, bài thuyết trình, v.v.) vẫn là tài sản trí tuệ của gia sư
              trừ khi có thỏa thuận khác giữa gia sư và học viên.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              8. Giới hạn trách nhiệm
            </h2>
            <p>
              Trong phạm vi tối đa được pháp luật cho phép, TutorConnect và các
              chi nhánh của nó sẽ không chịu trách nhiệm đối với bất kỳ thiệt
              hại gián tiếp, ngẫu nhiên, đặc biệt, hậu quả hoặc trừng phạt nào,
              hoặc bất kỳ tổn thất lợi nhuận hoặc doanh thu, dù phát sinh trực
              tiếp hay gián tiếp, hoặc bất kỳ tổn thất dữ liệu, quyền sử dụng,
              uy tín, hoặc các tổn thất vô hình khác, phát sinh từ:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Việc bạn sử dụng hoặc không thể sử dụng dịch vụ của chúng tôi</li>
              <li>
                Bất kỳ truy cập trái phép hoặc sử dụng máy chủ của chúng tôi
                và/hoặc bất kỳ thông tin cá nhân nào được lưu trữ trong đó
              </li>
              <li>
                Bất kỳ gián đoạn hoặc ngừng truyền tải đến hoặc từ dịch vụ của
                chúng tôi
              </li>
              <li>
                Chất lượng dịch vụ học kèm được cung cấp bởi gia sư trên nền
                tảng của chúng tôi
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              9. Giải quyết tranh chấp
            </h2>
            <p>
              Bất kỳ tranh chấp nào phát sinh từ hoặc liên quan đến các Điều
              khoản sử dụng này sẽ được giải quyết trước tiên thông qua thương
              lượng không chính thức. Nếu tranh chấp không thể giải quyết qua
              thương lượng, các bên đồng ý đưa ra trọng tài ràng buộc theo quy
              định của cơ quan trọng tài được công nhận tại Việt Nam.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              10. Sửa đổi điều khoản
            </h2>
            <p>
              Chúng tôi có quyền sửa đổi các Điều khoản sử dụng này bất kỳ lúc
              nào. Chúng tôi sẽ thông báo về bất kỳ thay đổi quan trọng nào
              bằng cách đăng các điều khoản cập nhật trên trang web của chúng
              tôi và cập nhật ngày "Cập nhật lần cuối". Việc bạn tiếp tục sử
              dụng dịch vụ của chúng tôi đồng nghĩa với việc chấp nhận các điều
              khoản đã sửa đổi.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              11. Luật điều chỉnh
            </h2>
            <p>
              Các Điều khoản sử dụng này sẽ được điều chỉnh và giải thích theo
              luật pháp Việt Nam, mà không xem xét đến các quy định xung đột
              pháp luật.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 bg-white dark:bg-gray-800 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">
              12. Thông tin liên hệ
            </h2>
            <p>
              Các câu hỏi hoặc ý kiến về các Điều khoản sử dụng này có thể được
              gửi đến:
            </p>
            <div className="mt-4">
              <p>
                <strong>TutorConnect</strong>
              </p>
              <p>123 Đường Giáo dục</p>
              <p>Hà Nội, Việt Nam</p>
              <p>Email: dieukhoan@tutorconnect.com</p>
              <p>Điện thoại: +84 123 456 7890</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}