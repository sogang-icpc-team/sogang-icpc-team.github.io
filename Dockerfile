FROM node:12-alpine
WORKDIR /web/sgicpc-official-website
COPY package*.json ./
RUN npm install -g
COPY . .
RUN npm run build
CMD ["npm", "start"]
EXPOSE 4444
