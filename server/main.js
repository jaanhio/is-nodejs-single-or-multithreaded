const express = require('express');
const { hrtime } = require('node:process');
const { randomFill, randomFillSync} = require('node:crypto');
const { Buffer } = require('node:buffer');
const port = 8080;
const defaultBufferSize = 2**10;

const withTimer = (func) => {
    return async (bufferSize) => {
        const start = hrtime.bigint();

        const size = Number.isInteger(bufferSize) ? bufferSize : defaultBufferSize;
        console.log('buffer size', size);
        await func(size);
        const end = hrtime.bigint();
        const timeTaken = Number((end - start).toString()) / 1000000;
        console.log(`${func.name} took ${timeTaken}ms`);
    }
}

const cryptoFillAsync = (bufferSize) => {
    console.log('executing crypto fill async');
    
    const buf = Buffer.alloc(bufferSize);
    
    return new Promise((resolve, reject) => {
        randomFill(buf, (err, buf) => {
            if (err) {
                console.log('err filling async', err);
                reject(err);
            }
            console.log('Buffer filled');
            resolve();
        })
    })
}

const cryptoFillSync = (bufferSize) => {
    console.log('executing crypto fill sync');
    const buf = Buffer.alloc(bufferSize);
    randomFillSync(buf)
    console.log('Buffer filled');
    return;
}

const getCryptoFunc = (type) => {
    if (type === 'async') {
        return withTimer(cryptoFillAsync);
    } else {
        return withTimer(cryptoFillSync);
    }
}

let reqCount = 0;
const app = express();

app.get('/', async (req, res) => {
    reqCount++;
    console.log(`Received req ${reqCount}`);
    const { type, size } = req.query;
    const cryptoFunc = getCryptoFunc(type);
    await cryptoFunc(Number(size));
    res.status(200);
    res.end('Hello World');
});

app.listen(port, () => {
    console.log(`PID: ${process.pid} listening on ${port}`);
});