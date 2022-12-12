import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EsriMapViewComponent } from './esri-map-view.component';

@NgModule({
  declarations: [EsriMapViewComponent],
  exports: [EsriMapViewComponent],
  imports: [CommonModule],
})
export class EsriMapViewModule {}
