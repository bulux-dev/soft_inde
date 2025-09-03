var socket = null;
start();

function start() {
    try {
        socket = new WebSocket('ws://127.0.0.1:6441');
        socket.onopen = function () {
            return true;
        };
        socket.onclose = function () {
            // return;
        };
    } catch (e) {
        console.log(e);
    }
}

function openDrawer(ipAddress) {
    var data = {
        'printer': { "id": "2", "title": "Order Printer", "type": "network", "profile": "default", "path": "", ipAddress: "192.168.100.51", "port": "9100", "char_per_line": "48" }
    };

    if (socket.readyState == 1) {
        socket.send(JSON.stringify({
            type: 'open-cashdrawer',
            data: data
        }));
        return false;
    } else {
        alert('Not connected to socket.');
        return false;
    }
}

function checkStatus() {
    if (socket.readyState == 1) {
        return true;
    } else {
        return false;
    }  
}

function printer(receipt_data, ip) {
    var data = {
        'printer': { "id": "3", "title": "Order Printer", "type": "network", "profile": "default", "path": "", "ip_address": ip, "port": "9100", "char_per_line": "48" },
        'text': receipt_data,
        'cash_drawer': false
    };
    if (socket.readyState == 1) {
        socket.send(JSON.stringify({
            type: 'print-receipt',
            data: data
        }));
        //  openDrawer(ipAddress) 
        return true;
    } else {
        // alert('Not connected to socket.');
        return false;
    }
}