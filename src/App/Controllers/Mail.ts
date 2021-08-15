import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import mjml from 'mjml';
import { compile } from 'handlebars';
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
            'ExpiryTeams',
        );
        const templatePath = path.resolve(templatesFolder, 'WeekResume.mjml');

        const templateFileContent = await fs.promises.readFile(templatePath, {
            encoding: 'utf-8',
        });

        const baseHtml = mjml(templateFileContent).html;
        const compiledTemplate = compile(baseHtml);
        const final = compiledTemplate(variables);

        return res.send(final);

        Mail.sendMail({
            from: {
                address: process.env.MAIL_USER || 'noreplay@douglasndm.dev',
                name: AppName,
            },
            to,
            subject,
            html: final,
        });

        return res.status(201).send();
    }
}

export default new MailController();
