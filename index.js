import express from "express"
import fs from "fs"
import path from 'path';
import { fileURLToPath } from 'url';
import streamBuffers from "stream-buffers";

const app = express()
const PORT = 5000
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

app.get('/',(req,res)=>{
res.sendFile(__dirname +'/index.html')
})


app.get('/video',(req,res)=>{
const range = req.headers.range
if (!range) {
   return res.status(403).send("Requires Range header")
}
// const myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
//     frequency:10,
//     chunkSize:2048
// })
const videoPath = "YOUR_FILENAME";
const videoSize = fs.statSync(videoPath).size;
console.log("videoSize ",videoSize)
const CHUNK_SIZE = 10 ** 6;
const start = Number(range.replace(/\D/g, ""));
const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
const contentLength = end - start + 1;
const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
};
res.writeHead(206, headers);
const videoStream = fs.createReadStream(videoPath,{start,end})
videoStream.pipe(res)




//  // Create a writable buffer stream
//  const writableStreamBuffer = new streamBuffers.WritableStreamBuffer({
//     initialSize: (100 * 1024),   // start at 100 kilobytes.
//     incrementAmount: (10 * 1024) // grow by 10 kilobytes each time buffer overflows.
// });

// // Pipe the video stream into the buffer
// videoStream.pipe(writableStreamBuffer);

// // When the buffer is fully written, send it as the response
// writableStreamBuffer.on('close', () => {
//     res.end(writableStreamBuffer.getContents());
// });


})

app.listen(PORT,()=>{
    console.log(`Listening on Port ${PORT}`)
})