const amqplib = require('amqplib')
//.env nen dua vao file nay
const amqp_url_cloud = 'amqps://gerdtutd:NE9d3XI8XeCQICM0OY8W-4kblKZ6To9Z@armadillo.rmq.cloudamqp.com/gerdtutd'
const amqp_url_docker = 'amqp://admin:admin@localhost:5672';

const sendQueue = async ({ msg }) => {
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
        //5. Send message to queue
        //5.1 Buffer gui du lieu nhanh (bang byte), ma hoa msq thanh byte va buffer ho tro dieu nay
        // await channel.sendToQueue(nameQueue, Buffer.from(msg), {
        //     expiration: '10000' //10s => TTL time to live
        // })
        await channel.sendToQueue(nameQueue, Buffer.from(msg), {
            persistent: true // luu tin nhắn vào db -> tránh mất dứ liệu khi crash rabbit MQ
        })
        //6. Close connection and channel
    
    } catch (error) {
        console.error(`Error::`, error.message)
    }
}

const msg =  process.argv.slice(2).join('') || 'hello';
sendQueue({ msg: msg})