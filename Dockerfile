FROM neuvector/docs_base:latest

COPY . /var/www/html

RUN chown -R www-data /var/www/html && chgrp -R www-data /var/www/html