import { generateTrainingJsonForGpt } from "./src/actions/Training/generateTrainingJsonForGpt.js";
import { gptApi } from "./src/gpt/api.js";
import { gptResponseFormat } from "./src/gpt/gptResponseFormat.js";
import { system_stat } from "./src/gpt/prompts/system_stat.js";
import fs from 'fs';

const workOuts = await generateTrainingJsonForGpt();
fs.writeFileSync('workOuts.txt', JSON.stringify(workOuts, null, 2));
const response = await gptApi(system_stat, workOuts);
fs.writeFileSync('response.txt', JSON.stringify(response, null, 2));
console.log(gptResponseFormat(JSON.parse(response.choices[0].message.content)));
// fs.writeFileSync('response.txt', JSON.stringify(response, null, 2));