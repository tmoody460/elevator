import { ChangeEvent, useState } from 'react';
import { ActionType, ElevatorAction } from '../../models/ElevatorAction';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';

declare type FormControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const MAX_TIME = 50;
const TOP_FLOOR = 10;

interface ActionFormState {
    time: number,
    action?: ActionType,
    location: number,
}

function ActionForm(props: {onSubmit: (action: ElevatorAction) => void}) {
    const [state, setState] = useState<ActionFormState>({ 
        time: 0,
        action: undefined,
        location: 1
    });

    const updateFormValue = (event: ChangeEvent<FormControlElement>) => {
        const {name, value} = event.target;

        setState({
            ...state,
            [name]: value
        });
    };

    const handleSubmit = () => {
        if (state.action) {
            props.onSubmit(new ElevatorAction(state.time, state.action, state.location));
        }
    };

    const disabled: boolean = state.action == undefined || 
                                state.time > MAX_TIME ||
                                state.time < 0 ||
                                state.location < 1 ||
                                state.location > TOP_FLOOR;

    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Time</Form.Label>
                <Form.Control type="number" min={0} max={MAX_TIME} name="time" value={state.time} onChange={updateFormValue} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Action</Form.Label>
                <Form.Select name="action" value={state.action || ""} onChange={updateFormValue}>
                    {
                        [
                            { value: "", text: "Select an Action"},
                            { value: ActionType.UpPress, text: "Outside Elevator - Going Up" },
                            { value: ActionType.DownPress, text: "Outside Elevator - Going Down" },
                            { value: ActionType.FloorPress, text: "Inside Elevator - Floor Selection" },
                        ].map(({value, text}) => (
                            <option value={value} key={value}>{text}</option>
                        ))
                    }
                </Form.Select>
            </Form.Group>
            {
                state.action &&
                <Form.Group className="mb-3">
                    {
                        state.action == ActionType.FloorPress ?
                            <Form.Label>What floor are you going to?</Form.Label> :
                            <Form.Label>What floor are you on?</Form.Label>
                    }
                    <Form.Control type="number" min={1} max={TOP_FLOOR} name="location" value={state.location} onChange={updateFormValue} />
                </Form.Group>
            }
            <Button onClick={handleSubmit} disabled={disabled}>Add Action</Button>
        </Form>
    );
}

export default ActionForm;
