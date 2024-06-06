import { Component, OnInit } from '@angular/core';
import { ColorType, createChart } from 'lightweight-charts';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { EstadisticaService } from 'src/app/services/estadistica.service';

@Component({
  selector: 'app-grafico-prueba2',
  templateUrl: './grafico-prueba2.component.html',
  styleUrls: ['./grafico-prueba2.component.css']
})
export class GraficoPrueba2Component implements OnInit {

  private datos: { time: string; value: number; }[]= [];
  constructor( private estServ:EstadisticaService ) { }

  ngOnInit(): void {
    
    const chart = createChart(document.getElementById('container2')!, { 
      layout: { 
        textColor: 'black', 
        background: { 
          type: ColorType.Solid, 
          color: 'white' 
        } 
      } 
    });

    const baselineSeries = chart.addBaselineSeries({ 
      baseValue: { 
        type: 'price', 
        price: 8 
      }, 
      topLineColor: 'rgba( 38, 166, 154, 1)', 
      topFillColor1: 'rgba( 38, 166, 154, 0.28)', 
      topFillColor2: 'rgba( 38, 166, 154, 0.05)', 
      bottomLineColor: 'rgba( 239, 83, 80, 1)', 
      bottomFillColor1: 'rgba( 239, 83, 80, 0.05)', 
      bottomFillColor2: 'rgba( 239, 83, 80, 0.28)' 
    });

    /*baselineSeries.setData([
      { value: 1,  time: '2018-12-22' }, 
      { value: 8,  time: '2018-12-23' }, 
      { value: 10, time: '2018-12-24' }, 
      { value: 20, time: '2018-12-25' }, 
      { value: 3,  time: '2018-12-26' }, 
      { value: 43, time: '2018-12-27' }, 
      { value: 41, time: '2018-12-28' }, 
      { value: 43, time: '2018-12-29' }, 
      { value: 56, time: '2018-12-30' }, 
      { value: 46, time: '2018-12-31' }
    ]);*/

    this.estServ.getEmpleadosEst(localStorage.getItem("token")!).subscribe(res => {
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
      chart.timeScale().fitContent();
    })
  }
  
}
