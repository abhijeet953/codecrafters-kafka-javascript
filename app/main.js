import { connect } from "http2";
import net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {

  connection.on("data", (data) => {

    console.log('Received data:', data);

    const messageLength = Buffer.alloc(4);
    messageLength.writeUInt32BE(data.length - 4); // Actual length minus the size of the length field

    // Extract and handle correlation ID
    const correlationId = data.subarray(8, 12);

    // Prepare response
    let response = Buffer.concat([
      messageLength,
      correlationId,
      Buffer.from([0, 0]),  // No error
      Buffer.from([18, 4])   // ApiKey 18 and MaxVersion 4
    ]);

    // Send response
    connection.write(response);


  });
});

server.listen(9092, "127.0.0.1");
