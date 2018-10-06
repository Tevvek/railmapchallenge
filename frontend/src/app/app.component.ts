import { Component, OnInit} from '@angular/core';
import * as mapbox from 'mapbox-gl';
import lineSlice from '@turf/line-slice';
import * as turfHelpers from '@turf/helpers';
import { TypesComponent } from './types/types.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'app';
  cityCenter = [2.100792, 41.364409];
  map:any;
  mockLinea;
  mockResponse;

  text = "hi";

  constructor() {
    this.mockLinea = [
      [2.075805, 41.363765],
      [2.080952, 41.351138],
      [2.108062, 41.353457], 
      [2.122271, 41.357232]
    ];

    this.mockResponse = [
      {
        'color': 'red',
        'sections': [
          {},
          {
            'points': [
              [2.104208, 41.362343],
              [2.086748, 41.349672]
            ]
          },
          {}
        ]
      },
      {
        'color': 'green',
        'sections': [ // siempre 3
          {
            'points': [
              [2.075805, 41.363765],
              [2.080952, 41.351138]
            ]
          },
          {
            'points': [
              [2.080952, 41.351138],
              [2.108062, 41.353457]        
            ]
          },
          {
            'points': [
              [2.108062, 41.353457], 
              [2.122271, 41.357232]
            ]
          }
          // TODO: define a get function for the active section
        ]
      }
    ] 
  }

  ngOnInit() {
    this.initMap();
    this.addCustomControl();
    this.mockRender();
    // this.transformResponseToFeatures();
    console.log("aleix chupame un");
  }

  private initMap() {
    mapbox.accessToken='pk.eyJ1IjoidGV2dmVrIiwiYSI6ImNqbXc2MjBvZjE3cHcza3F5bGt6cGk2bnQifQ.Eg0yKWIiP2OeJss90olzEQ';
    var map = new mapbox.Map({
        container: 'map', // id del elemento HTML que contendrá el mapa
        style: 'mapbox://styles/mapbox/light-v9', // Ubicación del estilo
        center: this.cityCenter, // Ubicación inicial
        zoom: 13, // Zoom inicial
        bearing: -45, // Ángulo de rotación inicial
        hash: true // Permite ir guardando la posición del mapa en la URL
    });
    this.map = map;
  }
  
  private mockRender() {
    this.map.on('load', () => {
      // var line = turfHelpers.lineString(this.mockLinea);
      // var points = this.mockResponse.sections[1].points;
      // var start = turfHelpers.point(points[0]);
      // var stop = turfHelpers.point(points[points.length-1]);
      // var sliced = lineSlice(start, stop, line);
      this.map.addLayer({
        "id": "route",
        "type": "line",
        "source": {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": this.transformResponseToFeatures()
          }
        },
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": ['get', 'color'],
          "line-width": 8
        }
      })
    });
  }

  private objIsEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  private transformResponseToFeatures() {
    var res = this.mockResponse;
    var features = [];
    for(var linea of this.mockResponse) {
      for(var i=0;i<linea.sections.length;++i) {
        var section = linea.sections[i];
        if(!this.objIsEmpty(section)) {
          var feature = {
            "type": "Feature",
            "properties": {
              "color": i == 1 ? linea.color : 'grey'
            },
            "geometry": {
              "type": "LineString",
              "coordinates": section.points
            }
          }
          features.push(feature);
        }
      }
    }
    return features;
  }

  private addCustomControl() {
    const control = new TypeControl();
    this.map.addControl(control, 'bottom-right');
  }
}

class TypeControl {
  map;
  container;

  onAdd(map) {
    this.map = map;
    this.container = document.getElementById('mainTypes');
    this.container.className = 'mapboxgl-ctrl';
    this.container.style.display = "flex";
    document.getElementById('typeButton').onclick = function() {
      var test = document.getElementById('mainTypes');
      test.classList.toggle('desplegado');
    }
    return this.container;
  }

  onRemove() {

  }

}
