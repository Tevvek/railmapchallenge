import { Component, OnInit} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'app';
  cityCenter = [41.390205, 2.154007];
  ngOnInit() {
    var map = L.map('map').setView(this.cityCenter, 20);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    // var marker = L.marker(this.cityCenter).addTo(map);
    // map.on("contextmenu", function (event) {
    //   console.log("user right-clicked on map coordinates: " + event.latlng.toString());
    //   L.marker(event.latlng).addTo(map);
    // });
  }

}
