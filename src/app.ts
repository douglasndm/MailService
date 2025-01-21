import express from 'express';

import dotenv from 'dotenv';
import Routes from './routes';

const App = express();

dotenv.config({ path: '../.env' });

App.use(express.json());
App.use(Routes);

export default App;
