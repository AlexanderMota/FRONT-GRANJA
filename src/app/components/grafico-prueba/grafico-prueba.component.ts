import { Component, Input, OnInit } from '@angular/core';
import { ColorType, createChart } from 'lightweight-charts';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { EstadisticaService } from 'src/app/services/estadistica.service';

@Component({
  selector: 'app-grafico-prueba',
  templateUrl: './grafico-prueba.component.html',
  styleUrls: ['./grafico-prueba.component.css']
})
export class GraficoPruebaComponent implements OnInit {

  private datos: { time: string; value: number; }[]= [];

  constructor(private estServ:EstadisticaService) { 
  }

  ngOnInit(): void {
    const chart = createChart(document.getElementById('container')!, { 
      layout: { 
        textColor: 'black', 
        background: { 
          type: ColorType.Solid, 
          color: 'white' 
        } 
      } 
    });
    const baselineSeries = chart.addAreaSeries({ 
      lineColor: '#2962FF', 
      topColor: '#2962FF', 
      bottomColor: 'rgba(41, 98, 255, 0.28)' 
    });

    //const data = [{ value: 0, time: 1642425322 }, { value: 8, time: 1642511722 }, { value: 10, time: 1642598122 }, { value: 20, time: 1642684522 }, { value: 3, time: 1642770922 }, { value: 43, time: 1642857322 }, { value: 41, time: 1642943722 }, { value: 43, time: 1643030122 }, { value: 56, time: 1643116522 }, { value: 46, time: 1643202922 }];

    //areaSeries.setData(data);

    chart.timeScale().fitContent();

    this.estServ.getComentariosEst(localStorage.getItem("token")!).subscribe(res => {
      console.log(res);
      
      if((res as ApiResponse).status){
        console.log((res as ApiResponse).message);
      }else{
        this.datos = res as { time: string, value: number }[];

        console.log("this.datos");
        console.log(this.datos);
        baselineSeries.setData(this.datos/*[
          { time: '2018-12-22', value: 32.51 },
          { time: '2018-12-23', value: 31.11 },
          { time: '2018-12-24', value: 27.02 },
          { time: '2018-12-25', value: 27.32 },
          { time: '2018-12-26', value: 25.17 },
          { time: '2018-12-27', value: 28.89 },
          { time: '2018-12-28', value: 25.46 },
          { time: '2018-12-29', value: 23.92 },
          { time: '2018-12-30', value: 22.68 },
          { time: '2018-12-31', value: 22.67 },
        ]*/);
      }
    });


    //const chart = createChart(document.getElementById('container')!);
    /*const areaSeries = chart.addAreaSeries({
      lineColor: '#2962FF', 
      topColor: '#2962FF',
      bottomColor: 'rgba(41, 98, 255, 0.28)',
    });*/
    /*const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
      wickUpColor: '#26a69a', wickDownColor: '#ef5350',
    });
    
    candlestickSeries.setData([
      { time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
      { time: '2018-12-23', open: 45.12, high: 53.90, low: 45.12, close: 48.09 },
      { time: '2018-12-24', open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
      { time: '2018-12-25', open: 68.26, high: 68.26, low: 59.04, close: 60.50 },
      { time: '2018-12-26', open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
      { time: '2018-12-27', open: 91.04, high: 121.40, low: 82.70, close: 111.40 },
      { time: '2018-12-28', open: 111.51, high: 142.83, low: 103.34, close: 131.25 },
      { time: '2018-12-29', open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
      { time: '2018-12-30', open: 106.33, high: 110.20, low: 90.39, close: 98.10 },
      { time: '2018-12-31', open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
    ]);
    
    chart.timeScale().fitContent();
    const barSeries = chart.addBarSeries();
    const baselineSeries = chart.addBaselineSeries();*/
  }

}
