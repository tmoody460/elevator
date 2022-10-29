import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

function ElevatorLevel(props: React.PropsWithChildren) {

    return (
        <ListGroup.Item className="elevator-level ">
            {props.children}
        </ListGroup.Item>
    );
}

export default ElevatorLevel;
