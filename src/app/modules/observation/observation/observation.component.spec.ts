import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationComponent } from './observation.component';
import { ObservationService } from '../observation.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { StudyComponent } from '../study/study.component';
import { FoliageChartComponent } from '../foliage-chart/foliage-chart.component';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule, ChartModule, DialogModule, InputTextModule, PanelModule, SharedModule, SidebarModule, TreeModule } from 'primeng/primeng';

describe('ObservationComponent', () => {
  let component: ObservationComponent;
  let fixture: ComponentFixture<ObservationComponent>;
  let compiled: HTMLElement;
  let observationService: ObservationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,
        BrowserModule,
        // PrimeNG Modules
        ButtonModule,
        ChartModule,
        DialogModule,
        InputTextModule,
        PanelModule,
        SharedModule,
        SidebarModule,
        TreeModule],
      declarations: [ObservationComponent, StudyComponent, FoliageChartComponent],
      providers: [ObservationService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    observationService = TestBed.get(ObservationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render', () => {
    expect(compiled.querySelector('#file-input-btn').textContent).toContain('+');
  });

  it('should upload a list of image files', () => {
    const blob = new Blob([''], { type: 'text/html' });
    blob['name'] = 'filename';
    const file = blob as File;
    const fileList: FileList = {
      0: file,
      1: file,
      length: 2,
      item: (index: number) => file
    };

    spyOn(observationService, 'uploadObservationImage').and.returnValue(of(true));
    component.uploadFiles(fileList);

    expect(observationService.uploadObservationImage).toHaveBeenCalledTimes(2);
  });

  it('should trigger choose file dialog when button is clicked', () => {
    const fileInputElement: HTMLInputElement = compiled.querySelector('input[type=file]');
    spyOn(fileInputElement, 'click');
    compiled.querySelector<HTMLButtonElement>('#file-input-btn').click();
    expect(fileInputElement.click).toHaveBeenCalled();
  });
});
