FROM node:16
WORKDIR /app
COPY publisher.js .
RUN npm install mqtt
CMD ["node", "publisher.js"]