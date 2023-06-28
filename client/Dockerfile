### Stage 1: Build ###
FROM node:20-bullseye-slim as build
WORKDIR /app
COPY ./ /app/
RUN npm install
RUN npm run build

### Stage 2: Run ###
FROM nginx:latest
RUN mkdir -p /usr/share/nginx/html/metrics
ADD . /data/reports
COPY --from=build /app/dist/client /usr/share/nginx/html/metrics/
COPY --from=build /app/clientHelp /usr/share/nginx/html/metrics/clientHelp
COPY --from=build /app/metrics.conf /etc/nginx/conf.d/metrics.conf
EXPOSE 8080