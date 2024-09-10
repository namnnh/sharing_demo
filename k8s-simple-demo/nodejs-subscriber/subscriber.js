const mqtt = require("mqtt");
const mqttBrokerUrl = process.env.MQTT_BROKER_URL || "mqtt://mqtt:1883";
const mqttChannel = process.env.MQTT_CHANNEL || "demo-channel";

const client = mqtt.connect(mqttBrokerUrl);

try {
  console.log("Subscriber is running");
  client.on("connect", () => {
    console.log("Connected to MQTT broker");
    client.subscribe(mqttChannel, (err) => {
      if (err) {
        console.error("Failed to subscribe to topic:", err);
        return;
      }
      console.log("Subscribed to topic:", mqttChannel);
    });
  });

  client.on("message", (topic, message) => {
    const payload = message.toString();
    console.log("Received Message:", topic, payload);
  });

  client.on("error", (err) => {
    console.error("MQTT client error:", err);
  });
} catch (e) {
  console.error(e);
}
