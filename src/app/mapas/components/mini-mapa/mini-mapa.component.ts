import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mini-mapa',
  templateUrl: './mini-mapa.component.html',
  styles: [`
    .mapaMini{
      width:100%;
      height:180px;
      margin:0px;
    }
`]
})
export class MiniMapaComponent implements AfterViewInit {

  @Input() lngLat:[number,number]=[0,0];
  @ViewChild('mapa_mini') divMapa!:ElementRef;
  
  constructor() { }
  ngAfterViewInit(): void {
    (mapboxgl as any).accessToken = environment.mapboxToken;
    const mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.lngLat,
      zoom:15,
      interactive:false
    });

    new mapboxgl.Marker().setLngLat(this.lngLat).addTo(mapa);
  }

}
