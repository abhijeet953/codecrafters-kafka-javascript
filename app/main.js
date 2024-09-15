import net from "net";

const server = net.createServer((connection) => {
  connection.on('data', (data) => {
    console.log('Received data:', data);

    // Ensure data has enough length to read
    if (data.length < 12) { // Minimum length to read all required fields
      console.error('Received data is too short.');
      return;
    }

    // Read the message length (4 bytes)
    const length = data.subarray(0, 4).readUInt32BE();
    console.log('Message Length:', length);

    // Read API Key (2 bytes)
    const apiKey = data.subarray(4, 6).readUInt16BE();
    // Read API Version (2 bytes)
    const apiVersion = data.subarray(6, 8).readUInt16BE();
    // Read Correlation ID (4 bytes)
    const correlationID = data.subarray(8, 12).readUInt32BE();

    console.log('API Key:', apiKey);
    console.log('API Version:', apiVersion);
    console.log('Correlation ID:', correlationID);

    // Prepare response
    let response;

    if (apiKey === 18) {
      // Handle API key 18
      if (apiVersion < 0 || apiVersion > 4) {
        // Error code for unsupported version
        response = Buffer.alloc(8);
        response.writeUInt32BE(correlationID, 0); // Correlation ID (4 bytes)
        response.writeUInt16BE(35, 4); // Error code (2 bytes)
        connection.write(response);
        return;
      }

      // Valid request, prepare the successful response
      response = Buffer.alloc(32);
      // Write message length (4 bytes) - length of the rest of the response (28 bytes)
      response.writeUInt32BE(28, 0);
      // Write Correlation ID (4 bytes)
      response.writeUInt32BE(correlationID, 4);
      // Write Error Code (2 bytes)
      response.writeUInt16BE(0, 8); // No error
      // Write Length (1 byte) - length of the remaining fields in the response (24 bytes)
      response.writeUInt8(24, 10);
      // Write API Key (2 bytes)
      response.writeUInt16BE(18, 11);
      // Write Min Version (2 bytes)
      response.writeUInt16BE(4, 13);
      // Write Max Version (2 bytes)
      response.writeUInt16BE(4, 15);
      // Write _tagged_fields[0] Length (1 byte)
      response.writeUInt8(0, 17); // No tagged fields
      // Write Throttle Time (4 bytes)
      response.writeUInt32BE(0, 18);
      // Write _tagged_fields Length (1 byte)
      response.writeUInt8(0, 22); // No additional tagged fields
    } else {
      // Handle other API keys
      response = Buffer.alloc(8);
      response.writeUInt32BE(correlationID, 0); // Correlation ID (4 bytes)
      response.writeUInt16BE(0, 4); // Error code for unsupported API Key (2 bytes)
    }

    // Send the response
    console.log('Sending response:', response);
    connection.write(response);
  });
});

server.listen(9092, "127.0.0.1", () => {
  console.log('Server is listening on port 9092');
});
