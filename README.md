# University Course Scheduling - Frontend

This repository contains the **frontend** application for the University Course Scheduling project. It is built with React and Typescript and uses a modern stack including [React Query](https://react-query.tanstack.com/), [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/), [MUI](https://mui.com/), [FullCalendar JS](https://fullcalendar.io/), and [Vite](https://vitejs.dev/). The project is also integrated with the [Fuse Admin Panel Template](https://fusetheme.com/) for a responsive admin interface.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Dockerization](#dockerization)
- [Backend Integration](#backend-integration)
- [Environment Variables](#environment-variables)
- [Backend Repository](#backend-repository)

---

## Features

- **Manage Majors:** CRUD operations for academic majors.
- **Manage Classrooms:** Organize and manage classroom details.
- **Manage Courses:** Create, update, delete, and view course information.
- **Manage Professors:** Administer professor profiles and related data.
- **Calendar Views:**
    - **Scheduled Calendar History:** Review past scheduling details.
    - **Full Calendar View:** See the scheduled courses in a comprehensive calendar layout.

---

## Project Structure

This repository is solely for the frontend application. Key directories and files include:

```
/src/app
  ├── main            # Main components and pages for the application
  ├── services        # API service configuration and functions
  ├── hooks           # Custom hooks (including react-query integrations)
  ├── utils           # Utility functions
  ├── App.tsx         # Main application component
```

*Docker configuration files are also provided to containerize the frontend application.*

---

## Installation

### Prerequisites

- **Node.js** (v18 or later)
- **Yarn**

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/devalimotahari/uni-schedule.git
   cd uni-schedule
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root of the project and set the following variable:

   ```env
   VITE_API_URL=<Your Backend API URL>
   ```

   Replace `<Your Backend API URL>` with the URL where your Flask backend is hosted (for example, `http://localhost:5000`).

---

## Running the Application

### Development Mode

After completing the installation steps, run the following command to start the development server:

```bash
yarn dev
```

This command will start the Vite development server. The application will be available at the URL specified by Vite (usually [http://localhost:3000](http://localhost:3000)).

---

## Dockerization

The project is Dockerized so that you can run it in a containerized environment. Note that the frontend and backend run in separate Docker containers.

### Building the Docker Image

From the root of the frontend repository, run:

```bash
docker compose -f docker-compose.yml build
```

### Running the Docker Container

Run the container with:

```bash
docker compose -f docker-compose.yml up
```

---

## Backend Integration

The frontend interacts with the backend via RESTful APIs. Authentication is managed using JWT tokens. The API endpoints and authentication mechanism are configured in the `services` directory.

When making API requests, ensure that:

- The `VITE_API_URL` environment variable points to the correct backend URL.
- JWT tokens are properly stored and sent with API requests (e.g., in the Authorization header).

For more details on how the backend works, refer to the [Backend Repository](https://github.com/amiravtar/uni_schedule_project).

---

## Environment Variables

The following environment variable is required for the frontend:

- `VITE_API_URL` - The base URL of the backend API (e.g., `http://localhost:8000`).

Ensure you have a `.env` file in the project root with this variable set.

---

## Backend Repository

The backend for this project is maintained in a separate repository.  
You can find the backend repository here:

[https://github.com/amiravtar/uni_schedule_project](https://github.com/amiravtar/uni_schedule_project)

This repository contains the Python Flask backend which implements the REST API and JWT authentication.

---

*Happy Coding!*

