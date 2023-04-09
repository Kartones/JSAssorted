/*
The movement of a robot is programmed by feeding a list of instructions of directions using compass directions (North, East, South and West). An instruction of "West" moves the robot 1 "step" left, and an instruction of "North" moves it 1 step up, etc. The list of instructions comes as a list of 1-character strings such that an instruction of "North" is encoded as "n", and "West" as "w" etc.

Write a script which takes an input as a list of 1-character strings (e.g. ["w", "n", "s"]) and prints the "coordinates" that the robot ends at, assuming it starts at (0, 0).

For example: an input of ["n", "w", "s", "s"] would print (-1, -1). Explanation below:

- 1 move north takes the robot to (0, 1)
- 1 move west takes the robot to (-1, 1)
- 1 move south takes the robot to (-1, 0)
- another move south takes the robot to (-1, -1)

The user gives the input by simply writing the list at the top of the script.
*/

export class Robot {
  static #POTENTIAL_MOVEMENTS = {
    n: [0, -1],
    s: [0, 1],
    w: [-1, 0],
    e: [1, 0],
  };

  #coordinate_x;
  #coordinate_y;
  #current_orientation;

  get position() {
    return [this.#coordinate_x, this.#coordinate_y];
  }

  get orientation() {
    return this.#current_orientation;
  }

  constructor(initialX = 0, initialY = 0) {
    this.#coordinate_x = initialX;
    this.#coordinate_y = initialY;
    this.#current_orientation = "n";
  }

  move(directions) {
    if (!this.#validateDirections(directions)) {
      throw new Error(`Invalid directions: ${directions}`);
    }

    directions.forEach((direction) => this.#move(direction));
  }

  #move(direction) {
    const [x, y] = Robot.#POTENTIAL_MOVEMENTS[direction];
    this.#coordinate_x += x;
    this.#coordinate_y += y;
    this.#current_orientation = direction;
  }

  #validateDirections(directions) {
    return directions.every((direction) =>
      Object.keys(Robot.#POTENTIAL_MOVEMENTS).includes(direction)
    );
  }
}
