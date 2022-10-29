export default class ElevatorConfiguration {
    public readonly numberOfFloors: number;

    public constructor(numberOfFloors: number = 10) {
        this.numberOfFloors = numberOfFloors;
    }
}
