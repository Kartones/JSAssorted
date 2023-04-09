import { Robot } from "./robot-03.mjs";

const INITIAL_X = 500;
const INITIAL_Y = 500;
const SIZE = 96;
const OFFSET_MOVEMENT = 28;

const initRobot = (robot) => {
  const [x, y] = robot.position;

  const DOMRobot = document.createElement("img");
  DOMRobot.id = "web-robot";
  DOMRobot.classList.add("robot");
  DOMRobot.src = `img/robot_e.png`;
  DOMRobot.width = SIZE;
  DOMRobot.style.top = `${INITIAL_Y + y * OFFSET_MOVEMENT}px`;
  DOMRobot.style.left = `${INITIAL_X + x * OFFSET_MOVEMENT}px`;
  document.getElementById("container").appendChild(DOMRobot);
};

const moveRobot = (robot) => {
  const [x, y] = robot.position;

  const DOMRobot = document.getElementById("web-robot");
  DOMRobot.src = `img/robot_${robot.orientation}.png`;
  DOMRobot.style.top = `${INITIAL_Y + y * OFFSET_MOVEMENT}px`;
  DOMRobot.style.left = `${INITIAL_X + x * OFFSET_MOVEMENT}px`;

  const DOMFuel = document.getElementById("fuel-amount");
  DOMFuel.innerText = robot.fuelConsumption;
};

const advanceRobot = (directions) => {
  setTimeout(() => {
    webRobot.move([directions.shift()]);
    webRobot.report();
    moveRobot(webRobot);

    if (directions.length > 0) {
      advanceRobot(directions);
    }
  }, 1000);
};

// -----------------
// Common
// -----------------
const webRobot = new Robot();
initRobot(webRobot);

const MODE = "exercise";
// const MODE = "free-roaming";

// Exercise movement
// -----------------
if (MODE == "exercise") {
  // exercise 01
  // const MOVEMENTS = ["n", "w", "s", "s"];
  // exercise 02, 03
  const MOVEMENTS = ["w", "s", "s", "e"];
  advanceRobot(MOVEMENTS);
}

// Keyboard-based free roaming
// ---------------------------
if (MODE == "free-roaming") {
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.defaultPrevented) {
        return;
      }
      event.preventDefault();

      let direction = "";

      switch (event.key) {
        case "ArrowDown":
          direction = "s";
          break;
        case "ArrowUp":
          direction = "n";
          break;
        case "ArrowLeft":
          direction = "w";
          break;
        case "ArrowRight":
          direction = "e";
          break;
        default:
          return;
      }

      webRobot.move([direction]);
      moveRobot(webRobot);
    },
    true
  );
}
