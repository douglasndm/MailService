import { Request, Response } from 'express';

import Mail from '@services/Mail';

class TestMailController {
    async store(req: Request, res: Response): Promise<Response> {
        Mail.sendMail({
            from: {
                address:
                    process.env.SMTP_MAIL_USER ||
                    'noreplay@controledevalidades.com',
                name: 'Controle de Validades',
            },
            to: 'suporte@controledevalidades.com',
            subject: 'Teste de envio de email',
            html: `<h1>Teste de envio de email</h1>`,
        });

        return res.status(201).send();
    }
}

export default new TestMailController();
