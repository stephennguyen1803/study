const amqplib = require('amqplib')
const amqp_url_cloud = "amqps://cqgdsuwe:yQHpwhA0cCal6O4oE-Zlo_Nqfv-GZ1pz@armadillo.rmq.cloudamqp.com/cqgdsuwe";

const receiveMessage = async () => {
    try {
        //1.Create Connect   
        const conn = await amqplib.connect(amqp_url_cloud)
        //2. Create Channel
        const channel = await conn.createChannel()
        //3. Create exchange
        const nameExchange = 'send_message_direct'

        await channel.assertExchange(nameExchange, 'direct', {
            durable: true
        })

        //4. Create queue
        const {
            queue
        } = await channel.assertQueue('', {
            exclusive: true
        })

        console.log(`nameQueue::${queue}`)

        //5. Binding (moi quan he giua exchange va queue goi la binding)
        const args = process.argv.slice(2);
        if (!args.length) {
            process.exit(0)
        }

        console.info(`waiting queue ${queue}:::: rountingKey::${args}`)
        args.forEach(async key => {
            console.log(`key::${key}`)
            await channel.bindQueue(queue, nameExchange, key)
        });

        await channel.consume(queue, msg => {
            console.log(`Routing key:${msg.fields.routingKey}::: msg::`, msg.content.toString())
            channel.ack(msg)
        })
    } catch (error) {
        console.error(error.message)
    }
}

receiveMessage()