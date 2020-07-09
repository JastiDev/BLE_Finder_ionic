import { Component, OnInit } from "@angular/core";
import { GeolocService } from "../services/geoloc.service";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { LocationAccuracy } from "@ionic-native/location-accuracy/ngx";
import { Platform } from "@ionic/angular";
import { DeviceService } from '../services/device.service';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  constructor(
    public geolocService: GeolocService,
    public deviceService: DeviceService,
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

    this.deviceService.scan();
  }

  ionViewWillLeave() {
    console.log("ionViewWillLeave disconnecting Bluetooth");
    this.deviceService.bleScanSubscription.unsubscribe();
  }

  scan() {
    
  }


  onClickItem(i: number) {
    this.toggleShowMap(true);
  }

  isShowMap = false;
  toggleShowMap(tf) {
    this.isShowMap = tf;
  }

  onClickDraw() {
    this.toggleShowRadar(true);
  }
  isShowRadar = false;
  toggleShowRadar(tf) {
    this.isShowRadar = tf;
  }
  onClickRadar() {
    this.toggleShowRadar(true);
  }
}
