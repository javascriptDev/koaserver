FROM ubuntu
MAINTAINER 627535440@qq.com

ENV env         dist
ENV jsserver    /
ENV imageserver /
#cmd
RUN apt-get update
RUN apt-get -y install redis-server mongodb wget npm

USER root
RUN mkdir /root/app

#add file to docker container
ADD ./ /root/app
#cd /root
WORKDIR /root/app
RUN mv /root/app/third-party/node /bin/
# install nodehs deps
RUN npm install

#container port
EXPOSE 8080

#app start
CMD ["npm", "start"]