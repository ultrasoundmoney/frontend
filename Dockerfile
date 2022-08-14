FROM node:18-alpine as build
WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN ["npm", "install"]
COPY tsconfig.json .
COPY app/ app
COPY locales/ locales
COPY remix.config.js .
COPY remix.env.d.ts .
COPY globals.d.ts .
COPY postcss.config.js .
COPY tailwind.config.js .
COPY public/ public
RUN ["npm", "run", "build"]

FROM node:18-alpine as run
WORKDIR /app
EXPOSE 3000

COPY package.json .
COPY package-lock.json .
RUN ["npm", "install", "--omit=dev"]

COPY --from=build /app/build .
COPY --from=build /app/public .

CMD ["npm", "start"]
