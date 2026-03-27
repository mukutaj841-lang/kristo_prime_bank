const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Vercel gère les routes automatiquement dans le dossier api/
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const { first_name, last_name, phone, email, company, pro_email, message } = req.body;

    // Configuration via les variables d'environnement de Vercel
    const GMAIL_USER = process.env.GMAIL_USER || 'meschackristo777@gmail.com';
    const GMAIL_PASS = process.env.GMAIL_PASS;

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
        to: GMAIL_USER,
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

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ status: 'success', message: 'Email envoyé avec succès !' });
    } catch (error) {
        console.error('Erreur lors de l\'envois :', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};
