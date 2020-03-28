export class JH {
    constructor(c: JH = null) {
      
      
        if (c == null) {
          return;
        }
        this.Province_State=c.Province_State??'';
        this.Confirmed=c.Confirmed;
        this.Active=c.Active??0;
        this.Country_Region=c.Country_Region??'';
        this.Last_Update=c.Last_Update;
        this.Deaths=c.Deaths??0;
        this.Recovered=c.Recovered??0;
        
      }
    public Province_State: string;
    public Country_Region: string;
    public Last_Update: string;
    public Confirmed: number;
    public Deaths: number;
    public Recovered: number;
    public Active: number;

    public initialize():void{
      this.Confirmed=0;
      this.Deaths=0;
      this.Recovered=0;
    }
}