FROM alpine

RUN apk add --no-cache jq

COPY dist /tmp/build

RUN WEB_PATH="/opt/zextras/web/login" \
&& mkdir -p "${WEB_PATH}" \
&& cp -r /tmp/build/* "${WEB_PATH}" \
&& rm -r /tmp/build