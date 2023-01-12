
import { run } from "./src/Run";
import {fs} from "fs";

try {
    const input = fs.readFileSync('./input.py', {encoding: 'utf-8', flag: 'r'});
    console.log(input);
    let asmCode, errors = run(input);
    if (errors){
        console.log(`Errors: ${errors}`);
    } else {
        console.log(`.asm`);
        console.log(asmCode);
        console.log(`Process finished successfully`);
        fs.writeFileSync('./output.asm', asmCode);
    }
} catch (err){
    console.log(err);
}