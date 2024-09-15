import net from 'net';

const server = net.createServer((connection) => {
  connection.on('data', (data) => {
    console.log('Received data:', data);

    // Ensure data has enough length to read the message length
    if (data.length < 4) {
      console.error('Received data is too short to read the message length.');
      return;
    }

    // Read message length (4 bytes)
    const messageLength = data.readUInt32BE(0);
    console.log('Message Length:', messageLength);

    // Check if the total length of received data is sufficient
    if (data.length < messageLength + 4) {
      console.error('Unexpected end of data. Expected length:', messageLength + 4, 'but received:', data.length);
      return;
    }

    // Read API Key (2 bytes)
    const requestApiKey = data.readUInt16BE(4);
    console.log('Request API Key:', requestApiKey);

    // Read API Version (2 bytes)
    const requestApiVersion = data.readUInt16BE(6);
    console.log('Request API Version:', requestApiVersion);

    // Prepare response
    let response;

    if (requestApiKey === 18 && requestApiVersion >= 0 && requestApiVersion <= 4) {
      // Create response buffer
      response = Buffer.alloc(35); // Adjust size based on protocol requirements

      // Write message length (4 bytes)
      response.writeUInt32BE(31, 0); // Length of the response body

      // Write correlation ID (4 bytes) - Placeholder
      response.writeUInt32BE(0, 4); // Placeholder for correlation ID

      // Write error code (1 byte)
      response.writeUInt8(0, 8);

      // Write length (1 byte) - assuming this is the length of the following data
      response.writeUInt8(8, 9);

      // Write API key (2 bytes)
      response.writeUInt16BE(18, 10);

      // Write min version (2 bytes)
      response.writeUInt16BE(0, 12);

      // Write max version (2 bytes)
      response.writeUInt16BE(4, 14);

      // Write additional fields as needed (e.g., tagged fields)
      // Adjust these fields according to your protocol
      response.writeUInt8(0, 16); // Placeholder for additional data (if required)
      
    } else {
      // Handle other cases or errors
      response = Buffer.alloc(8);

      // Write message length (4 bytes)
      response.writeUInt32BE(4, 0);

      // Write correlation ID (4 bytes) - Placeholder
      response.writeUInt32BE(0, 4);

      // Write error code (1 byte)
      response.writeUInt8(1, 8); // Error code for unsupported API Key or version
    }

    // Send the response
    connection.write(response);
  });

  connection.on('error', (err) => {
    console.error('Connection error:', err);
  });
});

server.listen(9092, '127.0.0.1', () => {
  console.log('Server is listening on port 9092');
});
