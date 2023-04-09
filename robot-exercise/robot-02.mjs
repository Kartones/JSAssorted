/*
The robot uses fuel each time it moves 1 "space" and when it turns.
The robot uses 2 unit of fuel each move in a straight line, and an additional 1 unit of fuel if it has needed to turn before making this move.
- It takes 1 unit of fuel to turn whether it is 90 degrees or 180 degrees.
- You can assume the robot does not need to turn at before the first move and after the last move.

For example: the instructions ["w", "s", "s", "e"] would use 10 units of fuel.

Travelling west uses 2 units, turning towards south uses 1 unit, moving south twice uses 4 units, turning towards east uses 1 unit, and moving east uses 2 units.

After the final coordinates have been printed, the user would like the units of fuel that the robot has consumed.
*/

export class Robot {
  static #POTENTIAL_MOVEMENTS = {
    n: [0, -1],
    s: [0, 1],
    w: [-1, 0],
    e: [1, 0],
  };
  // Because first movement does not incur in turn fuel consumption
  static #INITIAL_FUEL = -1;

  #coordinateX;
  #coordinateY;
  #currentOrientation;
  #fuelConsumption;

  get position() {
    return [this.#coordinateX, this.#coordinateY];
  }

  get orientation() {
    return this.#currentOrientation;
  }

  get fuelConsumption() {
    return Math.max(this.#fuelConsumption, 0);
  }

  constructor(initialX = 0, initialY = 0) {
    this.#coordinateX = initialX;
    this.#coordinateY = initialY;
    this.#currentOrientation = "";
    this.#fuelConsumption = Robot.#INITIAL_FUEL;
  }

  report() {
    console.log("position:", this.position);
    console.log("orientation:", this.orientation);
    console.log("fuel consumed:", this.fuelConsumption);
  }

  move(directions) {
    if (!this.#validateDirections(directions)) {
      throw new Error(`Invalid directions: ${directions}`);
    }

    directions.forEach((direction) => {
      this.#consume_fuel(direction);
      this.#move(direction);
    });
  }

  #move(direction) {
    const [x, y] = Robot.#POTENTIAL_MOVEMENTS[direction];
    this.#coordinateX += x;
    this.#coordinateY += y;
    this.#currentOrientation = direction;
  }

  #consume_fuel(direction) {
    this.#fuelConsumption += 2;
    if (this.#currentOrientation != direction) {
      this.#fuelConsumption += 1;
    }
  }

  #validateDirections(directions) {
    return directions.every((direction) =>
      Object.keys(Robot.#POTENTIAL_MOVEMENTS).includes(direction)
    );
  }
}
