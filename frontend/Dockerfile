FROM node:20-alpine

WORKDIR /app
COPY . .
RUN npm install --frozen-lockfile

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
