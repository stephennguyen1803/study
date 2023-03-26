const amqplib = require('amqplib')
//.env nen dua vao file nay
const amqp_url_cloud = 'amqps://gerdtutd:NE9d3XI8XeCQICM0OY8W-4kblKZ6To9Z@armadillo.rmq.cloudamqp.com/gerdtutd'
const amqp_url_docker = 'amqp://admin:admin@localhost:5672';

const receiveQueue = async () => {
    try {
        //1.Create Connect   
        const conn = await amqplib.connect(amqp_url_docker)
        //2. Create Channel
        const channel = await conn.createChannel()
        //3. create name queue
        const nameQueue = 'q2'
        //4. create queue
        await channel.assertQueue(nameQueue, {
            durable: true // co luu tru du lieu khi sever crash hay ko
        })
        //4.1 mỗi lần chỉ nhận 1
        channel.prefetch(1)
        //5. Receive message from queue
        //5.1 Nhận và xử lý dữ liệu cách 1
        // await channel.consume(nameQueue, msg => {
        //     console.log(`Msg::`,msg.content.toString())
        // },{
        //     noAck: true // xac nhan da nhan message hay chua (true la da nhan)
        // })
        //5.2 Cach lấy dữ liệu bằng cơ chế khác
        await channel.consume(nameQueue, msg => {
            console.log(`Msg::`,msg.content.toString())
            channel.ack(msg)
        })
        //6. Close connection and channel
    
    } catch (error) {
        console.error(`Error::`, error.message)
    }
}

receiveQueue()
