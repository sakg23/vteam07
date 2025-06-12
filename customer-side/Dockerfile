FROM node:18

WORKDIR /customer-side

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3005

CMD ["npm", "start"]