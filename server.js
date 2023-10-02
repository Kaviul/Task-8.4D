const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://broker.hivemq.com:1883', {
     username : process.env.USERNAME,
     password : process.env.PASSWORD 
   });


const topic1 = 'drones/short distance/altitude'
const topic2 = 'drones/short distance/speed'
const topic3 = 'drones/short distance/battery'
const topic4 = 'drones/short distance/longitude-latitude'

const topic5 = 'drones/long distance/altitude'
const topic6 = 'drones/long distance/speed'
const topic7 = 'drones/long distance/battery'
const topic8 = 'drones/long distance/longitude-latitude'




client.on("connect", function() {
    setInterval(function(){
        var sht_dist_alt = Math.random() * 50;
        console.log(sht_dist_alt);
         client.publish(topic1, ' ' + sht_dist_alt.toString()+".") 

         var sht_dist_vel = Math.random() * 50;
         console.log(sht_dist_vel);
          client.publish(topic2, ' ' + sht_dist_vel.toString()+".") 

         var sht_dist_bat= Math.random() * 50;
         console.log(sht_dist_bat);
          client.publish(topic3, ' ' + sht_dist_bat.toString()+".") 

          var sht_dist_long = Math.random() * 50;
          console.log(sht_dist_long);
           client.publish(topic4, ' ' + sht_dist_long.toString()+".") 

           //Long distance drones topics

           var long_dist_alt = Math.random() * 50;
           console.log(long_dist_alt);
            client.publish(topic5, ' ' + long_dist_alt.toString()+".") 
   
            var long_dist_vel = Math.random() * 50;
            console.log(long_dist_vel);
             client.publish(topic6, ' ' + long_dist_vel.toString()+".") 
   
            var long_dist_bat= Math.random() * 50;
            console.log(long_dist_bat);
             client.publish(topic7, ' ' + long_dist_bat.toString()+".") 
   
             var long_dist_long = Math.random() * 50;
             console.log(long_dist_long);
              client.publish(topic8, ' ' + long_dist_long.toString()+".") 
    
}, 5000);
})






















