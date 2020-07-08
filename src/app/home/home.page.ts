import { Component, NgZone, OnInit } from "@angular/core";
import { BLE } from '@ionic-native/ble/ngx';
import { Subscription } from 'rxjs';
import { GeolocService } from "../services/geoloc.service";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { LocationAccuracy } from "@ionic-native/location-accuracy/ngx";
import { Platform } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  devices: any[] = [];
  private bleScanSubscription: Subscription;

  constructor(
    private ble: BLE,
    private ngZone: NgZone,
    public geolocService: GeolocService,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private screenOrientation: ScreenOrientation,
    private platform: Platform
  ) {}

  ngOnInit() {
    if (this.platform.is("hybrid")) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.checkGPSPermission();
    } else {
      this.initAppData();
    }
  }

  //Check if application having GPS access permission
  checkGPSPermission() {
    this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
      )
      .then(
        (result) => {
          if (result.hasPermission) {
            //If having permission show 'Turn On GPS' dialogue
            this.askToTurnOnGPS();
          } else {
            //If not having permission ask for permission
            this.requestGPSPermission();
          }
        },
        (err) => {
          alert(err);
        }
      );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions
          .requestPermission(
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
          )
          .then(
            () => {
              console.log("ACCESS_COARSE_LOCATION");
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            (error) => {
              //Show alert if user click on 'No Thanks'
              alert(
                "requestPermission Error requesting location permissions " +
                  error
              );
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy
      .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(
        () => {
          console.log("REQUEST_PRIORITY_HIGH_ACCURACY");
          // When GPS Turned ON call method to get Accurate location coordinates
          this.initAppData();
        },
        (error) =>
          alert(
            "Error requesting location permissions " + JSON.stringify(error)
          )
      );
  }

  loadText = "Loading";

  initAppData() {
    // read arrTarget
    this.loadText = "Getting location data";

    this.geolocService.startGeolocation(() => {
      this.loadText = "";
    });
  }

  ionViewWillLeave() {
    console.log("ionViewWillLeave disconnecting Bluetooth");
    this.bleScanSubscription.unsubscribe();
  }

  scan() {
    this.devices = [];
    this.bleScanSubscription = this.ble
      .scan([], 15)
      .subscribe((device) => this.onDeviceDiscovered(device));
  }

  onDeviceDiscovered(device) {
    console.log("Discovered" + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
      console.log(device);
    });
  }

  colonedMac(mac) {
    return mac.replace(/(..?)/g, "$1:").slice(0, -1).toUpperCase();
  }

  convertRssiToPercent(
    rssi: number,
    measuredRssiAt1Meter = -69,
    environmentalScale = 2
  ): number {
    const minRSSI = -35;
    const maxRSSI = -100;
    if (rssi) {
      if (rssi > minRSSI) {
        rssi = minRSSI + 1;
      }
      if (rssi < maxRSSI) {
        rssi = maxRSSI;
      }

      rssi -= minRSSI;
      let percent = 1 - rssi / (maxRSSI - minRSSI);

      //window["LOG"] && console.log("percent",percent);

      return percent * 100;
    } else {
      return 0;
    }
  }

  convertRssiToDistance(
    rssi: number,
    measuredRssiAt1Meter = -69,
    environmentalScale = 2
  ): number {
    if (rssi) {
      let distance = Math.pow(
        10,
        (measuredRssiAt1Meter - rssi) / (10 * environmentalScale)
      );
      if (distance > 15) {
        distance = 15;
      } else if (distance < 0.1) {
        distance = 0.1;
      }
      return +distance.toFixed(1);
    } else {
      return 3;
    }
  }

  onClickItem(i: number) {
    this.toggleShowMap(true);
  }

  isShowMap = false;
  toggleShowMap(tf) {
    this.isShowMap = tf;
  }
}
