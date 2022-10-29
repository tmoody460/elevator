import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ActionType, ElevatorAction } from '../../models/ElevatorAction';
import ElevatorConfiguration from '../../models/ElevatorConfiguration';
import ElevatorStatus from '../../models/ElevatorStatus';
import ActionForm from './ActionForm';
import { Elevator } from './Elevator';
import MovementService from '../../services/MovementService';

interface AppState {
    route: ElevatorStatus[];
    actions: ElevatorAction[];
}

function App() {
    const config = new ElevatorConfiguration();
    const service = new MovementService(config);

    const [state, setState] = useState<AppState>({ route: [], actions: []});

    const addAction = (action: ElevatorAction) => {
        
        setState(({actions}) => {
            let updatedActions = [...actions, action].sort((a, b) => (a.time > b.time) ? 1 : -1);
            let updatedRoute = service.calculateElevatorPath(updatedActions);

            return { actions: updatedActions, route: updatedRoute };
        });
    }

    const displayText = (action: ElevatorAction) => {
        switch (+action.actionType) {
            case ActionType.FloorPress:
                return `At T${action.time}, floor ${action.location} was pressed from inside the elevator.`
            case ActionType.UpPress:
                return `At T${action.time}, up was pressed from outside floor ${action.location}.`
            case ActionType.DownPress:
                return `At T${action.time}, down was pressed from outside floor ${action.location}.`
            default:
                return "Invalid Action Type.";
        }
    }

    const [time, setTime] = useState<number>(0);
    const endTime = state.route.at(-1)?.time || 0;

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((time) => time < endTime ? time + 1 : 0);
        }, 500);
        return () => clearInterval(interval);
    }, [state]);

    return (
        <Container>
            <h1 className='mb-5'>Hello Ellevator!</h1>
            
            <Row>
                <Col>
                    <h3>Current Time: T{time}</h3>
                    <Elevator 
                        configuration={config} 
                        status={state.route.find((route) => route.time == time)}
                    />

                    <h3>Actions Entered</h3>
                    <ul children={
                        state.actions.map((action, i) => {
                            return <li key={i}>{displayText(action)}</li>;
                        })
                    } />

                    <h3>Route Determined</h3>
                    <ul children={
                        state.route.map((status, i) => {
                            return <li key={i}>
                                At floor {status.location} at T{status.time} with {status.numberOfPassengers} people
                            </li>;
                        })
                    } />

                </Col>
                <Col>
                    <ActionForm onSubmit={addAction}></ActionForm>
                </Col>
            </Row>
        </Container>
    );
}

export default App;
