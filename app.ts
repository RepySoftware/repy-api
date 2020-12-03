require('dotenv').config();

import "reflect-metadata";
import * as express from 'express';
import * as cors from 'cors';
import * as moment from 'moment-timezone'
import { routes } from './src/routes';
import { CONFIG } from './src/config';
import { onError } from "./src/common/functions/on-error";
import { ServicesCollection } from "./src/providers";
import { Database } from "./src/data/database-config";

console.log('Initializing...');

const app = express();

app.use(cors());
app.options("*", cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

moment.tz.setDefault('UTC');

app.use(routes);

ServicesCollection.resolve(Database);

app.use(onError);

app.listen(CONFIG.PORT, CONFIG.HOST, () => {
    console.log(`Running on http://${CONFIG.HOST}:${CONFIG.PORT}`);
});