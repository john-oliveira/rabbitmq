import amqp from "amqplib";

const user = 'admin';
const pass = '123';
const exchange = 'ex.direct';
const exchangeType = 'direct';
const queue = 'payment';
const bindingKey = 'test'; //fanout exchange ignore binding key

const receive = async () => {
    const connection = await amqp.connect(`amqp://${user}:${pass}@localhost:5672`);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, exchangeType, { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, bindingKey);

    /*we can use the prefetch method with the value of 1. 
      This tells RabbitMQ not to give more than one message to a worker at a time. 
      Or, in other words, don't dispatch a new message to a worker until it has processed and acknowledged the previous one. 
      Instead, it will dispatch it to the next worker that is not still busy.*/
    await channel.prefetch(1);

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, (msg) => {
        console.log(" [x] %s: '%s'", msg!.fields.routingKey, msg!.content.toString());
        channel.ack(msg!);
        console.log(" [x] Done");
    }, {
        noAck: false //noAck means "no manual acknowledgements", so, automatic mode.
    });
}

receive();