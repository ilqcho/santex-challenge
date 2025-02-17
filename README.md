# Santex Back-end Developer Challenge

This repository contains the solution for the Santex Back-end Developer Hiring Test. The application is built with NestJS, TypeORM, PostgreSQL, and GraphQL, and consumes data from the Football-Data API.

## Requirements

- Docker
- Docker Compose
- Node.js 20 (for local development)

## Database Choice

This project uses **PostgreSQL** as the database management system. The decision to use PostgreSQL was based on the following considerations:

- **Relational Data Structure**: Football-related data, such as competitions, teams, players, and coaches, fits well into a structured relational database.
- **TypeORM Integration**: TypeORM provides seamless integration with PostgreSQL in NestJS, allowing for an efficient and scalable ORM-based approach.
- **Support for JSON**: PostgreSQL supports JSONB columns, which can be useful for storing flexible data structures when needed.
- **Reliable and Scalable**: PostgreSQL is widely used in production environments.

Although PostgreSQL is the default choice, **any SQL or NoSQL database** can be used with the appropriate configuration. If a different database is needed, modify the `TypeORM` configuration in the project.

---

## Libraries and Frameworks Used

### **NestJS**
- Chosen for its modular architecture, dependency injection, and TypeScript support.
- Provides a clean and scalable structure for backend development.

### **GraphQL**
- Enables flexible data fetching, reducing over-fetching and under-fetching of data.
- Well-suited for complex queries, such as retrieving nested relationships (e.g., teams and players).

### **TypeORM**
- Chosen as the ORM for seamless integration with PostgreSQL.
- Provides decorators for entity definition.

### **Docker & Docker Compose**
- Enables easy containerization of the application and database.
- Ensures consistency across different environments.

### **Football-Data API**
- Used as the primary source for importing football-related data.
- Provides real-time information about leagues, teams, and players.

By using these technologies, the project ensures scalability, maintainability, and ease of deployment.


## Running the Application with Docker

Follow these steps to set up and run the application using Docker and Docker Compose.

### 1. Configure environment variables

Create a `.env` file in the root of the project with the following content:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your-database-user
DATABASE_PASSWORD=your-database-password
DATABASE_NAME=your-database-name
FOOTBALL_API_TOKEN=your-api-token-here
```

You can obtain the API token from [football-data.org](https://www.football-data.org/).

### 2. Build and start the containers

Run the following command:

```sh
docker-compose up --build
```

This will:

- Build the Docker images for the application and PostgreSQL.
- Start the application and the PostgreSQL database in separate containers.
- Expose the app on [http://localhost:3000](http://localhost:3000) and PostgreSQL on `localhost:5432`.

### 3. Accessing the application

- Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to access the application.
- If you want to interact with GraphQL, go to [http://localhost:3000/graphql](http://localhost:3000/graphql).

### 4. Stopping the containers

To stop and remove the containers, run:

```sh
docker-compose down
```

If you want to remove the volumes (i.e., the database data as well), use:

```sh
docker-compose down --volumes
```

## Running Locally (Without Docker)

If you prefer to run the application locally without Docker, follow these steps:

### 1. Install dependencies

First, make sure you have Node.js installed. Then, install the required dependencies:

```sh
npm install
```

### 2. Configure environment variables

Create a `.env` file in the root of the project (as mentioned earlier), and make sure the environment variables are set correctly.

### 3. Start PostgreSQL locally

Make sure you have PostgreSQL installed locally. You can download it from [here](https://www.postgresql.org/download/).

Start the PostgreSQL service and make sure it's running on the port you configured (`5432` by default).

### 4. Run the application

Run the following command to start the application locally:

```sh
npm run start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### 5. Accessing the application

- Open your browser and go to [http://localhost:3000](http://localhost:3000) to see the application.
- To interact with GraphQL, visit [http://localhost:3000/graphql](http://localhost:3000/graphql).

## GraphQL Queries & Mutations

Here are some example **mutations** and **queries** that you can execute in the GraphQL Playground ([http://localhost:3000/graphql](http://localhost:3000/graphql)).

### Example Mutation: Import League

```graphql
mutation {
  importLeague(input: { leagueCode: "ELC" }) {
    id
    code
    name
    areaName
    teams {
      id
      name
      tla
    }
  }
}
```

### Example Query: Get Players from a Specific Team

```graphql
query {
  getPlayers(leagueCode: "PL", teamName: "Chelsea FC") {
    name
    position
    dateOfBirth
    nationality
    team {
      name
    }
  }
}
```

### Example Query: Get Team Details

```graphql
query {
  getTeam(teamName: "Chelsea FC") {
    id
    name
    tla
    shortName
    areaName
    address
    players {
      id
      name
      position
      nationality
    }
  }
}
```

## Data Model

You can view the database schema online at:  
🔗 [Database Schema](https://dbdiagram.io/d/santex-db-67b38146263d6cf9a077d41f)

