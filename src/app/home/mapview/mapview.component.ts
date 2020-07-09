import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  AfterViewInit,
} from "@angular/core";
import * as L from "leaflet";
import "leaflet-rotatedmarker";
import { GeolocService } from "../../services/geoloc.service";

import {
  DeviceOrientation,
  DeviceOrientationCompassHeading,
} from "@ionic-native/device-orientation/ngx";



@Component({
  selector: "app-mapview",
  templateUrl: "./mapview.component.html",
  styleUrls: ["./mapview.component.scss"],
})
export class MapviewComponent implements AfterViewInit {
  @Output() closeMapview: EventEmitter<any> = new EventEmitter();

  constructor(
    public geolocService: GeolocService,
    private deviceOrientation: DeviceOrientation
  ) {}

  ngAfterViewInit(): void {
    this.startAll();
  }
  ionViewWillLeave() {
    this.endAll();
  }

  async startAll() {
    try {
      this.startGeolocation();
      this.startHeading();
      this.initMap();
    } catch (err) {
      console.log(err);
    }
  }

  async endAll() {
    try {
      await this.processHeading.unsubscribe();
      await clearInterval(this.processGeo);
    } catch (err) {
      console.log(err);
    }
  }

  async onClickClose() {
    await this.endAll();
    this.closeMapview.emit();
  }

  isGeoLoaded = false;
  latitude = 0;
  longitude = 0;
  processGeo = null;
  startGeolocation() {
    // this.processGeo = setInterval(() => {
      this.isGeoLoaded = this.geolocService.isGeoLoaded;
      this.latitude = this.geolocService.latitude;
      this.longitude = this.geolocService.longitude;

      try {
        this.marker.setLatLng([this.latitude, this.longitude]);
      } catch (err) {
        console.log(err);
      }
    // }, 200);
  }

  heading = 0;
  processHeading = null;

  startHeading() {
    // Get the device current compass heading
    this.deviceOrientation.getCurrentHeading().then(
      (data: DeviceOrientationCompassHeading) => {
        // this.heading = data.magneticHeading;
        this.heading = data.trueHeading;
      },
      (error: any) => console.log(error)
    );

    // Watch the device compass heading change
    this.processHeading = this.deviceOrientation
      .watchHeading()
      .subscribe((data) => {
        // this.heading = data.magneticHeading;
        this.heading = data.trueHeading;
        try {
          this.marker.setRotationAngle(this.heading);
        } catch (err) {
          console.log(err);
        }
      });
  }

  map: L.Map;
  marker = null;
  initMap() {
    setTimeout(() => {
      console.log(this.latitude, this.longitude);
      this.map = L.map("map", {
        center: [this.latitude, this.longitude],
        zoom: 19,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.map);

      let blueIcon = L.icon({
        iconUrl: "assets/marker_direction.png",
        iconSize: [30, 1080], // size of the icon
        iconAnchor: [15, 1065], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -15], // point from which the popup should open relative to the iconAnchor
      });

      this.marker = L.marker([this.latitude, this.longitude], {
        title: "Origin",
        icon: blueIcon,
        alt: "+",
        draggable: true,
        rotationAngle: this.heading,
      }).addTo(this.map);
    }, 1000);
  }
}
