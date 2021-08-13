import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
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

        const variables: IMailVariables = {
            name: 'Douglas',
        };

        const templatesFolder = path.resolve(
            __dirname,
            '..',
            '..',
            'Mail',
            'Templates',
            'ExpiryChecker',
        );
        const templatePath = path.resolve(
            templatesFolder,
            'SimpleNotification.hbs',
        );

        const templateFileContent = await fs.promises.readFile(templatePath, {
            encoding: 'utf-8',
        });

        const compiledTemplate = Handlebars.compile(templateFileContent);
        const parsedTemplate = compiledTemplate(variables);

        await Mail.sendMail({
            from: {
                address: process.env.MAIL_USER || 'noreplay@douglasndm.dev',
                name: 'Douglas de Mattos',
            },
            to,
            subject,
            html: parsedTemplate,
        });

        return res.status(201).send();
    }
}

export default new MailController();
