import mqtt from "mqtt";

const client = mqtt.connect("mqtt://mqtt.lyaelectronic.com");

client.on("connect", function () {
  client.subscribe("lyatest/2486", function (err) {
    if (!err) {
      client.publish("lyatest/2486", "Hello mqtt");
    } else {
      console.log('lol');
    }
  });
});

client.on("message", function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  client.end();
});

//MQTT: mqtt://mqtt.lyaelectronic.com:1883