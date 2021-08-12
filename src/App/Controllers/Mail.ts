import { Request, Response } from 'express';
import * as Yup from 'yup';

import Mail from '@services/Mail';

class MailController {
    async store(req: Request, res: Response): Promise<Response> {
        const schema = Yup.object().shape({
            to: Yup.string().required().email('Invalid email'),
            subject: Yup.string().required(),
            text: Yup.string().required(),
        });

        try {
            await schema.validate(req.body);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }

        const { to, subject, text } = req.body;

        await Mail.sendMail({
            to,
            subject,
            text,
        });

        return res.status(201).send();
    }
}

export default new MailController();
