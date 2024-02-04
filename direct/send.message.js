const amqplib = require('amqplib')
const amqp_url_cloud = "amqps://cqgdsuwe:yQHpwhA0cCal6O4oE-Zlo_Nqfv-GZ1pz@armadillo.rmq.cloudamqp.com/cqgdsuwe"

const sendMessage = async () => {
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

        const args = process.argv.slice(2)
        const msg = args[1] || 'Fixed!'
        const rountingKey = args[0];

        console.log(`msg::${msg}::::rountingKey::${rountingKey}`)
        //4. publish Message
        await channel.publish(nameExchange, rountingKey, Buffer.from(msg))

        console.log(`[x] Send Ok::${msg}`)
        setTimeout( function(){
            conn.close();
            process.exit(0);
        }, 10000)
    } catch (error) {
        console.error(error.message)
    }
}

sendMessage()