import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EsriMapViewModule } from '../esri-map-view/esri-map-view.module';
import { EsriComponent } from './esri.component';

@NgModule({
  declarations: [EsriComponent],
  exports: [EsriComponent],
  imports: [CommonModule, EsriMapViewModule],
})

export class EsriModule {}
