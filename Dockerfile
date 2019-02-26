FROM node:10-alpine

WORKDIR /home/content
COPY . /home/content
RUN chown -R node:node /home/content
USER node
COPY package*.json /tmp/

RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /home/content/

COPY --chown=node:node . .
EXPOSE 3002

CMD ["npm", "run", "start"]
