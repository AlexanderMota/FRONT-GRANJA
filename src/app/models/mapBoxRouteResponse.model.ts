
export class MapBoxRouteResponseModel{

  waypoints:MapBoxWayPoint[]=[];

  routes: MapBoxRoute[]=[];

  code:string="";

  uuid:string="";
};

export class MapBoxWayPoint{
  location:[]=[];
  name="";
}

export class MapBoxRoute{
  legs: {
    steps: [],
    weight: number,
    distance: number,
    summary: string,
    duration: number,
  }[] = [];
  weight_name: string="";
  geometry: {
    type: "",
    coordinates: [],
  } = {
    type:"",
    coordinates:[]
  };
  weight: number=0;
  distance: number=0;
  duration: number=0;
}