import { Router } from 'express';

import MailController from '@controllers/Mail';
import AccountConfirmation from '@controllers/AccountConfirmation';
import TestMailController from '@controllers/TestMailController';

import LogRequest from '@middlewares/LogRequests';

const routes = Router();

routes.use(LogRequest);

routes.post('/send', MailController.store);
routes.post('/account/confirmation', AccountConfirmation.store);
routes.get('/test', TestMailController.store);

export default routes;
