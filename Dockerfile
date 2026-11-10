# DocLabPharm website + dashboards (Next.js standalone server).
# Build:  docker build -t doclabpharm-web --build-arg NEXT_PUBLIC_API_URL=https://api.doclabpharm.com .
# Run:    docker run -p 3000:3000 doclabpharm-web

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive

FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Browser-facing settings are baked in at build time.
ARG NEXT_PUBLIC_SITE_URL=https://doclabpharm.com
ARG NEXT_PUBLIC_API_URL=https://api.doclabpharm.com
ARG NEXT_PUBLIC_AGORA_APP_ID=
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
ARG NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESETS=
ARG NEXT_PUBLIC_FIREBASE_API_KEY=
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID=
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
ARG NEXT_PUBLIC_FIREBASE_APP_ID=
ARG NEXT_PUBLIC_FIREBASE_VAPID_KEY=
ARG NEXT_PUBLIC_TAWK_TO_PROPERTY_ID=
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
CMD ["node", "server.js"]
