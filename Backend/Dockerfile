# Usa uma imagem base oficial do Node.js
FROM node:20

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências primeiro (para aproveitar cache de build)
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código para dentro do container
COPY . .

# Limpa cache do Jest (evita erros em builds repetidos)
RUN npx jest --clearCache || true

# Expõe a porta usada pelo servidor Node
EXPOSE 3000

# Define o comando padrão de execução
CMD ["npm", "start"]
