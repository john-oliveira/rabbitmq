import amqp, { Connection } from "amqplib";
import { ENV } from "./environment";

class RabbitMQChannelFactory {
    
    private _conn!: Connection;

    constructor(private _uri: string) { }

    private async _connection(){
        if(!this._conn){
            this._conn = await amqp.connect(this._uri);
        }
        return this._conn;
    }

    public async createChannel(){
        const connection = await this._connection();
        return await connection.createChannel();
    }

 }

const RABBITMQ_URI = `amqp://${ENV.RABBITMQ_USER}:${ENV.RABBITMQ_PASS}@${ENV.RABBITMQ_HOST}:${ENV.RABBITMQ_PORT}`;

export const factory = new RabbitMQChannelFactory(RABBITMQ_URI);
