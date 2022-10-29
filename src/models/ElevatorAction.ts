export enum ActionType {
    UpPress = 0,
    DownPress = 1,
    FloorPress = 2
}

export class ElevatorAction {
    public time: number;
    public actionType: ActionType;
    public location: number;

    public constructor(time: number, actionType: ActionType, location: number) {
        this.time = time;
        this.actionType = actionType;
        this.location = location;
    }
}
