FROM node:18-alpine
ENV PORT 3000
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Installing dependencies
COPY package*.json /usr/src/app/
COPY prisma ./prisma/
RUN npm install
# Copying source files
COPY . /usr/src/app
# Building app
RUN npm run build
# 👇 copy prisma directory
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
# Running the app
# CMD "npm" "run" "start" - default
CMD [  "npm", "run", "start:migrate:prod" ]