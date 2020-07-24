const port = 3000;
const bodyParser = require('body-parser');
const express = require('express');
const server = express();
const data = require('./data/db').DB;

const ProvisionRoutes = require('./routes/provisionRoutes');
const DataRoutes = require('./routes/dataRoutes');
const SchemaRoutes = require('./routes/schemaRoutes');

server.use(bodyParser.json());

server.use('/provision', ProvisionRoutes);

server.use('/data', DataRoutes);

server.use('/schemas', SchemaRoutes);

server.get('');


server.listen(port, () => {
    console.log('Server is listening to port '+port);
})