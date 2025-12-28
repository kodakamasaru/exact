FROM node:22.21.1

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

ENV CI=true

RUN pnpm install --frozen-lockfile

RUN chown -R node:node .

USER node

EXPOSE 3000

CMD ["pnpm", "run", "dev"]
