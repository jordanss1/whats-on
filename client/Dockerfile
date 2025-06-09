FROM nginxinc/nginx-unprivileged

USER root

RUN apt-get update

USER nginx

WORKDIR /usr/share/nginx/html

COPY --chown=nginx:nginx conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx dist /usr/share/nginx/html

