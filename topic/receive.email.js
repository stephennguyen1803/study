const amqplib = require('amqplib')
//.env
const amqp_url_cloud = 'amqps://cqgdsuwe:yQHpwhA0cCal6O4oE-Zlo_Nqfv-GZ1pz@armadillo.rmq.cloudamqp.com/cqgdsuwe'

const receiveEmail = async () => {
    try {
        //1.Create Connect   
        const conn = await amqplib.connect(amqp_url_cloud)
        //2. Create Channel
        const channel = await conn.createChannel()
        //3. Create exchange
        const nameExchange = 'send_email'

        await channel.assertExchange(nameExchange, 'topic', {
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
        const args = process.argv.slice(2);
        if (!args.length) {
            process.exit(0)
        }

        /*
            * có nghĩa là phù hợp với bất kỳ từ nào
            # khớp với một hoặc nhiều từ bất kỳ
        */
        console.info(`waiting queue ${queue}:::: topic::${args}`)
        
        args.forEach(async key => {
            await channel.bindQueue(queue, nameExchange, key)
        });

        await channel.consume( queue, msg => {
            console.log(`Routing key:${msg.fields.routingKey}::: msg::`, msg.content.toString())
            channel.ack(msg)
        })
    } catch (error) {
        console.error(error.message)
    }
}
receiveEmail()