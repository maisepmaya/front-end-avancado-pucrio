# Estágio 1: Build da aplicação React
FROM node:20-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia o package.json e package-lock.json para o container
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Executa o script de build para gerar os arquivos estáticos
RUN npm run build

# Estágio 2: Servidor de produção
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Instala o 'serve' globalmente para servir os arquivos estáticos
RUN npm install -g serve

# Copia os arquivos buildados do estágio anterior
COPY --from=build /app/dist ./dist

# Expõe a porta que o 'serve' usará
EXPOSE 3000

# Comando para iniciar o servidor
# O '-s' garante que a aplicação funcione como uma Single Page Application (SPA)
CMD ["serve", "-s", "dist", "-l", "3000"]
