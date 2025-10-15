# ============================
# Dockerfile para IA_FORM
# ============================
# Imagen base de Playwright con Node preinstalado y todas las dependencias del navegador
FROM mcr.microsoft.com/playwright:v1.56.0-jammy

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto (el mismo que usa server.js)
EXPOSE 4000

# Comando por defecto
CMD ["npm", "start"]
