run:
	docker build -t neuvector/docs .
	docker run --rm -it -p 8080:80 -v .:/var/www/html neuvector/docs