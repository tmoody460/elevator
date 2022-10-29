export default class ElevatorStatus {
    public time: number;
    public location: number;
    public numberOfPassengers: number;

    public constructor(time: number, location: number, numberOfPassengers:number) {
        this.time = time;
        this.location = location;
        this.numberOfPassengers = numberOfPassengers;
    }
}
