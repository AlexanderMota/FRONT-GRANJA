import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .mapa-container {
      width:100%;
      height:100%;
    }
    .row{
      background-color: white;
      left: 50px;
      padding: 10px;
      border-radius: 5px;
      width:400px;

      position: fixed;
      bottom: 50px;
      z-index: 99999;
    }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa_zoom') divMapa!: ElementRef;
  mapa!:mapboxgl.Map;
  zoomLevel : number = 5;
  center:[number,number] = [-4, 40];

  constructor() { }

  ngAfterViewInit(): void {

    (mapboxgl as any).accessToken = environment.mapboxToken;

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom:this.zoomLevel
    });

    this.mapa.on('zoom', ()=>{
      this.zoomLevel = this.mapa.getZoom();
    });

    this.mapa.on('move', (event)=>{
      const {lng,lat} = event.target.getCenter();
      this.center = [lng,lat];
    });
    
    this.mapa.on('zoomend', (event)=>{
      if(this.mapa.getZoom() > 18){
        this.mapa.zoomTo(18);
      }
    });
  }

  zoomOut(){
    this.mapa.zoomOut();
  }

  zoomIn(){
    this.mapa.zoomIn();
  }

  zoomCambio(valor:String){
    this.mapa.zoomTo( Number(valor) );
  }

  ngOnDestroy(): void {
    this.mapa.off('zoom', ()=>{});
    this.mapa.off('zoomend', ()=>{});
    this.mapa.off('move', ()=>{});
  }
}
