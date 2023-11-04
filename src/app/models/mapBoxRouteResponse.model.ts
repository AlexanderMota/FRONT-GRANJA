
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
  legs: MapBoxLeg[] = [];
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
  getRoundDistance():number{
    return Math.ceil(this.distance);
  }
}

export class MapBoxLeg{
  steps: MapBoxStep[]=[];
  weight: number=0;
  distance: number=0;
  summary: string="";
  duration: number=0;

  getRoundDistance():number{
    return Math.ceil(this.distance);
  }
}
export class MapBoxStep{
  distance: number=0;
  duration: number=0;
  driving_side:string="";
  geometry: {
    type: "",
    coordinates: [],
  } = {
    type:"",
    coordinates:[]
  };
  
  intersections: []=[]
  mode:string="";
  name:string="";
  weight: number=0;
  maneuver: MapBoxManiobra = new MapBoxManiobra;

  getRoundDistance():number{
    console.log(Math.ceil(this.distance));
    return Math.ceil(this.distance);
  }
}

export class MapBoxManiobra{
  bearing_after: number=0;
  bearing_before: number=0;
  instruction:string="";
  
  location: []=[]

  type : string="";
}