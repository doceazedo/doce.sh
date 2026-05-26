FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --prod

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN --mount=type=secret,id=env,target=.env pnpm build

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY package.json ./
EXPOSE 3000
CMD ["node", "build"]
