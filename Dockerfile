FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json .env.production ./
RUN npm ci --legacy-peer-deps

COPY . .

RUN npx prisma generate
RUN npm run build

FROM gcr.io/distroless/nodejs22-debian12 AS final
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts


EXPOSE 3000
CMD ["server.js"]
