FROM node:12.14.1

WORKDIR /app

COPY . ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "buildstart"]