import express from 'express';
import {
    graphqlExpress,
    graphiqlExpress,
} from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { schema } from './src/schema';

const PORT = 4000;

const server = express();

server.get('/', function (req, res) {
    res.json({ ID: 1, name: 'Hello World!' });
});

server.use('/graphql', cors(corsOptionsDelegate), bodyParser.json(), graphqlExpress({
    schema
}));

server.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
}));

var whitelist = ['http://localhost:3000'];

var corsOptionsDelegate = function (req, callback) {
    var corsOptions;

    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response 
    }
    else {
        corsOptions = { origin: false } // disable CORS for this request 
    }

    callback(null, corsOptions) // callback expects two parameters: error and options 
}

server.use('*', cors({ origin: 'http://localhost:3000' }));

server.listen(PORT, () => console.log(`GraphQL Server is now running on http://localhost:${PORT}`));