FROM fusuf/whatsasena:latest

RUN git clone https://github.com/UltroidWA/Ultroid /root/Ultroid
WORKDIR /root/Ultroid/
ENV TZ=Europe/Istanbul
RUN npm install supervisor -g
RUN yarn install --no-audit
## Ultroid 
CMD ["node", "bot.js"]
