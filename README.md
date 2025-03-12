# JobHunter Platform

## Overview

JobHunter is a modern job search and recruitment platform designed to connect job seekers with employers, ensuring a smooth and efficient hiring process. It offers essential tools for applicants to find jobs, employers to manage recruitment, and administrators to maintain the platform’s integrity.

## Roles and Responsibilities

### 1. Job Seeker (Client/User)

This role is for individuals looking for jobs. They can create a profile, apply for jobs, track applications, and get career insights.

**Responsibilities:**

- Create and manage a profile (add resume, portfolio, and experience)
- Search for jobs using filters (location, salary, job type, industry)
- Apply for jobs and track application status
- Save favorite jobs for later application
- Schedule and manage interviews (view interview invitations, accept/reject)
- Receive job recommendations based on skills and experience
- Access career tools (salary insights, company reviews, job alerts)

**Main Goal:** Find and apply for jobs easily.

### 2. Company (Employer)

This role is for companies looking to hire talent. Employers can create job postings, manage applications, and track hiring performance.

**Responsibilities:**

- Create and manage job listings (set requirements, deadlines, and visibility)
- View and filter applications (shortlist candidates, reject applicants)
- Schedule interviews and track candidate progress
- Manage company profile (brand, company culture, media, reviews)
- Analyze job performance (track number of applications, views, hiring trends)
- Communicate with job seekers (send notification, interview invites)

**Main Goal:** Find and hire qualified candidates efficiently.

### 3. Admin (Platform Manager)

This role is for platform administrators who manage and oversee JobHunter. They ensure the platform is running smoothly, content is moderated, and users are supported.

**Responsibilities:**

- User management (manage accounts, verify users, suspend accounts if needed)
- Content moderation (review job postings, handle reported content)
- Platform analytics (track user activity, generate reports, analyze trends)
- System configuration (manage settings, notifications)
- Support management (handle user inquiries, disputes, and support tickets) (Optional)

**Main Goal:** Ensure the platform remains secure, functional, and user-friendly.

## Getting Started

### Prerequisites

- Node.js
- npm
- Laravel
- MySQL

## Installation

Follow these steps to set up the JobHunter platform locally:

## Prerequisites

Ensure you have the following installed on your system:

- [PHP](https://www.php.net/) (v8.0 or higher recommended)
- [Composer](https://getcomposer.org/) (PHP dependency manager)
- [MySQL](https://www.mysql.com/) (or MariaDB)
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Laravel](https://laravel.com/) (v10 or higher recommended)

## Steps to Set Up the Project

### 1. Clone the Repository

Run the following command to clone the repository to your local machine:

```bash
   git clone https://github.com/Sokmeak/IP2-Project-C2.git
```

### 2. Navigate to the Project Directory

Move into the project folder:

```bash
cd JobHunter
```

### 3. Install Dependencies

Install all required dependencies using npm:

```bash
npm install
```

### 4. Set Up Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Replace `your_mongodb_connection_string` with your MongoDB connection URI and `your_jwt_secret_key` with a secure secret key for JWT authentication.

### 5. Run the Application

Start the server using the following command:

```bash
npm start
```

The application will be running on [http://localhost:3000](http://localhost:3000) by default.

### 6. Verify the Setup

Open your browser or use a tool like Postman to verify that the server is running. You can test the API endpoints as described in the API Documentation.
