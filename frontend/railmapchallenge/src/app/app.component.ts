import { Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import { Icon, icon, Marker, marker } from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'app';
  cityCenter = [41.390205, 2.154007];
  map:any; // leaflet map

  private defaultIcon: Icon = icon({
    iconUrl: 'assets/leaflet/marker-icon.png',
    shadowUrl: 'assets/leaflet/marker-shadow.png'
  }); // fix for markers

  ngOnInit() {
    this.overrideMarkersForFixing();
    this.initMap();
    this.setOnRightClickEvent();
    // this was a test
    // var marker = L.marker(this.cityCenter).addTo(map);
  }
  
  private overrideMarkersForFixing() {
    Marker.prototype.options.icon = this.defaultIcon;
  }

  private initMap() {
    var map = L.map('map').setView(this.cityCenter, 19);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,  
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    this.map = map;
  }

  private setOnRightClickEvent() {
    this.map.on("contextmenu", (event) => {
      this.map.setZoom(18);
      console.log("user right-clicked on map coordinates: " + event.latlng.toString());
      L.marker(event.latlng).addTo(this.map);
    });

  }

}
