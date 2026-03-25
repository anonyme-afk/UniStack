# Dockerfile for UniStack
# Based on Node.js official image

# english: build stage
# french: étape de build
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build

# english: final stage
# french: étape finale
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/unistack.config.json ./
COPY --from=builder /usr/src/app/generated ./generated
COPY --from=builder /usr/src/app/src/app.uni ./src/app.uni

EXPOSE 3000
CMD ["node", "dist/cli.js", "dev"]

