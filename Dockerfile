FROM node:18-alpine as build
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN ["yarn", "install", "--frozen-lockfile", "--ignore-engines"]
COPY tsconfig.json .
COPY locales/ locales
COPY next-env.d.ts .
COPY next.config.js .
COPY postcss.config.js .
COPY tailwind.config.js .
COPY sentry.client.config.ts .
COPY sentry.server.config.ts .
COPY sentry.properties .
COPY src/ src
COPY public/ public
ENV NEXT_PUBLIC_ENV=stag
RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
   --mount=type=secret,id=NEXT_PUBLIC_TAGS \
   --mount=type=secret,id=NEXT_PUBLIC_COMMIT \
   export SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN) && \
   export NEXT_PUBLIC_TAGS=$(cat /run/secrets/NEXT_PUBLIC_TAGS) && \
   export NEXT_PUBLIC_COMMIT=$(cat /run/secrets/NEXT_PUBLIC_COMMIT) && \
   yarn build
RUN ["cp", "-r", ".next/standalone", "/standalone-stag"]
RUN ["cp", "-r", ".next/static", "/static-stag"]
ENV NEXT_PUBLIC_ENV=prod
RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
   --mount=type=secret,id=NEXT_PUBLIC_TAGS \
   --mount=type=secret,id=NEXT_PUBLIC_COMMIT \
   export SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN) && \
   export NEXT_PUBLIC_TAGS=$(cat /run/secrets/NEXT_PUBLIC_TAGS) && \
   export NEXT_PUBLIC_COMMIT=$(cat /run/secrets/NEXT_PUBLIC_COMMIT) && \
   yarn build
RUN ["cp", "-r", ".next/standalone", "/standalone-prod"]
RUN ["cp", "-r", ".next/static", "/static-prod"]

FROM node:18-alpine as run
WORKDIR /app
ENV NODE_ENV production

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=build /app/next.config.js ./
COPY --from=build /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build /standalone-stag ./standalone-stag
COPY --from=build /standalone-prod ./standalone-prod
COPY --from=build /app/public ./standalone-stag/public
COPY --from=build /app/public ./standalone-prod/public
COPY --from=build /static-stag ./standalone-stag/.next/static
COPY --from=build /static-prod ./standalone-prod/.next/static

EXPOSE 3000
CMD ["yarn", "start:stag"]
