const amqp = require("amqplib");

class MessageBroker {
  constructor() {
    this.channel = null;
  }
  // Dùng để kết nối với message Que nhằm tạo kênh để gửi tin nhắn
  async connect() {
    console.log("Connecting to RabbitMQ...");

    setTimeout(async () => {
      try {
        const connection = await amqp.connect("amqp://rabbitmq:5672");
        this.channel = await connection.createChannel();
        await this.channel.assertQueue("products");
        console.log("RabbitMQ connected");
      } catch (err) {
        console.error("Failed to connect to RabbitMQ:", err.message);
      }
    }, 20000); // delay 10 seconds to wait for RabbitMQ to start
  }
// Gửi tin nhắn vào hàng đợi của RabbitMQ
  async publishMessage(queue, message) {
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    }

    try {
      await this.channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message))
      );
    } catch (err) {
      console.log(err);
    }
  }
// Nhận tin nhắn từ hàng đợi của RabbitMQ và xử lý nó bằng callback function
  async consumeMessage(queue, callback) {
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    }

    try {
      await this.channel.consume(queue, (message) => {
        const content = message.content.toString();
        const parsedContent = JSON.parse(content);
        callback(parsedContent);
        this.channel.ack(message);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new MessageBroker();
