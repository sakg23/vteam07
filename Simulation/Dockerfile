FROM node:16

WORKDIR /simulation

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "startSimulation.js"]
