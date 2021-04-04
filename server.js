var gpstracker = require("./lib/server");
var mqtt = require("mqtt");
var client = mqtt.connect(
  "mqtt://127.0.0.1",
  {}
);

client.on("connect", function() {
  console.log("MQTT connected");
});

var server = gpstracker.create().listen(8090, function() {
  console.log("listening your gps trackers on port", 8090);
});

server.trackers.on("connected", function(tracker) {
  console.log("tracker connected with imei:", tracker.imei);

  tracker.on("position", function(position) {
    client.publish(tracker.imei, position.lat + "*" + position.lng);
    console.log(
      "tracker {" + tracker.imei + "}: lat",
      position.lat,
      "lng",
      position.lng
    );
  });

  tracker.trackEvery(10).seconds();
});
