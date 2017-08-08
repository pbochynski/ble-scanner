var bleno = require('bleno');
var conv = require('binstring');


function startAdvertisingWithData(name, data) {

  var dataLength = data.length;
  var manufacturerDataLength = 4 + dataLength;
  var scanDataLength = 0;

  var advertisementData = new Buffer(manufacturerDataLength+5);
  var scanData = new Buffer(name.length + 2);

  // flags
  advertisementData.writeUInt8(2, 0);
  advertisementData.writeUInt8(0x01, 1);
  advertisementData.writeUInt8(0x06, 2);

  advertisementData.writeUInt8(manufacturerDataLength + 1, 3);
  advertisementData.writeUInt8(0xff, 4);
  advertisementData.writeUInt16LE(0x004c, 5); // Apple Company Identifier LE (16 bit)
  advertisementData.writeUInt8(0x02, 7); // type, 2 => iBeacon
  advertisementData.writeUInt8(dataLength, 8);

  data.copy(advertisementData, 9);

  // name
  if (name && name.length) {
    var nameBuffer = new Buffer(name);

    scanData.writeUInt8(1 + nameBuffer.length, 0);
    scanData.writeUInt8(0x08, 1);
    nameBuffer.copy(scanData, 2);
  }
  console.log("advertisementData: %s, scanData: %s",
    conv(advertisementData, { in: 'buffer', out: 'hex' }),
    conv(scanData, { in: 'buffer', out: 'hex' })
  );
  
  bleno.startAdvertisingWithEIRData(advertisementData, scanData); 

  // var uuid = 'e2c56db5dffb48d2b060d0f5a71096e0';
  // var major = 01; // 0x0000 - 0xffff
  // var minor = 02; // 0x0000 - 0xffff
  // var measuredPower = -59; // -128 - 127
  // bleno.startAdvertisingIBeacon(uuid, major, minor, measuredPower);
};



console.log('bleno - echo');

bleno.on('stateChange', function (state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    const data = conv('0918473100003d714b0d', { in: 'hex', out: 'buffer' });
    startAdvertisingWithData('S04', data);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function (error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));


});