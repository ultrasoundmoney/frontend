FROM node:18-alpine as build
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
ENV NEXT_PUBLIC_ENV=staging
RUN ["yarn", "build"]
RUN ["yarn", "export"]
RUN ["mv", "out", "out-stag"]
ENV NEXT_PUBLIC_ENV=prod
RUN ["yarn", "build"]
RUN ["yarn", "export"]
RUN ["mv", "out", "out-prod"]

FROM node:18-alpine as run
WORKDIR /app
EXPOSE 3000

COPY package.json.prod package.json
RUN ["yarn", "install", "--production"]

COPY --from=build /app/out-stag out-stag
COPY --from=build /app/out-prod out-prod

CMD ["yarn", "start-prod"]
