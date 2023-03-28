const amqplib = require('amqplib')
//.env
const amqp_url_cloud = 'amqps://gerdtutd:NE9d3XI8XeCQICM0OY8W-4kblKZ6To9Z@armadillo.rmq.cloudamqp.com/gerdtutd'

const postVideo = async ({msg}) => {
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
        //4. pushlish video
        await channel.publish(nameExchange, '', Buffer.from(msg))

        console.log(`[x] Send Ok::${msg}`)
        setTimeout( function(){
            conn.close();
            process.exit(0);
        }, 10000)
    } catch (error) {
        console.error(error.message)
    }
}
const msg = process.argv.slice(2).join(' ') || 'Hello exchange!!!'
postVideo({msg})