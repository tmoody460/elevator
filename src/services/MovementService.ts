import { ActionType, ElevatorAction } from "../models/ElevatorAction";
import ElevatorConfiguration from "../models/ElevatorConfiguration";
import ElevatorStatus from "../models/ElevatorStatus";

const STARTING_FLOOR = 1;

enum ElevatorDirection {
    HeadingUp,
    HeadingDown,
    StayingPut
}

class MovementService {
    private readonly config: ElevatorConfiguration;

    public constructor(config: ElevatorConfiguration) {
        this.config = config;
    }

    public calculateElevatorPath = (actions: ElevatorAction[]): ElevatorStatus[] => {
        let route: ElevatorStatus[] = [new ElevatorStatus(0, STARTING_FLOOR, 0)];

        let remainingActions = [...actions];
        let queuedActions: ElevatorAction[] = [];
        let completedActions: ElevatorAction[] = [];

        let direction = ElevatorDirection.StayingPut;

        while (remainingActions.length > 0 || queuedActions.length > 0) {
            let stopOnFloor = false;
            let passengerChange = 0;
            let currentStatus = route.at(-1) as ElevatorStatus;

            queuedActions.push(...remainingActions.filter((action) => (action.time == currentStatus.time)));
            remainingActions = remainingActions.filter((action) => (action.time != currentStatus.time));

            if (!this.anyRemainingActionsInDirection(queuedActions, direction, currentStatus)) {
                direction = ElevatorDirection.StayingPut;
            }

            queuedActions.forEach((action) => {
                if (this.willPassengerGetOnOrOff(currentStatus, direction, action)) {
                    stopOnFloor = true;
                    passengerChange += this.getPassengerChange(action);
                    completedActions.push(action);

                } else if (direction == ElevatorDirection.StayingPut) {
                    direction = this.getNewElevatorDirection(action, currentStatus);
                }
            });

            queuedActions = queuedActions.filter((action) => !completedActions.includes(action));

            route.push(this.getNewStatus(stopOnFloor, direction, currentStatus, passengerChange));
        }

        return route;
    }

    private anyRemainingActionsInDirection = (
        queuedActions: ElevatorAction[],
        direction: ElevatorDirection,
        currentStatus: ElevatorStatus
    ) => {
        const {location} = currentStatus;
        const futureActions = queuedActions.filter((action) => action.location != location);

        if (direction == ElevatorDirection.HeadingDown) {
            return futureActions.some((action) => action.location < location);
        }

        return futureActions.some((action) => action.location > location);
    }

    private willPassengerGetOnOrOff = (
        currentStatus: ElevatorStatus,
        currentDirection: ElevatorDirection,
        action: ElevatorAction
    ): boolean => {
        if (action.location != currentStatus.location) { return false; }

        if (action.actionType == ActionType.FloorPress) { return true; }
        if (currentDirection == ElevatorDirection.StayingPut) { return true; }

        const requiredDirection = action.actionType == ActionType.DownPress ?
            ElevatorDirection.HeadingDown :
            ElevatorDirection.HeadingUp;

        return requiredDirection == currentDirection;
    }

    private getPassengerChange = (action: ElevatorAction): number => {
        return action.actionType == ActionType.FloorPress ? -1 : 1;
    }

    private getNewElevatorDirection = (
        action: ElevatorAction, 
        currentStatus: ElevatorStatus,
    ): ElevatorDirection => {
        return action.location < currentStatus.location ?
            ElevatorDirection.HeadingDown :
            ElevatorDirection.HeadingUp;
    }

    private getNewStatus = (
        stopOnFloor: boolean,
        direction: ElevatorDirection,
        currentStatus: ElevatorStatus,
        passengerChange: number,
    ): ElevatorStatus => {
        if (!stopOnFloor && direction != ElevatorDirection.StayingPut) {
            return this.move(currentStatus, direction);
        } else if (!stopOnFloor) {
            return this.idle(currentStatus);
        } else {
            return this.changePassengers(currentStatus, passengerChange);
        }
    }

    private move = (
        currentStatus: ElevatorStatus,
        direction: ElevatorDirection
    ): ElevatorStatus => {
        if (direction == ElevatorDirection.HeadingDown) {
            return this.moveDown(currentStatus);
        }

        return this.moveUp(currentStatus);
    }

    private moveDown = (currentStatus: ElevatorStatus): ElevatorStatus => {
        const {time, location, numberOfPassengers} = currentStatus;
        return new ElevatorStatus(time + 1, location - 1, numberOfPassengers);
    }

    private moveUp = (currentStatus: ElevatorStatus): ElevatorStatus => {
        const {time, location, numberOfPassengers} = currentStatus;
        return new ElevatorStatus(time + 1, location + 1, numberOfPassengers);
    }

    private idle = (currentStatus: ElevatorStatus): ElevatorStatus => {
        const {time, location, numberOfPassengers} = currentStatus;
        return new ElevatorStatus(time + 1, location, numberOfPassengers);
    }

    private changePassengers = (
        currentStatus: ElevatorStatus, 
        passengerChange: number
    ): ElevatorStatus => {
        const {time, location, numberOfPassengers} = currentStatus;
        return new ElevatorStatus(time + 1, location, numberOfPassengers + passengerChange);
    }
}

export default MovementService;