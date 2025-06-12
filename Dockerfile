FROM node

WORKDIR /server

COPY package*.json .

COPY app.js .

COPY config/ ./config/

COPY sql/ ./sql/

COPY middleware/ ./middleware/

COPY routes/ ./routes/

COPY src/ ./src/

COPY .env/ ./.env/

RUN npm install

EXPOSE 3000

CMD ["node", "app.js"]
