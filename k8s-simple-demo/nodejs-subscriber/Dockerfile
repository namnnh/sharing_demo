FROM node:16
WORKDIR /app
COPY subscriber.js .
RUN npm install mqtt mongodb
CMD ["node", "subscriber.js"]