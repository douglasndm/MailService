import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import mjml from 'mjml';
import { compile } from 'handlebars';
import * as Yup from 'yup';

import Mail from '@services/Mail';

import AppError from '@errors/AppError';

class AccountConfirmationController {
    async store(req: Request, res: Response): Promise<Response> {
        const schema = Yup.object().shape({
            to: Yup.string().required().email('Invalid email'),
            subject: Yup.string().required(),
            name: Yup.string().required(),
            AppName: Yup.string().required(),
            confirmationLink: Yup.string().url().required(),
        });

        try {
            await schema.validate(req.body);
        } catch (err) {
            if (err instanceof Error)
                throw new AppError({ message: err.message });
        }

        const templatesFolder = path.resolve(
            __dirname,
            '..',
            '..',
            'Mail',
            'Templates',
            'ExpiryTeams',
        );

        const templatePath = path.resolve(
            templatesFolder,
            'EmailAccountConfirmation.mjml',
        );

        const templateFileContent = await fs.promises.readFile(templatePath, {
            encoding: 'utf-8',
        });

        const baseHtml = mjml(templateFileContent).html;
        const compiledTemplate = compile(baseHtml);
        const final = compiledTemplate(req.body);

        Mail.sendMail({
            from: {
                address:
                    process.env.SMTP_MAIL_USER ||
                    'noreplay@controledevalidades.com',
                name: req.body.AppName,
            },
            to: req.body.to,
            subject: req.body.subject,
            html: final,
        });

        return res.status(201).send();
    }
}

export default new AccountConfirmationController();
