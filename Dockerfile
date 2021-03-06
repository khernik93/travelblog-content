FROM node:11-alpine

RUN apk update && apk add bash
RUN apk update && apk add vim

# build tools for native dependencies
RUN apk add --update make gcc g++ python git

# install graphicsmagick from source because install via apk not working
ENV PKGNAME=graphicsmagick
ENV PKGVER=1.3.30
ENV PKGSOURCE=http://downloads.sourceforge.net/$PKGNAME/$PKGNAME/$PKGVER/GraphicsMagick-$PKGVER.tar.lz

# Installing graphicsmagick dependencies
RUN apk add --update lzip \
                     wget \
                     ffmpeg \
                     libjpeg-turbo-dev \
                     libpng-dev \
                     libtool \
                     libgomp && \
    wget $PKGSOURCE && \
    lzip -d -c GraphicsMagick-$PKGVER.tar.lz | tar -xvf - && \
    cd GraphicsMagick-$PKGVER && \
    ./configure \
      --build=$CBUILD \
      --host=$CHOST \
      --prefix=/usr \
      --sysconfdir=/etc \
      --mandir=/usr/share/man \
      --infodir=/usr/share/info \
      --localstatedir=/var \
      --enable-shared \
      --disable-static \
      --with-modules \
      --with-threads \
      --with-gs-font-dir=/usr/share/fonts/Type1 \
      --with-quantum-depth=16 && \
    make && \
    make install && \
    cd / && \
    rm -rf GraphicsMagick-$PKGVER && \
    rm GraphicsMagick-$PKGVER.tar.lz

WORKDIR /home/content
COPY . /home/content
COPY package*.json /tmp/

RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /home/content/

RUN cat bin/crontab > /etc/crontabs/root
RUN chmod +x /home/content/scripts/createThumbImages.js

COPY --chown=node:node . .
EXPOSE 3002

CMD sh bin/run.sh
