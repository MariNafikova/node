import * as readline from 'node:readline';
import { createReadStream, createWriteStream } from 'fs'

const rs = createReadStream('./access_tmp.log')
const ws1 = createWriteStream('./89.123.1.41_requests.log', { flags: 'a'})
const ws2 = createWriteStream('./34.48.240.111_requests.log', { flags: 'a'})

const rl = readline.createInterface({
    input: rs
});
rl.on('line', function (line) {
    if (line.includes("89.123.1.41")) {
        ws1.write(line);
        ws1.write('\n');
    }
    if (line.includes("34.48.240.111")) {
        ws2.write(line);
        ws2.write('\n');
    }
});