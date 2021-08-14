import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import * as Yup from 'yup';

import Mail from '@services/Mail';
import AppError from '@errors/AppError';

class MailController {
    async store(req: Request, res: Response): Promise<Response> {
        console.log('Received Mail request');
        const schema = Yup.object().shape({
            to: Yup.string().required().email('Invalid email'),
            subject: Yup.string().required(),
            name: Yup.string().required(),
            AppName: Yup.string().required(),
            batches: Yup.array(Yup.object()),
        });

        try {
            await schema.validate(req.body);
        } catch (err) {
            throw new AppError({ message: err.message });
        }

        const { to, subject, name, AppName, batches: batch } = req.body;

        const variables: IMailVariables = {
            name,
            AppName,
            batch,
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
            'ExpiredAndNextProducts.hbs',
        );

        const templateFileContent = await fs.promises.readFile(templatePath, {
            encoding: 'utf-8',
        });

        const compiledTemplate = Handlebars.compile(templateFileContent);
        const parsedTemplate = compiledTemplate(variables);

        Mail.sendMail({
            from: {
                address: process.env.MAIL_USER || 'noreplay@douglasndm.dev',
                name: AppName,
            },
            to,
            subject,
            html: parsedTemplate,
        });

        return res.status(201).send();
    }
}

export default new MailController();
