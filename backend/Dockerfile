# Backend Dockerfile (Node.js + Express)
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# Install dependencies (no dev deps). Using npm install since no lockfile is present.
COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy source
COPY src ./src

# Do not bake environment secrets (.env) into the image.

EXPOSE 3000

RUN chown -R node:node /app

USER node

CMD ["node", "src/server.js"]
