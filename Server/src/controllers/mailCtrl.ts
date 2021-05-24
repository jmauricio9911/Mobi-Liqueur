var nodemailer = require('nodemailer');
import { Request, Response } from 'express';
import pool from '../database';
const pdf = require('html-pdf');
const path = require('path');

class EmialController {
    public async enviarFactura(req: Request, res: Response): Promise<any> {

        let sendEmail = function (req: any, res: any, emails: any, asunto: any) {
            // Definimos el transporter
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'tuemail@gmail.com',
                    pass: '********'
                }
            });
            //Cabecera del correo
            const cabecera = `<h4>Apreciado Cliente<h4>
            <p>¡Gracias por visitarnos y hacer su primera compra! Estamos contentos de que haya encontrado lo que estaba buscando. Nuestro objetivo es que siempre esté satisfecho, así que avísenos si su nivel de satisfacción. Esperamos volver a verle de nuevo. ¡Que tengas un gran día!</p>`
            // Definimos el email
            var mailOptions = {
                from: 'Mobi-Liqueur',
                to: emails,
                subject: 'Mobi-Liqueur[Factura]',
                html: cabecera,
                attachments: [
                    {
                        filename: 'file-name.pdf', // <= Here: made sure file name match
                        path: path.join('./html-pdf.pdf'), // <= Here
                        contentType: 'application/pdf'
                    }
                ]

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
        pdf.create(req.body.asunto).toFile('./html-pdf.pdf', function (err: any, res: any) {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
            }
        });
        sendEmail(req, res, req.body.correo, req.body.asunto);
    }
    public async sendRestore(req: Request, res: Response): Promise<any> {
        let sendEmail = function (req: any, res: any, emails: any, asunto: any) {
            // Definimos el transporter
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'tuemail@gmail.com',
                    pass: '********'
                }
            });
            //Cabecera del correo
            const cabecera = asunto
            // Definimos el email
            var mailOptions = {
                from: 'Mobi-Liqueur',
                to: emails,
                subject: 'Mobi-Liqueur[Restablecer Contraseña]',
                html: cabecera
            };
            //Recorremos el array(emails) para tomar los correos y proceder a enviar.
            transporter.sendMail(mailOptions, function (error: any, info: any) {
                if (error) {
                    res.json({ message: 'Error al enviar mensaje' });
                } else {
                    res.status(200).jsonp(req.body);
                }
            });
        };
        // pdf.create(req.body.asunto).toFile('./html-pdf.pdf', function (err: any, res: any) {
            // if (err) {
            //     console.log(err);
            // } else {
            //     console.log(res);
            // }
        // });
        sendEmail(req, res, req.body.correo, req.body.asunto);
    }
}
// const emialController = new EmialController();
// export default emialController;
const emialController = new EmialController;
export default emialController;