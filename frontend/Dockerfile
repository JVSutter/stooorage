FROM node:20-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install --frozen-lockfile

ENV PORT 3000

EXPOSE 3000

CMD ["npm", "run", "dev"]
