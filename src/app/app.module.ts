import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { EsriMapViewModule } from "./esri-map-view/esri-map-view.module";
import { AppRoutingModule } from "./app-routing.module";
import { EsriModule } from "./esri-component/esri.module";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, EsriMapViewModule, EsriModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
