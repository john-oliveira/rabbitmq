import amqp from "amqplib";

const user = 'admin';
const pass = '123';
const exchange = 'ex.direct';
const exchangeType = 'direct';
const routingKey = 'test';

const send = async (msg: string) => {
    const connection = await amqp.connect(`amqp://${user}:${pass}@localhost:5672`);
    let i: number;
    const quantity: number = 1000000;
    for(i=1;i<=quantity;i++){
        const channel = await connection.createChannel();
        await channel.assertExchange(exchange, exchangeType, { durable: true });
        let message = `${msg} - ${i}`;
        channel.publish(exchange, routingKey, Buffer.from(message), { persistent: true });
        console.log(" [x] Sent %s", message);
        if(i != quantity){
            channel.close();
        }else{
            await channel.close();
            connection.close();//closing connection after await to close the channel to avoid to lose the last message
        }
    };
}

send('Hello World!');