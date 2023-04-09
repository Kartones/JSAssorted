/*
The user would like to know how much fuel the robot would use if it moved in the most efficient path (there can be at most 2, which use the same amount of fuel).

Print the amount of fuel that would be used if this path was taken.

BONUS: print the instructions for the optimal path.
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

  moveOptimized(directions) {
    const originalEndState = this.#simulate(directions);
    console.log("Original directions:", directions);
    console.log("Original directions simulation:", originalEndState);

    const optimizedDirections = [];

    const xStep = originalEndState.x > 0 ? 1 : -1;
    for (
      let currentX = this.#coordinateX;
      currentX < originalEndState.x;
      currentX += xStep
    ) {
      optimizedDirections.push(xStep > 0 ? "e" : "w");
    }

    const yStep = originalEndState.y > 0 ? 1 : -1;
    for (
      let currentY = this.#coordinateY;
      currentY < originalEndState.y;
      currentY += yStep
    ) {
      optimizedDirections.push(yStep > 0 ? "s" : "n");
    }

    console.log("Optimized directions:", optimizedDirections);
    this.move(optimizedDirections);
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

  #simulate(directions) {
    if (!this.#validateDirections(directions)) {
      throw new Error(`Invalid directions: ${directions}`);
    }

    const initialState = {
      x: this.#coordinateX,
      y: this.#coordinateY,
      orientation: this.#currentOrientation,
      fuel: this.#fuelConsumption,
    };

    directions.forEach((direction) => {
      this.#consume_fuel(direction);
      this.#move(direction);
    });

    const endState = {
      x: this.#coordinateX,
      y: this.#coordinateY,
      fuel: this.#fuelConsumption,
    };

    this.#coordinateX = initialState.x;
    this.#coordinateY = initialState.y;
    this.#currentOrientation = initialState.orientation;
    this.#fuelConsumption = initialState.fuel;

    return endState;
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
