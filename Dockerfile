# Install dependencies only when needed
FROM node:16.13.0-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

RUN apk add --no-cache libc6-compat
WORKDIR /var/www
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16.13.0-alpine AS builder
WORKDIR /var/www
COPY . .
COPY --from=deps /var/www/node_modules ./node_modules
RUN yarn build && yarn storybook:build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:16.13.0-alpine AS runner
WORKDIR /var/www

ENV NODE_ENV production

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /var/www/next.config.js ./
COPY --from=builder /var/www/public ./public
COPY --from=builder /var/www/.next ./.next
COPY --from=builder /var/www/node_modules ./node_modules
COPY --from=builder /var/www/package.json ./package.json
COPY --from=builder /var/www/docs ./docs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1
 
CMD ["yarn", "start"]
