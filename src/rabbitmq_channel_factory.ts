import amqp, { Connection } from "amqplib";

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

const user = 'admin';
const pass = '123';
export const factory = new RabbitMQChannelFactory(`amqp://${user}:${pass}@localhost:5672`);
