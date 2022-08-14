FROM node:18-alpine as build
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN ["yarn", "install", "--frozen-lockfile"]
COPY tsconfig.json .
COPY src/ src
COPY locales/ locales
COPY next-env.d.ts .
COPY next.config.js .
COPY postcss.config.js .
COPY tailwind.config.js .
COPY public/ public
# Allows us to pass the sentry auth token in GitHub CI
RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
  export SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN)
ENV NEXT_PUBLIC_ENV=stag
RUN ["yarn", "build"]
RUN ["mv", ".next/standalone", "standalone-stag"]
RUN ["mv", ".next/static", "static-stag"]
ENV NEXT_PUBLIC_ENV=prod
RUN ["yarn", "build"]
RUN ["mv", ".next/standalone", "standalone-prod"]
RUN ["mv", ".next/static", "static-prod"]

FROM node:18-alpine as run
WORKDIR /app
ENV NODE_ENV production

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=build /app/next.config.js ./
COPY --from=build /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build /app/standalone-stag ./standalone-stag
COPY --from=build /app/standalone-prod ./standalone-prod
COPY --from=build /app/public ./standalone-stag/public
COPY --from=build /app/public ./standalone-prod/public
COPY --from=build /app/static-stag ./standalone-stag/.next/static
COPY --from=build /app/static-prod ./standalone-prod/.next/static

EXPOSE 3000
CMD ["yarn", "start:stag"]
