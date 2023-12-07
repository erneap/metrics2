### Stage 1: Build ###
FROM node:20.10.0-bookworm as build
WORKDIR /app
COPY ./ /app/
RUN npm install
RUN npm run build

### Stage 2: Run ###
FROM nginx:1.25.3-alpine3.18
RUN mkdir -p /usr/share/nginx/html/metrics
ADD . /data/reports
COPY --from=build /app/dist/client /usr/share/nginx/html/metrics/
COPY --from=build /app/clientHelp /usr/share/nginx/html/metrics/clientHelp
COPY --from=build /app/metrics.conf /etc/nginx/conf.d/metrics.conf
EXPOSE 8080