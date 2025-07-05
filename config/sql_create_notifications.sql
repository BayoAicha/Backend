CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  message TEXT NOT NULL,
  date_envoi DATETIME NOT NULL,
  lu BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);
