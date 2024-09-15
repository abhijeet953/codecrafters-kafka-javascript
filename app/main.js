import net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {

  connection.on("data", (data) => {

    console.log('Received data:', data);

    let correlationID = data.subarray(4, 12);
    connection.write(correlationID);
    let errorCode = Buffer.alloc(1);
    errorCode.writeUInt8(0);
    connection.write(errorCode);
  });
});

server.listen(9092, "127.0.0.1");
