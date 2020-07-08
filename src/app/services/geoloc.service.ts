import { Injectable } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";

@Injectable({
  providedIn: "root",
})
export class GeolocService {
  constructor(private geolocation: Geolocation) {}

  isGeoLoaded = false;
  latitude = 0;
  longitude = 0;
  accuracy = 0;
  timestamp = 0;
  processGeo = null;

  startGeolocation(callback) {
    // this.geolocation
    //   .getCurrentPosition()
    //   .then((resp) => {
    //     this.isGeoLoaded = true;
    //     this.latitude = resp.coords.latitude;
    //     this.longitude = resp.coords.longitude;
    //     this.accuracy = resp.coords.accuracy;
    //     this.timestamp = resp.timestamp;
    //     console.log('gogogogo', resp);
    //     callback();
    //   })
    //   .catch((error) => {
    //     alert("Error getting location" + error);
    //   });

    this.processGeo = this.geolocation.watchPosition();
    this.processGeo.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // console.log(data.coords);

      this.latitude = data.coords.latitude;
      this.longitude = data.coords.longitude;
      this.accuracy = data.coords.accuracy;
      this.timestamp = data.timestamp;
      if (this.isGeoLoaded === false) {
        this.isGeoLoaded = true;
        callback();
      }
    });
  }

  async stopGeolocation() {
    await this.processGeo.unsubscribe();
  }
}
