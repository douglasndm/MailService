import { Request, Response } from 'express';
import * as Yup from 'yup';

import Mail from '@services/Mail';
import AppError from '@errors/AppError';

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
            throw new AppError({ message: err.message });
        }

        const { to, subject, text } = req.body;

        await Mail.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject,
            text,
        });

        return res.status(201).send();
    }
}

export default new MailController();
