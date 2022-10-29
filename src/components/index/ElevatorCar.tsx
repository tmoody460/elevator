function ElevatorCar(props: {numberOfPassengers: number}) {
    const {numberOfPassengers} = props;

    return (
        <div className="elevator-car">
            {numberOfPassengers}
        </div>
    );
}

export default ElevatorCar;
