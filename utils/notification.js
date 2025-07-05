const db = require("../config/db");
const nodemailer = require("nodemailer");
const dayjs = require("dayjs");

// Fonction pour envoyer un mail et enregistrer la notification
async function sendNotificationAndSave({ to, subject, text, utilisateur_id }) {
  // Config nodemailer (exemple Gmail, à adapter)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // Envoi du mail
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
  });

  // Enregistrement notification en base
  db.query(
    "INSERT INTO notifications (utilisateur_id, message, date_envoi) VALUES (?, ?, NOW())",
    [utilisateur_id, text],
    (err) => {
      if (err) console.error("Erreur SQL notification:", err);
    }
  );
}

// Script à lancer chaque jour (cron)
async function notifyEmprunts() {
  const dans3jours = dayjs().add(3, "day").format("YYYY-MM-DD");
  db.query(
    `SELECT e.id, e.utilisateur_id, e.date_retour, u.email, u.nom, l.titre
     FROM emprunts e
     JOIN utilisateurs u ON e.utilisateur_id = u.id
     JOIN livres l ON e.livre_id = l.id
     WHERE e.date_retour = ? AND u.role = 'etudiant'`,
    [dans3jours],
    async (err, rows) => {
      if (err) return console.error("Erreur SQL emprunts:", err);
      for (const row of rows) {
        const message = `Bonjour ${row.nom},\nN'oubliez pas de rendre le livre "${row.titre}" avant le ${row.date_retour}.`;
        await sendNotificationAndSave({
          to: row.email,
          subject: "Rappel retour de livre à la bibliothèque",
          text: message,
          utilisateur_id: row.utilisateur_id,
        });
      }
    }
  );
}

// Pour exécution manuelle
if (require.main === module) {
  notifyEmprunts();
}

module.exports = { notifyEmprunts };
