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
### TTL
Để tránh trường hợp consomer không thông báo kết qủa khi xử lý message.Dữ liệu message tồn tại hoài trong queue -> cần giải phóng khỏi queue để xử lý tiếp. Ta cần set expiration trong procedure gửi message(time to live -> Message được tồn tại trong một khoảng thời gian -> được set khi procedure gửi dữ liệu -> expiration)
### Durable:
Khi RabbitMQ bị restart hoặc crash app thì cần đảm bảo các queue vẫn tồn tại. Ta sẽ set durable = true khi khởi tạo queue bên consomer. (**Lưu ý rằng tham số này chỉ đảm bảo queue chứ không đảm bảo message trong queue**)
### Persistent:
Khi RabbitMQ bị restart hoặc crash app thì cần đảm bảo message trong queue vẫn còn tồn tại (yêu cầu queue phải đc set durable = true). Khi này ta set persistent = true khi gửi message (procedure send message) đảm bảo dữ liệu message ko bị mất khi RabbitMQ bị crash hoặc restart. (Dữ liệu message được lưa vào ổ đĩa)
