import { Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import { Icon, icon, Marker, marker } from 'leaflet';
// import * as as from 'leafet/dist/images/marker-icon.png';
// import icon from '../../node_modules/leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'app';
  cityCenter = [41.390205, 2.154007];
  private defaultIcon: Icon = icon({
    iconUrl: 'assets/leaflet/marker-icon.png',
    shadowUrl: 'assets/leaflet/marker-shadow.png'
  });

  ngOnInit() {
    Marker.prototype.options.icon = this.defaultIcon;

    var map = L.map('map').setView(this.cityCenter, 20);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    // let layer = marker([ 46.879966, -121.726909 ], {
    //   icon: icon({
    //      iconSize: [ 25, 41 ],
    //      iconAnchor: [ 13, 41 ],
    //      iconUrl: 'assets/marker-icon.png',
    //      shadowUrl: 'assets/marker-shadow.png'
    //   })
    // });
   
    var marker = L.marker(this.cityCenter).addTo(map);
    // map.on("contextmenu", function (event) {
    //   console.log("user right-clicked on map coordinates: " + event.latlng.toString());
    //   L.marker(event.latlng).addTo(map);
    // });
  }

}
