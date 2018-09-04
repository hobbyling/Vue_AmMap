<template>
  <div id="app">
    <!-- <button @click="test">click</button> -->
    <div id="mapdiv" style="width: 100%; background-color:#d5eff7; height: 100vh;"></div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      ipdata: [],
      originLon: "121.3355",
      originLat: "25.0449",
      targetSVG:
        "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z",
      line: [],
      point: [],
      period: 0,
      rpoint: {},
      images: [
        {
          id: "taipei",
          color: "#000000",
          type: "circle",
          title: "Taipei",
          latitude: "",
          longitude: "",
          scale: 1.5,
          // zoomLevel: 2.74,
          zoomLongitude: 121.3355,
          zoomLatitude: 25.0449,
          lines: []
        }
      ]
    };
  },
  methods: {
    getDB() {
      const api = "./static/data.json";
      const vm = this;
      this.$http
        .get(api)
        .then(function(response) {
          vm.ipdata = response.data;
          // console.log(response);
          vm.getLatLon();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getLatLon() {
      //http://ip-api.com/docs/api:json

      const vm = this;
      const ipLen = vm.ipdata.length;

      vm.images[0].latitude = vm.originLat;
      vm.images[0].longitude = vm.originLon;

      for (let i = 0; i < ipLen; i++) {
        let api = `http://ip-api.com/json/${vm.ipdata[i].ip}`;

        vm.$http.get(api).then(response => {
          let objLine = {};
          (objLine["latitudes"] = [vm.originLat, response.data.lat]),
            (objLine["longitudes"] = [vm.originLon, response.data.lon]);

          let objPoint = {};
          objPoint["svgPath"] = vm.targetSVG;
          objPoint["title"] = response.data.regionName;
          objPoint["latitude"] = response.data.lat;
          objPoint["longitude"] = response.data.lon;

          if (i == 0) {
            // console.log(i + ":" + vm.period);
          } else {
            var startse = new Date(
              Date.parse(vm.ipdata[i - 1].time.replace(/-/g, "/"))
            );
            var endse = new Date(
              Date.parse(vm.ipdata[i].time.replace(/-/g, "/"))
            );
            vm.period = endse - startse;
            // console.log(i + ":" + vm.period);
          }

          this.delay(i, objLine, objPoint, vm.period);
        });
      }
    },
    delay(i, line, point, s) {
      const vm = this;

      setTimeout(function() {
        vm.line.push(line);
        vm.point.push(point);

        vm.images[0].lines = vm.line;
        vm.images.push(point);

        console.log("index:" + i + "/ ip:" + vm.ipdata[i].ip + "/ time:" + s);
        vm.showMap();
      }, s);
    },
    showMap() {
      const vm = this;
      AmCharts.makeChart("mapdiv", {
        type: "map",
        addClassNames: true,

        dataProvider: {
          map: "worldLow",
          getAreasFromMap: true,
          linkToObject: "taipei",
          images: this.images
        },

        areasSettings: {
          unlistedAreasColor: "#FFCC00"
        },

        imagesSettings: {
          color: "#CC0000",
          rollOverColor: "#CC0000",
          selectedColor: "#000000"
        },

        linesSettings: {
          color: "#CC0000",
          alpha: 0.4
        },

        backgroundZoomsToTop: false,
        linesAboveImages: true
      });

      // vm.line = [];
      // vm.point = [];
      // vm.images.splice(1, 1);
    }
  },
  created() {
    // svg path for plane icon
    var planeSVG =
      "M19.671,8.11l-2.777,2.777l-3.837-0.861c0.362-0.505,0.916-1.683,0.464-2.135c-0.518-0.517-1.979,0.278-2.305,0.604l-0.913,0.913L7.614,8.804l-2.021,2.021l2.232,1.061l-0.082,0.082l1.701,1.701l0.688-0.687l3.164,1.504L9.571,18.21H6.413l-1.137,1.138l3.6,0.948l1.83,1.83l0.947,3.598l1.137-1.137V21.43l3.725-3.725l1.504,3.164l-0.687,0.687l1.702,1.701l0.081-0.081l1.062,2.231l2.02-2.02l-0.604-2.689l0.912-0.912c0.326-0.326,1.121-1.789,0.604-2.306c-0.452-0.452-1.63,0.101-2.135,0.464l-0.861-3.838l2.777-2.777c0.947-0.947,3.599-4.862,2.62-5.839C24.533,4.512,20.618,7.163,19.671,8.11z";

    const vm = this;
    vm.showMap();
    vm.getDB();
    // setInterval(vm.getLatLon, 6000);
    // setInterval(vm.showMap, 10000);
  }
};
</script>

<style>
.amcharts-map-line {
  stroke-dasharray: 2px 2px;
  stroke-linejoin: round;
  stroke-linecap: round;
  -webkit-animation: am-moving-dashes 3s linear infinite;
  animation: am-moving-dashes 3s linear infinite;
}

@-webkit-keyframes am-moving-dashes {
  100% {
    stroke-dashoffset: -30px;
  }
}
@keyframes am-moving-dashes {
  100% {
    stroke-dashoffset: -30px;
  }
}

.amcharts-map-image-london {
  -webkit-animation: am-pulsating 1s ease-out infinite;
  animation: am-pulsating 1s ease-out infinite;
}
@-webkit-keyframes am-pulsating {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}
@keyframes am-pulsating {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.amcharts-map-area:hover {
  fill: #93c765;
  stroke: #93c765;
  -webkit-transition: all 0.3s ease-out;
  transition: all 0.3s ease-out;
}
</style>
