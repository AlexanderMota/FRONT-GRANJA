import { Component } from '@angular/core';
import { ColorType, createChart } from 'lightweight-charts';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { EstadisticaService } from 'src/app/services/estadistica.service';

@Component({
  selector: 'app-grafico-prueba3',
  templateUrl: './grafico-prueba3.component.html',
  styleUrls: ['./grafico-prueba3.component.css']
})
export class GraficoPrueba3Component {


  private datos: { time: string; value: number; }[]= [];

  constructor(private estServ:EstadisticaService) { 
  }

  ngOnInit(): void {
    const chart = createChart(document.getElementById('container3')!, { 
      layout: { 
        textColor: 'black', 
        background: { 
          type: ColorType.Solid, 
          color: 'white' 
        } 
      } 
    });
    const baselineSeries = chart.addAreaSeries({ 
      lineColor: '#ffc107', 
      topColor: '#ffc107', 
      bottomColor: 'rgba(240, 220, 35, 0.28)' 
    });

    //const data = [{ value: 0, time: 1642425322 }, { value: 8, time: 1642511722 }, { value: 10, time: 1642598122 }, { value: 20, time: 1642684522 }, { value: 3, time: 1642770922 }, { value: 43, time: 1642857322 }, { value: 41, time: 1642943722 }, { value: 43, time: 1643030122 }, { value: 56, time: 1643116522 }, { value: 46, time: 1643202922 }];

    //areaSeries.setData(data);

    chart.timeScale().fitContent();

    this.estServ.getTareasEst(localStorage.getItem("token")!).subscribe(res => {
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
  }
}
