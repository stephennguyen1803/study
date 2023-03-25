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
