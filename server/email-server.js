import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configurar transporter de nodemailer con servidor SMTP de xlerion.com
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.xlerion.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // STARTTLS en puerto 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    },
    debug: true, // Activar logs detallados
    logger: true
});

// Verificar configuración del transporter
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Error en la configuración de email:', error);
        console.log('\n⚠️  Asegúrate de crear el archivo .env con tus credenciales');
        console.log('📝 Copia .env.example a .env y configúralo\n');
    } else {
        console.log('✅ Servidor de email listo para enviar mensajes');
    }
});

// Endpoint para enviar emails
app.post('/api/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    console.log('📨 Nueva solicitud de envío de email:');
    console.log('   Nombre:', name);
    console.log('   Email:', email);
    console.log('   Mensaje:', message?.substring(0, 50) + '...');

    // Validar datos
    if (!name || !email || !message) {
        console.log('❌ Faltan campos requeridos');
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.log('❌ Email inválido');
        return res.status(400).json({ error: 'Email inválido' });
    }

    try {
        const mailOptions = {
            from: `"Formulario XLERION" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO || 'sales@xlerion.com',
            replyTo: `"${name}" <${email}>`,
            subject: `Nuevo mensaje de contacto de ${name}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='UTF-8'>
                    <title>Nuevo mensaje de contacto</title>
                </head>
                <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                    <div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;'>
                        <h2 style='color: #00e9fa; border-bottom: 2px solid #00e9fa; padding-bottom: 10px;'>
                            Nuevo mensaje de contacto
                        </h2>
                        <div style='background-color: white; padding: 20px; border-radius: 5px; margin-top: 20px;'>
                            <p><strong>De:</strong> ${name}</p>
                            <p><strong>Email:</strong> <a href='mailto:${email}'>${email}</a></p>
                            <p><strong>Mensaje:</strong></p>
                            <div style='padding: 15px; background-color: #f9f9f9; border-left: 4px solid #00e9fa;'>
                                <p>${message.replace(/\n/g, '<br>')}</p>
                            </div>
                        </div>
                        <p style='margin-top: 20px; font-size: 12px; color: #666;'>
                            Este mensaje fue enviado desde el formulario de contacto de xlerion.com
                        </p>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Email enviado correctamente');
        res.json({ success: true, message: 'Email enviado correctamente' });
    } catch (error) {
        console.error('❌ Error al enviar email:', error);
        res.status(500).json({
            error: 'Error al enviar el email',
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log('\n🚀 Servidor de emails XLERION iniciado');
    console.log(`📧 Escuchando en http://localhost:${PORT}`);
    console.log(`📬 Emails se enviarán a: ${process.env.EMAIL_TO || 'sales@xlerion.com'}`);
    console.log('\n💡 Para probar el formulario:');
    console.log('   1. Ejecuta el frontend: npm run dev');
    console.log('   2. Abre: http://localhost:5173');
    console.log('   3. Ve a la sección de contacto y envía un mensaje\n');
});
