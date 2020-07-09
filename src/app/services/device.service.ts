import { Injectable, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { BLE } from "@ionic-native/ble/ngx";

@Injectable({
  providedIn: "root",
})
export class DeviceService {
  devices: any[] = [];
  arrShow: any[] = [];
  bleScanSubscription: Subscription;

  constructor(private ble: BLE, private ngZone: NgZone) {}

  scan() {
    this.devices = [];
    this.bleScanSubscription = this.ble
      .startScan([])
      .subscribe((device) => this.onDeviceDiscovered(device));
  }

  onDeviceDiscovered(device) {
    console.log("Discovered" + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      console.log(device);
      this.devices.push(device);
      
      let distance = this.convertRssiToDistance(device.rssi);
      let name = device.name || "N/A";
      let id = device.id;
      let rssi = device.rssi;
      let distLevel = 0;
      if (distance < 1) distLevel = 0;
      else if (distance < 15.24) distLevel = 1;
      else distLevel = 2;
      this.arrShow.push({id, name, rssi, distLevel, distance});
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
}
