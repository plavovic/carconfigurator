const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/options?modelId=1',
    method: 'GET',
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log(`Status Code: ${res.statusCode}`);
            console.log(`Number of options returned: ${json.length}`);
            if (json.length > 0) {
                console.log('Sample option:', json[0].name);
                console.log('VERIFICATION SUCCESSFUL');
            } else {
                console.log('VERIFICATION FAILED: No options returned');
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
