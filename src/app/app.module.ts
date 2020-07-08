import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BLE } from "@ionic-native/ble/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { LocationAccuracy } from "@ionic-native/location-accuracy/ngx";
import {
  DeviceOrientation,
  DeviceOrientationCompassHeading,
} from "@ionic-native/device-orientation/ngx";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BLE,
    AndroidPermissions,
    LocationAccuracy,
    Geolocation,
    DeviceOrientation,
    ScreenOrientation
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
