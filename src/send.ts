import amqp, { Connection } from "amqplib";

const user = 'admin';
const pass = '123';
var exchange = 'ex.direct';
var exchangeType = 'direct';
var routingKey = 'test';

const send = async (msg: string) => {
    const connection = await amqp.connect(`amqp://${user}:${pass}@localhost:5672`);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, exchangeType, { durable: true });
    channel.publish(exchange, routingKey, Buffer.from(msg), { persistent: true });
    console.log(" [x] Sent %s", msg);
    await channel.close();
    connection.close();
}

var number = 1;
const timer = setInterval(()=>{
    send(`Hello World! - ${number++}`);
    if(number > 10000){
        clearInterval(timer);
    }
}, 1)