import { generateTrainingJsonForGpt } from "./src/actions/Training/generateTrainingJsonForGpt.js";

const workOuts = await generateTrainingJsonForGpt();
console.log(workOuts);