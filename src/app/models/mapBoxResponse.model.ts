
export class MapBoxResponseModel{
  type: string ="";

  query: string[]=[];

  features: MapBoxFeature[]=[];

  geometry: {
    type: "",
    coordinates: number[],
  } = {
    type:"",
    coordinates:[]
  };

  properties: {
    mapbox_id: string,
    wikidata: string,
  } = {
    mapbox_id:"",
    wikidata:""
  };

  place_type: string[]=[];

  attribution:string="";
};

export class MapBoxFeature{
    id: string="";
    place_name: string="";
    type: string="";
    text: string="";
    relevance: number=0;
    bbox: number[] = [];
    center: number[]= [];
    context: {
      id: string,
      mapbox_id: string,
      wikidata: string,
      short_code: string,
      text: string,
    }[] = [];
}