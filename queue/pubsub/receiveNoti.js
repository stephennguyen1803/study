const amqplib = require('amqplib')
//.env
const amqp_url_cloud = 'amqps://gerdtutd:NE9d3XI8XeCQICM0OY8W-4kblKZ6To9Z@armadillo.rmq.cloudamqp.com/gerdtutd'

const receiveNoti = async () => {
    try {
        //1.Create Connect   
        const conn = await amqplib.connect(amqp_url_cloud)
        //2. Create Channel
        const channel = await conn.createChannel()
        //3. Create exchange
        const nameExchange = 'video'

        await channel.assertExchange(nameExchange, 'fanout', {
            durable: false
        })
        
        //4. Create queue
        const {
            queue
        } = await channel.assertQueue('', {
            exclusive:true
        })
        
        console.log(`nameQueue::${queue}`)

        //5. Binding (moi quan he giua exchange va queue goi la binding)
        await channel.bindQueue(queue, nameExchange, '')
        await channel.consume( queue, msg => {
            console.log(`msg::`, msg.content.toString())
            channel.ack(msg)
        })
    } catch (error) {
        console.error(error.message)
    }
}
receiveNoti()