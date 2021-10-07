import mqtt, { MqttClient } from "mqtt";

class MqttHandler {
  mqttClient: MqttClient | null;
  broker: string;
  topic: string;

  constructor() {
    this.mqttClient = null;
    this.broker = process.env.BROKER || "mqtt://test.mosquitto.org";
    this.topic = process.env.TOPIC || "lyatest/Betancourt";
  }

  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.broker);

    this.mqttClient.on("error", (err) => {
      console.log(err);
      this.mqttClient?.end();
      process.exit(1);
    });
  }

  sendMessage(message: string) {
    this.mqttClient?.publish(this.topic, message);
  }
}

export default MqttHandler;
