import express from 'express';
import path from 'path';
import {port} from './config';

// create express server, listen to configured port
const server = express();
server.listen(port, () => console.log(`Listening to PORT: ${port}`));

// use ejs template engine to render html, located in ./views/ 
server.set('view engine','ejs');

// declare middlewares (code that executes between http request and response)
server.use(express.static('public'));  // serve static files (html, bundles, and css) in ./public/


server.get('/', (req,res) => res.render('index'));
