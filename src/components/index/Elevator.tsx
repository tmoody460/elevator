import ElevatorConfiguration from '../../models/ElevatorConfiguration';
import ElevatorStatus from '../../models/ElevatorStatus';
import ElevatorCar from './ElevatorCar';
import ElevatorLevel from './ElevatorLevel';
import ListGroup from 'react-bootstrap/ListGroup';

export interface ElevatorProps {
    configuration: ElevatorConfiguration;
    status?: ElevatorStatus;
}

export function Elevator(props: ElevatorProps) {
    const {configuration, status} = props;

    const floors = Array.from(Array(configuration.numberOfFloors).keys())
                        .map((index) => index + 1)
                        .reverse();

    return (
        <ListGroup className='elevator mb-3'>
            {
                floors.map((floor) => (
                    <ElevatorLevel key={floor}>
                        {
                            status && status.location === floor &&
                            <ElevatorCar numberOfPassengers={status.numberOfPassengers} />
                        }
                    </ElevatorLevel>
                ))
            }
        </ListGroup>
    );
}
