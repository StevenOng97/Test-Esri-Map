import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EsriComponent } from './esri-component/esri.component';

const routes: Routes = [
  { path: '', component: EsriComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
