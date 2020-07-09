import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RadarviewComponent } from './radarview.component';

describe('RadarviewComponent', () => {
  let component: RadarviewComponent;
  let fixture: ComponentFixture<RadarviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadarviewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RadarviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
