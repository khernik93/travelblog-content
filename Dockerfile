FROM node:11-alpine

RUN apk update && apk add bash
RUN apk update && apk add vim

WORKDIR /home/content
COPY . /home/content
RUN chown -R node:node /home/content
RUN mkdir -p /var/lib/resources ; chown -R node:node /var/lib/resources
USER node
COPY package*.json /tmp/

RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /home/content/

COPY --chown=node:node . .
EXPOSE 3002

CMD ["npm", "run", "start"]
