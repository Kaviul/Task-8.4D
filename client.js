const mqtt = require('mqtt');

// MQTT broker information

const client = mqtt.connect('mqtt://broker.hivemq.com:1883', {
     username : process.env.USERNAME,
     password : process.env.PASSWORD 
   });

// const brokerUrl = 'mqtt://broker.hivemq.com:1883';
// const options = {
//   clientId: 'cep_processor', // Choose a unique client ID
// };

//const client = mqtt.connect(brokerUrl, options);



// Initialize data structures to track drone status
const droneBatLev = {};
const droneLastLoc = {};
const droneLastUpdTime = {};

// Callback when connected to the MQTT broker
client.on('connect', () => {
  console.log('Connected to MQTT broker');

  const topic1 = 'drones/+/battery'
  const topic2 = 'drones/+/altitude'
  const topic3 = 'drones/+/lat_long'

  // Subscribe to drone data topics
  client.subscribe(topic1);
  client.subscribe(topic2);
  client.subscribe(topic3);
});

// Callback when a message is received
client.on('message', (topic, message) => {
  const topicSplits = topic.split('/');
  const droneId = topicSplits[1];

  // Process drone data based on topic
  if (topicSplits[2] === 'battery') {
    // Update battery level for the drone
    droneBatLev[droneId] = parseInt(message.toString(), 10);

    // Check for Scenario a: Battery levels below 10
    checkBatLev();
  } else if (topicSplits[2] === 'altitude') {
    // Check for Scenario b: Stationary drones at altitude above 100
    checkStatDrones(droneId, parseInt(message.toString(), 10));
  } else if (topicSplits[2] === 'lat_long') {
    // Update last known location and time for the drone
    droneLastLoc[droneId] = message.toString();
    droneLastUpdTime[droneId] = new Date();
  }
});

// Function to check battery levels and publish alerts
function checkBatLev() {
  const lowBatDrones = Object.keys(droneBatLev).filter(
    (droneId) => droneBatLev[droneId] < 10
  );

  if (lowBatDrones.length > 2) {
    // Publish alert for Scenario a
    client.publish('alerts', 'Alert: More than two drones have low battery levels.')
    console.log("Alert published: More than two drones have low battery levels ")
  }
}

// Function to check for stationary drones at altitude above 100
function checkStatDrones(droneId, altitude) {
  const currentTime = new Date();
  const lastUpdateTime = droneLastUpdTime[droneId];
  const location = droneLastLoc[droneId];

  if (altitude > 100 && lastUpdateTime) {
    const timeDiff = (currentTime - lastUpdateTime) / 60000; // in minutes

    if (timeDiff > 10) {
      // Publish alert for Scenario b
      client.publish('alerts', `Alert: Drone ${droneId} has been stationary above 100m for more than 10 minutes at ${location}`);
      console.log(`Drone ${droneId} has been stationary above 100m for more than 10 minutes at ${location}`)
    }
  }
}

// Subscribe to alerts (if needed)
client.subscribe('alerts');

// Callback when an alert message is received
client.on('message', (topic, message, droneId) => {
  const droneID = JSON.stringify(droneId)
  console.log(`Received alert: ${droneID.toString()} ${message.toString()}`);
  // Implement your logic to handle alerts here
});
