import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  AfterViewInit,
} from "@angular/core";
import { DeviceService } from 'src/app/services/device.service';

@Component({
  selector: "app-radarview",
  templateUrl: "./radarview.component.html",
  styleUrls: ["./radarview.component.scss"],
})
export class RadarviewComponent implements OnInit {
  @Output() closeRadarview: EventEmitter<any> = new EventEmitter();
  constructor(public deviceService: DeviceService) {}

  W = 0;
  H = 0;
  cx = 0;
  cy = 0;
  r0 = 0;
  r1 = 0;
  r2 = 0;

  ngOnInit() {
    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.cx = this.W * 0.5;
    this.cy = this.H * 1.3;
    this.r0 = this.H * 0.6;
    this.r1 = this.H * 0.9;
    this.r2 = this.H * 1.2;
  }

  onClickClose() {
    this.closeRadarview.emit();
  }

  rDot = 30;
  xOfDot(dot: any) {
    let cx = 0;
    cx = (this.W - 2*this.rDot) * Math.random();
    return cx;
  }

  yOfDot(dot: any) {
    let cy: number;
    if (dot.distLevel === 0) cy = this.H * (0.2 * Math.random() + 0.8) - 2*this.rDot;
    if (dot.distLevel === 1) cy = this.H * (0.2 * Math.random() + 0.5) - 2*this.rDot;
    if (dot.distLevel === 2) cy = this.H * (0.2 * Math.random() + 0.2) - 2*this.rDot;
    return cy;
  }

  transformOfDot(dot: any) {
    console.log('dot=', dot);
    let str = `translate(${this.xOfDot(dot)}, ${this.yOfDot(dot)})`;
    console.log(str);
    return str;
  }

  colors = ["red", "green", "black", "blue", "chocolate", "blueviolet", "darkblue", "darkslategray", "darkslateblue", "dimgrey"];

}
