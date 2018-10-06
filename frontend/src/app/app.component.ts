import { Component, OnInit} from '@angular/core';
import * as mapbox from 'mapbox-gl';
import lineSlice from '@turf/line-slice';
import * as turfHelpers from '@turf/helpers';
import { TypesComponent } from './types/types.component';
import { HttpClient } from '@angular/common/http';
import { lineaTram } from './lineaTram.js';
import { sectionTram } from './sectionTram.js';
import { camino } from './camino.js';
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
  mockParadas;
  tramBlanco = true;
  origen = false;
  destino = false;
  displayPuntos = "block";

  selectedOrigen = false;
  selectedDestino = false;

  text = "hi";

  constructor(http: HttpClient) {
    this.mockParadas = [
      {
        "id": 1,
        "name": "Metro parada A",
        "lat": 2.075805,
        "lon": 41.363765
      }
    ]

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
  
    // http.get("http://wservice.viabicing.cat/v2/stations").subscribe((result) => {
    //   console.log(result);
    // })
  }

  ngOnInit() {
    this.initMap();
    this.addCustomControl();
    this.addOrigenFinalControl();
    // this.mockAskStops();
    // this.mockRender();
    document.getElementById('tram-container').onclick = () => {
      this.tramBlanco = !this.tramBlanco;
      document.getElementById('tram-text').classList.toggle('text-green');
      document.getElementById('tram-container').classList.toggle('background-green');
      // var visibility = this.map.getLayoutVisibility()
      // if()
      this.renderTramStops();
      this.renderTramSections();
    }
    document.getElementById('origen__input').onclick = () => {
      document.getElementById('origen__input').classList.toggle('selected_input');
      this.origen = true;
      // var origenFinal = document.getElementById('origenFinal');
      // origenFinal.classList.remove('desplegado');
    }
    document.getElementById('destino__input').onclick = () => {
      document.getElementById('destino__input').classList.toggle('selected_input');
      this.destino = true;
    }

  }

  private transformSectionsToFeatures(data) {
    var features = [];
    for(var section of data.sections) {
      var feature = {
        "type": "Feature",
        "properties": {
          "color": data.color
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [section.from, section.to]
        }
      }
      features.push(feature);
    };
    return features;
  }

  private renderTramSections() {
    this.map.addLayer({
      "id": "route",
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": this.transformSectionsToFeatures(sectionTram)
        }
      },
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": '#127862',
        "line-width": 8
      }
    })
  }

  private renderTramStops() {
      lineaTram.forEach((station) => {
        var el = document.createElement('div');
        el.className = 'my-icon';
        el.style.width = '15px';
        el.style.height = '15px';
        el.style.background = 'white';
        el.style.border = "1px solid #127862";
        el.style.borderRadius = '50%';
        el.style.cursor = "pointer";
        // el.style.display = this.displayPuntos;
        el.addEventListener('click', () => {
          if(this.origen) {
            el.style.background = '#127862';
            this.origen = false;
            this.selectedOrigen = true;
            document.getElementById('origen__input').classList.toggle('selected_input');
          } else if(this.destino) {
            el.style.background = '#127862';
            this.destino = false;
            this.selectedDestino = true;
            document.getElementById('destino__input').classList.toggle('selected_input');
            if(this.selectedOrigen && this.selectedDestino) {
              this.reload();
            }
          }
        });
        // add marker to map
        new mapbox.Marker(el)
            .setLngLat([station.lon, station.lat])
            .addTo(this.map);
      })
  }

  private reload() {
    var visibility = this.map.getLayoutProperty('route', 'visibility');
    if (visibility === 'visible') {
      this.map.setLayoutProperty('route', 'visibility', 'none');
      this.map.addLayer({
        "id": "recorridoNuevo",
        "type": "line",
        "source": {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": this.transformFromCaminoToFeatures()
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
    }
  }

  private transformFromCaminoToFeatures() {
    var res = camino.path;
    var features = [];
    for(var activo of res.active) {
      var feature = {
        "type": "Feature",
        "properties": {
          "color": res["active-color"]
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [activo.from.lon, activo.from.lat],
            [activo.to.lon, activo.to.lat]
          ]
        }
      }
      features.push(feature);
    }
    for(var extra of res.extra) {
      var feature = {
        "type": "Feature",
        "properties": {
          "color": res["extra-color"]
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [extra.from.lon, extra.from.lat],
            [extra.to.lon, extra.to.lat]
          ]
        }
      }
      features.push(feature);
    }
    // for(var linea of res) {
    //   for(var i=0;i<linea.sections.length;++i) {
    //     var section = linea.sections[i];
    //     if(!this.objIsEmpty(section)) {
    //       var feature = {
    //         "type": "Feature",
    //         "properties": {
    //           "color": i == 1 ? linea.color : 'grey'
    //         },
    //         "geometry": {
    //           "type": "LineString",
    //           "coordinates": section.points
    //         }
    //       }
    //       features.push(feature);
    //     }
    //   }
    // }
    return features;
  }

  private renderLineaTram() {
    this.map.addLayer({
      "id": "tram",
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": this.transformTramSections()
        }
      },
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": '#127862',
        "line-width": 8
      }
    })
  }

  private transformTramSections() {
  }

  private mockAskStops() {
    this.map.on('load', () => {
      var paradas = this.mockParadas;
      var features = []
      for(var parada of paradas) {
        features.push({
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [parada.lat, parada.lon]
          },
          "properties": {
            "title": parada.name,
            "id": parada.id,
            "icon": {
              "className": "my-icon",
              "html": "&#9733;",
              "iconSize":null
            }
          }
        })
      }
      features.forEach((marker) => {
        var el = document.createElement('div');
        el.className = 'my-icon';
        // el.style.backgroundImage = 'url(https://placekitten.com/g/' + marker.properties.iconSize.join('/') + '/)';
        // el.style.width = marker.properties.iconSize[0] + 'px';
        // el.style.height = marker.properties.iconSize[1] + 'px';
        el.style.width = '15px';
        el.style.height = '15px';
        el.style.background = 'white';
        el.style.border = "1px solid green";
        el.style.borderRadius = '50%';
        // el.addEventListener('click', function() {
        // });
    
        // add marker to map
        new mapbox.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(this.map);
    
      })
    });
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
            "features": this.transformResponseToFeatures(this.mockResponse)
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

  private transformResponseToFeatures(data) {
    var res = data;
    var features = [];
    for(var linea of res) {
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

  private addOrigenFinalControl() {
    const control = new OrigenFinalControl();
    this.map.addControl(control, 'bottom-right');
  }
}

class OrigenFinalControl {
  map;
  container;

  onAdd(map) {
    this.map = map;
    this.container = document.getElementById('origenFinal');
    this.container.className = 'mapboxgl-ctrl';
    document.getElementById('origenFinal__label').onclick = function() {
      var origenFinal = document.getElementById('origenFinal');
      origenFinal.classList.toggle('desplegado');
    }
    return this.container;
  }

  onRemove() {

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
