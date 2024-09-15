import net from "net";

const API_VERSIONS_KEY = 18;
const MAX_VERSION = 4;
// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {

  connection.on("data", (data) => {

    let messageLength = data.readUInt32BE(0);
    console.log('Message Length:', messageLength);

    // Extract API key and version (next 4 bytes total)
    let request_api_key = data.readUInt16BE(4);
    let request_api_version = data.readUInt16BE(6);

    console.log('API Key:', request_api_key);
    console.log('API Version:', request_api_version);

    // Extract correlation ID (next 4 bytes starting from 8th byte)
    let correlationId = data.readUInt32BE(8);
    console.log('Correlation ID:', correlationId);

    // Prepare response
    let response = Buffer.alloc(12);  // Message length (4 bytes) + Correlation ID (4 bytes) + Error Code (1 byte) + Entry (1 byte)

    // Write message length (4 bytes)
    response.writeUInt32BE(8, 0);  // Header is 8 bytes long

    // Write correlation ID (4 bytes)
    response.writeUInt32BE(correlationId, 4);

    // Write no error (1 byte)
    response.writeUInt8(0, 8);

    // Check if the API key is API_VERSIONS (18) and version is >= 4
    if (request_api_key === API_VERSIONS_KEY && request_api_version >= MAX_VERSION) {
      // Write the MaxVersion for API_VERSIONS (1 byte, assuming 4 is the max)
      response.writeUInt8(MAX_VERSION, 9);
    } else {
      // If the request doesn't meet the API version requirement, set an error or handle it differently
      response.writeUInt8(0, 9);  // For simplicity, respond with 0
    }

    // Send the response
    connection.write(response);


  });
});

server.listen(9092, "127.0.0.1");
