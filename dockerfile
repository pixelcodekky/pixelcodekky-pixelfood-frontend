FROM node:18-alpine as BUILD_IMG

WORKDIR /app/pixelfoodweb

COPY package*.json ./

RUN npm install

# copy all remaining files
COPY . .
# build project
RUN npm run build

EXPOSE 5173

CMD ["npm","run", "serve"]

