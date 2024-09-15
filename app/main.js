import net from "net";

const server = net.createServer((conn) => {

  conn.on('data', (data) => {

    console.log(data);

    let apiVersion = data.subarray(6, 8).readUInt16BE(0);
    let correlationId_Bytes = data.subarray(8, 12);
    console.log("Hi");
    console.log(apiVersion);
    console.log(correlationId_Bytes);

    // Create Buffers with similar properties as the Python examples

    // Error code bytes (2 bytes, big-endian)
    const error_code_bytes = Buffer.alloc(2);
    error_code_bytes.writeInt16BE(0, 0);

    // API key bytes (1 byte, big-endian)
    const api_key_bytes = Buffer.alloc(1);
    api_key_bytes.writeInt8(2, 0);

    // Response API key bytes (2 bytes, big-endian)
    const response_api_key_bytes = Buffer.alloc(2);
    response_api_key_bytes.writeInt16BE(18, 0);

    // API key min version bytes (2 bytes, big-endian)
    const api_key_min_version_bytes = Buffer.alloc(2);
    api_key_min_version_bytes.writeInt16BE(4, 0);

    // API key max version bytes (2 bytes, big-endian)
    const api_key_max_version_bytes = Buffer.alloc(2);
    api_key_max_version_bytes.writeInt16BE(4, 0);

    // Tag buffer bytes (2 bytes, big-endian)
    const tag_buffer_bytes = Buffer.alloc(2);
    tag_buffer_bytes.writeInt16BE(0, 0);

    // Throttle time ms bytes (4 bytes, big-endian)
    const throttle_time_ms_bytes = Buffer.alloc(4);
    throttle_time_ms_bytes.writeInt32BE(0, 0);

    console.log('Error Code Bytes:', error_code_bytes);
    console.log('API Key Bytes:', api_key_bytes);
    console.log('Response API Key Bytes:', response_api_key_bytes);
    console.log('API Key Min Version Bytes:', api_key_min_version_bytes);
    console.log('API Key Max Version Bytes:', api_key_max_version_bytes);
    console.log('Tag Buffer Bytes:', tag_buffer_bytes);
    console.log('Throttle Time MS Bytes:', throttle_time_ms_bytes);

    let msg_length = (correlationId_Bytes.length
      + error_code_bytes.length
      + api_key_bytes.length
      + response_api_key_bytes.length
      + api_key_min_version_bytes.length
      + api_key_max_version_bytes.length
      + tag_buffer_bytes.length
      + throttle_time_ms_bytes.length);

    console.log('Message Length:', msg_length);

    const mlb = Buffer.alloc(4);
    mlb.writeUInt32BE(msg_length, 0);

    conn.write(mlb);
    conn.write(correlationId_Bytes);
    if (apiVersion >= 0 && apiVersion <= 4) {
      console.log("INSIDE");
      conn.write(error_code_bytes);
    } else {
      let errorCode = Buffer.alloc(2);
      errorCode.writeUInt16BE(35);
      conn.write(errorCode);
    }

    conn.write(api_key_bytes);
    conn.write(response_api_key_bytes);
    conn.write(api_key_min_version_bytes);
    conn.write(api_key_max_version_bytes);
    conn.write(tag_buffer_bytes);
    conn.write(throttle_time_ms_bytes);

  });
});

server.listen(9092, "127.0.0.1")