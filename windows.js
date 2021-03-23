var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name: 'Hello World',
    description: 'The nodejs.org example web server.',
    script: 'F:\\alnakheel-gym\\cprScrip.js',
    nodeOptions: [
        '--harmony',
        '--max_old_space_size=4096'
    ]
});

svc.on('install', function () {
    svc.start();
});

svc.install();