FROM node:18 as build
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN ["yarn", "install"]
# Next build breaks without this.
# https://nextjs.org/docs/messages/sharp-missing-in-production
RUN ["yarn", "add", "sharp"]
COPY tsconfig.json .
COPY src/ src
COPY locales/ locales
COPY next-env.d.ts .
COPY next.config.js .
COPY postcss.config.js .
COPY public/ public
COPY tailwind.config.js .
RUN ["yarn", "build"]
RUN ["yarn", "export"]

FROM node:18 as run
WORKDIR /app
EXPOSE 3000

COPY package.json.prod package.json
RUN ["yarn", "install", "--production"]

COPY --from=build /app/out out

CMD ["yarn", "start"]
