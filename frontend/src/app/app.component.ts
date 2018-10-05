import { Component, OnInit} from '@angular/core';
import * as mapbox from 'mapbox-gl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'app';
  cityCenter = [2.100792, 41.364409];
  map:any;

  ngOnInit() {
    this.setMapboxMap();
  }

  private setMapboxMap() {
    mapbox.accessToken='pk.eyJ1IjoidGV2dmVrIiwiYSI6ImNqbXc2MjBvZjE3cHcza3F5bGt6cGk2bnQifQ.Eg0yKWIiP2OeJss90olzEQ';
    var map = new mapbox.Map({
        container: 'map', // id del elemento HTML que contendrá el mapa
        style: 'mapbox://styles/mapbox/light-v9', // Ubicación del estilo
        center: this.cityCenter, // Ubicación inicial
        zoom: 13, // Zoom inicial
        bearing: -45, // Ángulo de rotación inicial
        hash: true // Permite ir guardando la posición del mapa en la URL
    });
  }
  
  // private setOnRightClickEvent() {
  //   this.map.on("contextmenu", (event) => {
  //     console.log("user right-clicked on map coordinates: " + event.latlng.toString());
  //   });
  // }

}
