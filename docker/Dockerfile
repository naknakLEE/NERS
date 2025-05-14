FROM node:18.20.8-alpine AS base
WORKDIR /app
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8
RUN apk add tzdata && ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

FROM base AS gateway-server
CMD ["npm", "run", "start:gateway-server"]

FROM base AS auth-server
CMD ["npm", "run", "start:auth-server"]

FROM base AS event-server
CMD ["npm", "run", "start:event-server"]
