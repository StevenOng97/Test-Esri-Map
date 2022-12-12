import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from "@angular/core";
import { EsriMapViewComponent } from "../esri-map-view/esri-map-view.component";
import geojson from './data/geojson.json';
import available_units from './data/available-units.json';

@Component({
  selector: 'app-esri',
  templateUrl: './esri.component.html',
  styleUrls: ['./esri.component.scss'],
})

export class EsriComponent implements OnInit {
  focusLocation: [number, number] = [46.62008, 24.953067];
  lng?: string;
  lat?: string;

  unitsRing?: any;
  unitsAttributes?: any;

  @Output() updateLocationInfo: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('esriMapView', { static: false })
  esriMapView!: EsriMapViewComponent;

  constructor() {}

  ngOnInit(): void {
    this.initializeData();
  }

  initializeData(): void {
    const lands_number = available_units.data;

    geojson.features.forEach((g: any) => {
      if (lands_number.indexOf(g.properties.parcelcode) > -1) {
        g.properties.status = 1;
      } else {
        g.properties.status = 2;
      }
    });

    this.unitsRing = geojson.features.map(
      (g: any) => g.geometry.coordinates[0][0]
    );
    this.unitsAttributes = geojson.features.map((g: any) => g.properties);
  }

  polygonGraphicConfiguration(): any {
    const polygon = {
      type: 'polygon',
      rings: this.unitsRing,
    };

    return { geometryType: polygon, attributes: this.unitsAttributes };
  }

  public addPolygons(): void {
    const unitGraphicConfig = this.polygonGraphicConfiguration();
    this.esriMapView.addGraphic(unitGraphicConfig);
  }
}
