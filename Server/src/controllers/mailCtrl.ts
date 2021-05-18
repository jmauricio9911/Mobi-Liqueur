var nodemailer = require('nodemailer');
import { Request, Response } from 'express';
import pool from '../database';

class EmialController {
    public async enviarFactura(req: Request, res: Response): Promise<any> {

        let sendEmail = function (req: any, res: any, emails: any, asunto: any) {
            // Definimos el transporter
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'mauriciozabaleta123@gmail.com',
                    pass: '26147103'
                }
            });
            // Definimos el email
            var mailOptions = {
                from: 'Mobi-Liqueur',
                to: emails,
                subject: 'Mobi-Liqueur[Factura]',
                html: asunto
            };
            //Recorremos el array(emails) para tomar los correos y proceder a enviar.
                transporter.sendMail(mailOptions, function (error: any, info: any) {
                    if (error) {
                        console.log(error);
                        res.json({ message: 'Error al enviar mensaje' });
                    } else {
                        console.log("Email sent");
                        res.status(200).jsonp(req.body);
                    }
                });
        };
        sendEmail(req, res, req.body.correo, req.body.asunto);
        }
    }
// const emialController = new EmialController();
// export default emialController;
const emialController = new EmialController;
export default emialController;