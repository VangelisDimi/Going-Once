FROM node
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]