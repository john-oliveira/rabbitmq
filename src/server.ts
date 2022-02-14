import restify from 'restify';
import { factory } from "./rabbitmq_channel_factory";

const server = restify.createServer();
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

const exchange = 'ex.direct';
const exchangeType = 'direct';
const routingKey = 'test';

server.post('/payment', async function (req, res, next) {
    const message = JSON.stringify(req.body);
    const channel = await factory.createChannel();
    await channel.assertExchange(exchange, exchangeType, { durable: true });
    channel.publish(exchange, routingKey, Buffer.from(message), { persistent: true });
    console.log("Sent: %s", message);
    channel.close();
    res.send("Sent");
    return next();
});

server.listen(8080, function () {
    console.log('Server listening...');
});