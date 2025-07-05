# Utiliser une image Node officielle
FROM node:18-alpine

# Création d' un dossier de travail
WORKDIR /app

# Copie du package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installation les dépendances
RUN npm install

# Copie du reste du code source
COPY . .

# Exposer le port (par exemple 5000)
EXPOSE 5000

# Lancecement du backend
CMD ["node", "server.js"]
