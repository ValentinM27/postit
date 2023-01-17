build:
	-@docker-compose up --build -d

up:
	-@docker-compose up -d

start:
	-@docker-compose start

stop:
	-@docker-compose stop

clear:
	-@rm -r ./uploads/*.epub
