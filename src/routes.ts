import { Router } from 'express';

import MailController from '@controllers/Mail';

const routes = Router();

routes.post('/send', MailController.store);

export default routes;
