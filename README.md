Instrucciones para correr el proyecto
Dentro de tu archivo README.md, incluye las siguientes instrucciones para que quien revise el código pueda correr el proyecto fácilmente:

Instalar Docker y Docker Compose
Instalar Docker: El revisor deberá tener Docker y Docker Compose instalados en su máquina. Puedes seguir la guía de instalación de Docker y Docker Compose si no lo tienen instalado.
Correr los contenedores con Docker Compose
Clonar el repositorio:

bash
Copiar
Editar
git clone <repositorio-url>
cd <nombre-del-repositorio>
Construir las imágenes y levantar los contenedores:

bash
Copiar
Editar
docker-compose up --build -d
Esto construirá las imágenes del contenedor y levantará los servicios de NestJS y PostgreSQL en segundo plano.

Verificación
Verificar que todo está corriendo:

Verifica que el contenedor de PostgreSQL y el servidor NestJS estén funcionando con:
bash
Copiar
Editar
docker ps
Deberías ver algo similar a esto:
bash
Copiar
Editar
CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS          PORTS                    NAMES
123456789abc   postgres:13   "docker-entrypoint.s…"   5 minutes ago    Up 5 minutes    0.0.0.0:5432->5432/tcp   santex-challenge-postgres-1
abcdef123456   <your-app>    "docker-entrypoint..."   5 minutes ago    Up 5 minutes    0.0.0.0:3000->3000/tcp   santex-challenge-app-1
Acceder a la aplicación:

Si todo está funcionando, podrás acceder a tu servidor NestJS en http://localhost:3000.
Si tienes un endpoint GraphQL, como mencionamos antes, puedes acceder a http://localhost:3000/graphql.
Manejo de errores
Ver los logs de los contenedores: Si el servidor no responde o hay errores, puedes ver los logs de cada contenedor:
bash
Copiar
Editar
docker logs -f santex-challenge-app-1  # Para NestJS
docker logs -f santex-challenge-postgres-1  # Para PostgreSQL