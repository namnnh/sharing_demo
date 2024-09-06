const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://mqtt:1883");

client.on("error", (error) => {
  console.error("Connection error:", error);
});

client.on("connect", () => {
  console.log("Connected to MQTT broker");
  setInterval(() => {
    const message = `Message sent at ${new Date().toISOString()}`;
    client.publish("demo-channel", message);
    console.log("Published:", message);
  }, 10000); // 10s
});
