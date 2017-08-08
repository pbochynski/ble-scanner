var noble = require('noble');

noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {
        noble.startScanning([], true);
    } else {
        noble.stopScanning();
    }
});

noble.on('discover', function (peripheral) {
    const isMyDevice = (peripheral.advertisement.localName && peripheral.advertisement.localName.substring(0, 1) == "S");
    if (isMyDevice || peripheral.rssi > -50) { // filter only my devices and strong devices nearby
        console.log("%s: RSSI: %s, name: %s, data: %s",
            new Date().toISOString(), peripheral.rssi, peripheral.advertisement.localName,
            peripheral.advertisement.manufacturerData ? JSON.stringify(peripheral.advertisement.manufacturerData.toString('hex')) : 'null');
    }
});

noble.on('scanStop', () => { console.log("scanStop"); });