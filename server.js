const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Configuration via les variables d'environnement (Indispensable pour Koyeb)
const GMAIL_USER = process.env.GMAIL_USER || 'meschackristo777@gmail.com';
const GMAIL_PASS = process.env.GMAIL_PASS || 'rwtv wdxv szoy fbne'; 

app.use(cors());
app.use(express.json());

// Servir automatiquement vos pages HTML (index.html, nos_produits.html, contact.html)
app.use(express.static(__dirname));

// Route pour l'envoi d'email
app.post('/send-email', (req, res) => {
    const { first_name, last_name, phone, email, company, pro_email, message } = req.body;

    // Configuration du transporteur SMTP (Gmail)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASS
        }
    });

    // Contenu de l'email
    const mailOptions = {
        from: GMAIL_USER,
        to: GMAIL_USER, // Vous vous envoyez le message à vous-même
        subject: `Nouveau message de ${first_name} ${last_name} (Site Kristo Prime Bank)`,
        text: `
            Détails du contact :
            -------------------
            Nom complet : ${first_name} ${last_name}
            Téléphone : ${phone}
            Email personnel : ${email}
            Entreprise : ${company || 'Non spécifié'}
            Email pro : ${pro_email || 'Non spécifié'}

            Message :
            ---------
            ${message}
        `
    };

    // Envoi effectif
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envois :', error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
        console.log('Email envoyé : ' + info.response);
        res.status(200).json({ status: 'success', message: 'Email envoyé avec succès !' });
    });
});

app.listen(port, () => {
    console.log(`Le serveur de messagerie Kristo Prime Bank tourne sur http://localhost:${port}`);
});
