import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})
export class TypesComponent implements OnInit {

  map;
  container;

  constructor() { }

  ngOnInit() {
  }

  onAdd(map) {
    this.map = map;
    return this.container;
  }

  onRemove() {
    // this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }

}
