# Study
## RabitMQ
### Sử dụng Rabit Mq để làm gì:
- Tách kiến trúc service. Ví dụ trong một hệ thống Ecommerce, khi khách hàng gửi request mua hàng. Thay vì hệ thống Ecommerce này phải xử lý tất các các bước từ ghi nhận, giao hàng, chuyển đơn hàng thì nên tách ra các service mỗi service đảm nhiệm các nhiệm vụ đấy
- Tối ưu thơi gian request. Ví dụ khi đặt đơn hàng sẽ có các action (gửi email thông báo, tích điểm,..). Thì thay vì xử lý đồng bộ (tốn thời gian để response request khi phải đợi tất cả các process completed -> Chuyển sang xử lý bất đồng bộ (Đặt hàng xong -> gửi message lên queue -> các service khác sẽ nhận và xử lý riêng. Request đặt hàng ko cần đợi các process khác.
- Sử dụng để tối ưu request lên server. (ví dụ chạy chương trình khuyến mãi 2000 sp => Mysql chỉ chịu đc 2000 request/s. Tuy nhiên lượng request trong khoảng thời gian khuyến mãi tăng đột biến lên 5000 request/s. Ta sử dụng RabbitMQ để đẩy request lên queue. Queue chỉ gửi  2000 request/s sang Mysql. 3000 request còn lại sẽ xử lý sau giai đoạn cao điểm - thông báo yêu cầu bị từ chối do hệ thống hết sản phẩm.
### Nhược điểm của RabitMQ:
- Tăng độ phức tạp của hệ thống.
- Có trường hợp bị mất dữ liệu.
- Có thể xảy ra trường hợp không đồng nhất ở 2 hệ thống (Queue báo thành công - Master data không nhận dc) - Vi phạm tính nhất quán của hệ thống.
### So sách RabitMQ và Kafka:
- Thông lượng của RabitMQ thấp hơn Kafka (RabitMQ xấp xỉ 10000)
- Tính khả dụng RabitMQ rất cao có kiến trúc phân tán. Kafka tính khả dụng rất rất cao, hỗ trợ hệ thống phân tán
- RabbitMQ dễ mất message hơn Kafka
- Độ tin cậy dữ liệu của RabitMQ cao hơn Kafka
- Tốc độ (độ trễ thấp) RabitMQ tốn hơn Kafka
## RabitMQ chi tiết các thông số cần thiết
### NoAck
(cơ chế xác định message đã đc consomer xử lý xong để RabitMQ sẽ xóa khỏi hàng đợi để ko gửi lại lần sau -> noAck). noAck = true Được set ở consomer để thông báo cho RabbitMQ là consomer đã xử lý xong và có thể xóa message ra khỏi queue.
Một số chú ý. Khi consumer cần xử lý xong message mới nhận message mới có thể define **chanel.prefetch(1)** để đảm bảo consumer chỉ nhật 1 message. Khi nào xử lý xong mới nhận message mới.
Còn có thể sử dụng **channel.ack(msg)** tương tự với viết set **noAck = true**
 ### TTL
Để tránh trường hợp consomer không thông báo kết qủa khi xử lý message.Dữ liệu message tồn tại hoài trong queue -> cần giải phóng khỏi queue để xử lý tiếp. Ta cần set expiration trong procedure gửi message(time to live -> Message được tồn tại trong một khoảng thời gian -> được set khi procedure gửi dữ liệu -> expiration)
### Durable:
Khi RabbitMQ bị restart hoặc crash app thì cần đảm bảo các queue vẫn tồn tại. Ta sẽ set durable = true khi khởi tạo queue bên consomer. (**Lưu ý rằng tham số này chỉ đảm bảo queue chứ không đảm bảo message trong queue**). Đồng thời queue này phải được set đồng nhất ở cả procedure và consomer. Tức là nếu procedure set **durable = true** thì consomer cũng phải set queue này **durable = true**
### Persistent:
Khi RabbitMQ bị restart hoặc crash app thì cần đảm bảo message trong queue vẫn còn tồn tại (yêu cầu queue phải đc set durable = true). Khi này ta set persistent = true khi gửi message (procedure send message) đảm bảo dữ liệu message ko bị mất khi RabbitMQ bị crash hoặc restart. (Dữ liệu message được lưa vào ổ đĩa).
### Round Robin:
RabbitMQ hiện tại đang sử dụng thuật toán Round Robin khi có nhiều consumer cùng chạy (cùng 1 cosumer đó nhưng chạy trên nhiều instance) thì message sẽ đc gửi lần lượt cho các consumer. (Thuật toán Round Robin là thuật toán lựa chọn các máy chủ theo một trình tự nhất định. Load balancer sẽ bắt đầu từ máy chủ số 1 tương ứng trong danh sách, và Load balancer sẽ di chuyển dần đến hết danh sách theo thứ tự. Khi đến trang cuối cùng thì Load balancer sẽ bắt đầu lại.).
### Consumer Prefetch:
Được sử dụng để giới hạn số message mà consumer nhận và xử lý.
## Publish Subscribe
### Fanout Exchange: 
- **Exchange**: nằm chính giữa producer và queue.
- **Binding**: nằm chỉnh giữa Exchange và queue (điều hướng đến queue)
- Gửi message đến tất cả các consumer đăng ký (exchange và queue). Một message tất cả các consumer đều nhận được
### Direct Exchange:
- **Exchange**: nằm chính giữa producer và queue.
- **Binding**: nằm chỉnh giữa Exchange và queue (điều hướng đến queue).
- Gửi message chính xác các queue đã đăng ký binding key. Bắt buộc Exchange phải gửi message chính xác theo binding key. Consumer sẽ dựa vào đó để nhận message. Ví dụ ta publish mesage vô exchange có tên là **`send_message_direct`** và có **`routing_key`** là dev. Ở cosumer ta có 1 queue đang binding key theo ba từ khoá (dev, qc, leader) và 1 queue khác chỉ có từ khoá là dev. Khi này cá 2 consumer đều nhận dc message. Tuy nhiên nếu ở publish ta sử dụng **`routing_key`** là leader thì chỉ có 1 consumer 1 là nhận dc message. Nói đơn giản là **`routing_key`** phải giống nhau ở cả publisher và consumer.
### Topic Exchange:
- **Exchange**: nằm chính giữa producer và queue.
- **Binding**: nằm chỉnh giữa Exchange và queue (điều hướng đến queue)
- Quan trọng nhất là việc điều hướng đến các topic khác nhau. Dựa vào key của topic để có thể lựa chọn phù hợp.
- `*`có nghĩa là phù hợp với bất kỳ từ nào trước dấu `.`(ví dụ nếu publish message có topic là **dev.test.leader**) thì các topic có được define **dev.test.leader**, **`*.test.*`**, **`*.*.leader`** sẽ nhận dc tin nhắn. Tuy nhiên **`*.leader`** sẽ ko nhận dc tin nhắn
- `#` khớp với một hoặc nhiều từ bất kỳ với dấu `.` để detect (ví dụ nếu publish message có topic là **dev.test.leader**) thì các topic có được define **dev.#**, **#.leader** sẽ nhận đc message 
