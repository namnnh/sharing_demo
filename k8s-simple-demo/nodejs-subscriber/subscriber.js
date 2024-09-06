const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://mqtt:1883");

try {
  console.log("Subscriber is running");
  client.on("connect", () => {
    console.log("Connected to MQTT broker");
    client.subscribe("demo-channel", (err) => {
      if (err) {
        console.error("Failed to subscribe to topic:", err);
        return;
      }
      console.log("Subscribed to topic: demo-channel");
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
