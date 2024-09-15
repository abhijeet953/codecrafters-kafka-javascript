import { connect } from "http2";
import net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {

  connection.on("data", (data) => {

    console.log('Received data:', data);

    let messageLength = Buffer.alloc(4);
    messageLength.writeUInt32BE(data.subarray(0,4).length);
    let request_api_key = data.subarray(4,6);
    let request_api_version = data.subarray(6,8);
    
    //Message Length
    connection.write(messageLength);
    //Correlation ID
    connection.write(data.subarray(8,10));
    //No error
    let errorCode = Buffer.alloc(1);
    errorCode.writeUInt8(0);
    connection.write(errorCode);
    //


  });
});

server.listen(9092, "127.0.0.1");
