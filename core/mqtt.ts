import mqtt, { MqttClient } from "mqtt";

//Clase que gestiona el cliente de mqtt
class MqttHandler {
  mqttClient: MqttClient | null;
  broker: string;
  topic: string;

  constructor() {
    this.mqttClient = null;
    this.broker = process.env.BROKER || "mqtt://test.mosquitto.org";
    this.topic = process.env.TOPIC || "lyatest/Betancourt";
  }

  //Funcion para conectarse al broker
  connect() {
    this.mqttClient = mqtt.connect(this.broker);

    this.mqttClient.on("error", (err) => {
      console.log(err);
      this.mqttClient?.end();
      process.exit(1);
    });
  }

  //Funcion para enviar mensaje a un topic
  sendMessage(message: string) {
    this.mqttClient?.publish(this.topic, message);
  }
}

export default MqttHandler;
