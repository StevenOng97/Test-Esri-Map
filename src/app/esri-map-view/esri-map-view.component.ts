import { Component, OnInit, ViewChild, ElementRef, OnDestroy, EventEmitter, Input, Output } from '@angular/core';

import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';

import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

import PopupTemplate from '@arcgis/core/PopupTemplate';
import CustomContent from '@arcgis/core/popup/content/CustomContent';

@Component({
  selector: 'app-esri-map-view',
  templateUrl: './esri-map-view.component.html',
  styleUrls: ['./esri-map-view.component.scss'],
})

export class EsriMapViewComponent implements OnInit, OnDestroy {
  public view!: MapView;
  public markerLayer!: GraphicsLayer;
  public polygonsLayer!: GraphicsLayer;

  public map: any = null;

  @Input() id: string = 'map';
  @Input() center?: [number, number];
  @Input() width?: string;
  @Input() height?: string;
  @Input() zoom: number = 10;
  @Input() basemap?: string;
  @Input() title?: string;
  @Input() available?: any;
  @Input() booked?: any;
  @Output() clickEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() addGraphicEvent: EventEmitter<any> = new EventEmitter<any>();
  // The <div> where we will place the map
  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;
  @ViewChild('popupTemplate', { static: true }) private popupTemplateEl!: ElementRef;

  currentGraphicId!: number | undefined;
  focusToLocation!: any;

  initializeMap(): Promise<any> {
    this.map = this.esriMap;
    this.view = this.viewConfiguration;

    return this.view.when();
  }

  constructor() {}

  ngOnInit(): any {
    this.initializeMap().then((_) => {
      this.addGraphicEvent.emit();
      console.log('The map is ready.');
    });
  }

  hoverEvent() {
    this.view.on('pointer-move', async (event: any) => {
      const { x, y } = event;
      const screenPoint = { x, y };

      const data = await this.view.hitTest(screenPoint);
      const { results = [] } = data;

      // Check if we are on any layers
      if (results.length > 0) {
        const polygonHovering = results.find((result: any) => result.layer.title === 'Unit');

        if (this.isOnLayerMouseMove(polygonHovering)) {
          this.showPopup(polygonHovering);
        }
      } else {
        this.layerMouseLeave();
      }
    });
  }

  isOnLayerMouseMove(polygonHovering: any): boolean {
    return (
      this.currentGraphicId !== polygonHovering.graphic?.attributes?.id &&
      polygonHovering.graphic?.attributes?.status === 1
    );
  }

  layerMouseLeave() {
    this.mapViewEl.nativeElement.style.cursor = 'grab';
    // this.currentGraphicId = undefined;
  }

  showPopup(polygonHovering: any) {
    this.mapViewEl.nativeElement.style.cursor = 'pointer';
    this.currentGraphicId = polygonHovering.graphic?.attributes?.id;

    this.view.popup.visibleElements = {
      closeButton: false,
      featureNavigation: false,
    };

    this.view.popup.dockOptions.buttonEnabled = false;

    // this.view.popup.alignment = 'top-center';
    this.view.popup.viewModel.includeDefaultActions = false;

    this.view.popup.open({
      location: polygonHovering?.graphic?.geometry?.centeroid,
      features: [polygonHovering.graphic],
    });
  }

  // centerMap(center: [number, number]): void {
  //   this.view.center = center;
  // }

  addMarker(markerGraphicConfiguration: any): void {
    this.markerLayer = new GraphicsLayer();
    const markerGraphic = new Graphic(markerGraphicConfiguration);

    this.markerLayer.add(markerGraphic);
    this.map.add(this.markerLayer);
  }

  addGraphic(graphicConfig: any): void {
    const { geometryType, attributes } = graphicConfig;
    const graphics: any = [];
    geometryType.rings.forEach((gt: any, idx: number) => {
      graphics.push(new Graphic(this.graphicConfiguration({ ...geometryType, rings: gt }, attributes[idx])));
    });

    const available = {
      type: 'simple-fill', // autocasts as new SimpleFillSymbol()
      color: [208, 92, 92],
      style: 'solid',
      outline: {
        width: 0.5,
        color: [255, 255, 255],
      },
    };

    const booked = {
      type: 'simple-fill', // autocasts as new SimpleFillSymbol()
      color: [0, 172, 131],
      style: 'solid',
      outline: {
        width: 0.5,
        color: [255, 255, 255],
      },
    };

    const diamondSymbol = {
      type: 'class-breaks',
      field: 'status',
      defaultLabel: 'no data',
      classBreakInfos: [
        {
          minValue: 1,
          maxValue: 1,
          symbol: booked,
          label: 'Booked',
        },
        {
          minValue: 2,
          maxValue: 2,
          symbol: available,
          label: 'Available',
        },
      ],
    } as __esri.RendererProperties;

    const popupTemplate = new PopupTemplate({
      content: [this.popupContent()],
    });

    const layer = new FeatureLayer({
      source: graphics,
      title: 'Unit',
      fields: [
        {
          name: 'id',
          type: 'oid',
        },
        {
          name: 'parcelno',
          type: 'string',
        },
        {
          name: 'status',
          type: 'integer',
        },
      ],
      popupTemplate,
      renderer: diamondSymbol,
    });

    this.map.add(layer);
    // this.hoverEvent();
  }

  graphicConfiguration(geometryType: any, attributes?: any) {
    return {
      geometry: geometryType as __esri.GeometryProperties,
      attributes,
    };
  }

  handleClick(event: any) {
    console.log(event);
  }

  popupContent() {
    return new CustomContent({
      outFields: ['*'],
      creator: () => {
        return this.popupTemplateEl.nativeElement;
      },
    });
  }

  get esriMap(): Map {
    // const basemap = new Basemap({
    //   portalItem: {
    //     id: "8dda0e7b5e2d4fafa80132d59122268c"  // WGS84 Streets Vector webmap
    //   }
    // });

    const mapConfiguration = {
      basemap: 'osm',
    };

    return new Map(mapConfiguration);
  }

  get viewConfiguration(): MapView {
    const container = this.mapViewEl.nativeElement;

    const configuration = {
      container,
      map: this.map,
      center: this.center,
      zoom: this.zoom,
    };

    return new MapView(configuration);
  }

  ngOnDestroy(): void {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
  }
}
