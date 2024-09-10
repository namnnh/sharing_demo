const mqtt = require("mqtt");
const mqttBrokerUrl = process.env.MQTT_BROKER_URL || "mqtt://mqtt:1883";
const mqttChannel = process.env.MQTT_CHANNEL || "demo-channel";

const client = mqtt.connect(mqttBrokerUrl);

client.on("error", (error) => {
  console.error("Connection error:", error);
});

client.on("connect", () => {
  console.log("Connected to MQTT broker");
  setInterval(() => {
    const message = `Message sent at ${new Date().toISOString()}`;
    client.publish(mqttChannel, message);
    console.log("Published:", message);
  }, 10000); // 10s
});
