# Me-API Playground Project 

Link to the deployed website
https://candidate-profile.onrender.com

## Architecture

1. Technologies Used-
    PostgreSQL as the relational database storing structured data.
    Node.js and Express for the backend RESTful API server handling business logic, API routing, and database queries.
    React for the frontend UI, delivering a dynamic, responsive single-page application (SPA).
    Render platform to deploy frontend, backend, and database separately, enabling scalable and independent management.

2. Frontend-Backend Interaction-
    The React frontend consumes the backend API using HTTP requests (e.g., fetch or axios).
    The backend exposes RESTful endpoints where the frontend sends minimal queries to fetch or update data.
    This separation allows the frontend to remain lightweight, rendering the data it receives without heavy processing or complex queries.
    Backend interfaces with PostgreSQL for data persistence and handles CRUD operations securely.

3. Design Patterns and Architectural Highlights-
    Separation of Concerns: Frontend and backend are deployed and operate separately, improving maintainability and scalability.
    API-Driven Architecture: Backend is designed as an API service accessed by the frontend via HTTP.
    Minimal Querying on Frontend: The frontend mainly focuses on display logic; the backend handles all data manipulation and querying.
    Use of Declarative UI Components (React): Facilitates reusable and manageable UI elements.
    Stateless API: Backend APIs don’t maintain client state, enabling easier scaling.
    Render for Deployment: Hosting services on Render simplifies deployment pipeline, with each component deployable independently.

## Setup

### Local Setup
1. Clone the repo
   Run git clone [<repository-url>](https://github.com/Hparth67/CANDIDATE-PROFILE-PROJECT.git) to clone the project repository locally.
2. Install dependencies
   Navigate to the backend directory and run npm install to install backend dependencies.
   Navigate to the frontend directory and run npm install to install frontend dependencies.
3. Run the backend
   In the backend directory, start the server using npm start or npm run dev (if using nodemon).
4. Run the frontend
   In the frontend directory, start the React development server using npm start.

### Production Setup
1. Deployment guide
   Backend, frontend, and PostgreSQL database are deployed separately on Render.
   Push your code to version control (e.g., GitHub) connected to Render for automatic deployments or manually trigger deployments on Render.
2. Environment variables
   Set environment variables in Render settings for each service:
    Backend: Database connection URL, port, JWT secret (if in future applied), etc.
    Frontend: API base URL pointing to backend deployment.
    Database: Credentials and connection info as provided by Render PostgreSQL service.
3. Build commands
   Backend: Usually no build required, just npm install and run the server. Optionally use npm run build if using Babel or TypeScript.
   Frontend: Run npm run build to create production-ready static files for React app. These files are served via a static hosting service or CDN.

## Database Schema

Schema Description
Entities and Attributes
Profile
id (Primary Key)
name (String)
email (String)
education (Text)

Represents the main user or person profile.

Skill
id (Primary Key)
profileId (Foreign Key referencing Profile.id)
name (String)

Represents skills related to a Profile; each Profile can have multiple skills.

Project
(Not explicitly defined here, but assumed similar relation to Profile with profileId FK)
Represents projects associated with a Profile; multiple projects per Profile.

Work
id (Primary Key)
profileId (Foreign Key referencing Profile.id)
company (String)
role (String)
from_date (Date)
to_date (Date)
description (Text)

Represents professional work experiences, many per Profile.

Links
id (Primary Key)
profileId (Foreign Key referencing Profile.id)
github (Text)
linkedin (Text)
portfolio (Text)

Stores external links, one per Profile.

Relationships

One-to-Many from Profile to Skill, Project, and Work
One-to-One from Profile to Links

Foreign key constraints are on profileId with CASCADE delete (deleting a Profile deletes related entries).

ER Diagram Description (Textual)
Profile (PK: id)

1 --- * Skills (FK: profileId)

1 --- * Projects (FK: profileId)

1 --- * Work (FK: profileId)

1 --- 1 Links (FK: profileId)

The Profile is the central entity linking to:
Multiple Skills, Projects, and Work entries through foreign keys.
A single Links entry per Profile.

## API Samples / Postman Collection
[Download Report](./API-playground.postman_collection.json)


## Known Limitations
Faced issue in developing multiple pages and components because of time constraint.
