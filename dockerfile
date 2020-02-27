FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./dist .

EXPOSE 3001

CMD ["npm", "start"]

# ENV PORT 3001

# EXPOSE 3001

# COPY package.json package.json
# RUN npm install

# COPY . .
# RUN npm run build

# CMD ["node", "dist/"]