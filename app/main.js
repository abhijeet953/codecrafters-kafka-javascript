import net from "net";

const server = net.createServer((conn) => {

  conn.on('data', (data) => {

    console.log(data);
    let apiVersion = data.subarray(6, 8).readUInt16BE(0);
    let correlationId_bytes = data.subarray(8, 12);

    const error_code_bytes = Buffer.alloc(2);
    error_code_bytes.writeInt16BE(0, 0);

    const api_key_bytes = Buffer.alloc(1);
    api_key_bytes.writeInt8(2, 0);

    const response_api_key_bytes = Buffer.alloc(2);
    response_api_key_bytes.writeInt16BE(18, 0);

    const api_key_min_version_bytes = Buffer.alloc(2);
    api_key_min_version_bytes.writeInt16BE(4, 0);

    const api_key_max_version_bytes = Buffer.alloc(2);
    api_key_max_version_bytes.writeInt16BE(4, 0);

    let tag_buffer_bytes = Buffer.alloc(1);
    tag_buffer_bytes.writeInt8(0);

    const throttle_time_ms_bytes = Buffer.alloc(4);
    throttle_time_ms_bytes.writeInt32BE(0, 0);

    let num_api_keys_bytes = Buffer.alloc(1);
    num_api_keys_bytes.writeInt8(3);

    let fetch_response_api_key_bytes = Buffer.alloc(2);
    fetch_response_api_key_bytes.writeInt16BE(1);

    let fetch_api_key_min_version_bytes = Buffer.alloc(2);
    fetch_api_key_min_version_bytes.writeInt16BE(4);

    let fetch_api_key_max_version_bytes = Buffer.alloc(2);
    fetch_api_key_max_version_bytes.writeInt16BE(16);

    let fetch_tag_buffer_bytes = Buffer.alloc(1);
    fetch_tag_buffer_bytes.writeInt8(0);

    let msg_length = (correlationId_bytes.length
      + error_code_bytes.length
      + num_api_keys_bytes.length
      + response_api_key_bytes.length
      + api_key_min_version_bytes.length
      + api_key_max_version_bytes.length
      + tag_buffer_bytes.length
      + fetch_response_api_key_bytes.length
      + fetch_api_key_min_version_bytes.length
      + fetch_api_key_max_version_bytes.length
      + fetch_tag_buffer_bytes.length
      + throttle_time_ms_bytes.length);


    console.log('Message Length:', msg_length);

    const mlb = Buffer.alloc(4);
    mlb.writeUInt32BE(msg_length, 0);

    conn.write(mlb);
    conn.write(correlationId_bytes);
    if (apiVersion >= 0 && apiVersion <= 4) {
      console.log("INSIDE");
      conn.write(error_code_bytes);
    } else {
      let errorCode = Buffer.alloc(2);
      errorCode.writeUInt16BE(35);
      conn.write(errorCode);
    }

    conn.write(num_api_keys_bytes);
    conn.write(response_api_key_bytes);
    conn.write(api_key_min_version_bytes);
    conn.write(api_key_max_version_bytes);
    conn.write(tag_buffer_bytes);
    conn.write(fetch_response_api_key_bytes);
    conn.write(fetch_api_key_min_version_bytes);
    conn.write(fetch_api_key_max_version_bytes);
    conn.write(fetch_tag_buffer_bytes);
    conn.write(throttle_time_ms_bytes);
    conn.write(tag_buffer_bytes);

  });
});

server.listen(9092, "127.0.0.1")