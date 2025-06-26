###############################################################################
#                                                                             
# Project Makefile                                                   
#                                                                             
# This Makefile manages dependencies and startup for both frontend    
# and backend of the project.                                     
#                                                                             
# For more information, run 'make help'                                   
#                                                                             
###############################################################################

# Install the front and back dependencies
deps:
	make depsBack && make depsFront

# Install the backend dependencies
depsBack:
	cd back && pnpm install

# Install the frontend dependencies
depsFront:
	cd webapp && pnpm install

# Start the frontend and backend
start:
	make startBack & make startFront

# Start the frontend and backend WITH DOCKER
startDockerDev:
	docker-compose --file docker-compose.development.yaml -p tic-tac-toe--dev up -d

# Start the frontend and backend WITH DOCKER PRODUCTION
startDockerProd:
	export MY_UID=$(shell id -u);
	docker-compose --file docker-compose.production.yaml -p tic-tac-toe--prod up -d

# Start the backend
startBack:
	cd back && pnpm start:dev

# Start the frontend
startFront:
	cd webapp && pnpm dev

# Prints this help
help:
	@awk ' \
		/^[a-zA-Z_-]+:/ { if (length($$1) - 1 > max) max = length($$1) - 1 } \
		END { max += 5 } \
		/^# / { last = substr($$0, 3) } \
		/^[a-zA-Z_-]+:/ { if (last != "") { name = substr($$1, 1, length($$1) - 1); printf "%-*s -----------> %s\n", max, name, last; last = "" } } \
		' $(MAKEFILE_LIST)