import { Robot } from "./robot-03.mjs";

// exercise 01
// const MOVEMENTS = ["n", "w", "s", "s"];
// exercise 02, 03
const MOVEMENTS = ["w", "s", "s", "e"];

const robot = new Robot();
//robot.move(MOVEMENTS);
robot.moveOptimized(MOVEMENTS);
robot.report();
