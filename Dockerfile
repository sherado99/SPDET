FROM apify/actor-node:20
COPY . ./
RUN npm install --quiet --only=prod --no-optional
CMD npm start
