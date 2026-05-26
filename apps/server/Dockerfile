FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json apps/server/
COPY packages/netcode/package.json packages/netcode/
COPY packages/content/package.json packages/content/

RUN pnpm install --frozen-lockfile --filter @boomerang/server...

COPY packages/netcode packages/netcode
COPY packages/content packages/content
COPY apps/server apps/server

RUN pnpm --filter @boomerang/server build

ENV PORT=2567
EXPOSE 2567

CMD ["pnpm", "--filter", "@boomerang/server", "start"]
