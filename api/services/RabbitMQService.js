/************************************************
 * 邮件队列RabbitMQ消息服务
 */
var amqp = require('amqplib');
var co = require("co");
module.exports = {
    SendToQueue: function(msg) {
        co(function*() {
            var conn = yield amqp.connect(sails.config.rabbitmq.url);
            var channel = yield conn.createChannel();
            yield channel.assertQueue(msg.queue, { durable: true });
            channel.sendToQueue(msg.queue, Buffer.from(JSON.stringify(msg)), { persistent: true });
            console.log("Send success ", JSON.stringify(msg));
            yield channel.close();
        }).catch(function(err) {
            console.log(err);
        });
    },
    GetToQueue: function(queue, callback) {
        co(function*() {
            var conn = yield amqp.connect(sails.config.rabbitmq.url);
            var channel = yield conn.createChannel();
            yield channel.assertQueue(queue, { durable: true });
            yield channel.consume(queue, function(msg) {
                if (msg != null) {
                    callback(msg);
                    channel.ack(msg);
                }

            }, { noAck: false });
            //yield channel.close();
        }).catch(function(err) {
            console.log(err);
        });
    }
};