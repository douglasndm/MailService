import { Router } from 'express';

import MailController from '@controllers/Mail';
import AccountConfirmation from '@controllers/AccountConfirmation';

const routes = Router();

routes.post('/send', MailController.store);
routes.post('/account/confirmation', AccountConfirmation.store);

export default routes;
