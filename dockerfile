# Use a imagem oficial do Node.js como base
FROM node:18

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

RUN npm install -g nodemon

# Copie todo o código do projeto para o diretório de trabalho
COPY controller/ ./controller
COPY repo/ ./repo
COPY utils/ ./utils
COPY services/ ./services


# Exponha a porta que a aplicação vai rodar
EXPOSE 3330

# Comando para iniciar a aplicação
CMD ["nodemon", "controller/main.js"]
