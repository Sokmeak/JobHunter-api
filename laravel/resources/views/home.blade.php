<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>JobHunter - Your Gateway to Dream Jobs</title>
    <!-- Bootstrap CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- Custom CSS -->
    <style>
        body {
            font-family: 'Arial', sans-serif;
        }
        .hero-section {
          
            height: 500px;
            display: flex;
            align-items: center;
            justify-content: center;
           
            text-align: center;
        }
        .hero-section h1 {
            font-size: 3.5rem;
            font-weight: bold;
        }
        .hero-section p {
            font-size: 1.5rem;
        }
        .features-section {
            padding: 60px 0;
        }
        .feature-card {
            text-align: center;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            margin-bottom: 20px;
            transition: transform 0.3s ease;
        }
        .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .feature-card i {
            font-size: 3rem;
            color: #007bff;
            margin-bottom: 20px;
        }
        .footer {
            background-color: #343a40;
            color: white;
            padding: 20px 0;
            text-align: center;
        }
    </style>
</head>
<body>

    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="#">JobHunter</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#features">Features</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#about">About</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#contact">Contact</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link btn btn-primary text-white" href="/login">Login</a>
                </li>
            </ul>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="hero-section">
        <div>
            <h1>Welcome to JobHunter</h1>
            <p>Your Gateway to Dream Jobs and Top Talent</p>
            <a href="/register" class="btn btn-primary btn-lg">Get Started</a>
        </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="container features-section">
        <h2 class="text-center mb-5">Why Choose JobHunter?</h2>
        <div class="row">
            <!-- Job Seeker Features -->
            <div class="col-md-4">
                <div class="feature-card">
                    <i class="fas fa-user-tie"></i>
                    <h3>For Job Seekers</h3>
                    <p>Create a profile, apply for jobs, track applications, and get career insights tailored to your skills and experience.</p>
                    <a href="/job-seeker" class="btn btn-outline-primary">Learn More</a>
                </div>
            </div>
            <!-- Employer Features -->
            <div class="col-md-4">
                <div class="feature-card">
                    <i class="fas fa-building"></i>
                    <h3>For Employers</h3>
                    <p>Post jobs, manage applications, schedule interviews, and find the best talent for your organization.</p>
                    <a href="/employer" class="btn btn-outline-primary">Learn More</a>
                </div>
            </div>
            <!-- Admin Features -->
            <div class="col-md-4">
                <div class="feature-card">
                    <i class="fas fa-cogs"></i>
                    <h3>For Admins</h3>
                    <p>Manage users, moderate content, and ensure the platform runs smoothly and securely.</p>
                    <a href="/admin" class="btn btn-outline-primary">Learn More</a>
                </div>
            </div>
        </div>
    </div>

    <!-- About Section -->
    <div id="about" class="container my-5">
        <h2 class="text-center mb-5">About JobHunter</h2>
        <div class="row">
            <div class="col-md-6">
                <h3>Our Mission</h3>
                <p>JobHunter is designed to bridge the gap between job seekers and employers, providing a seamless and efficient hiring process. Whether you're looking for your dream job or the perfect candidate, JobHunter has you covered.</p>
            </div>
            <div class="col-md-6">
                <h3>How It Works</h3>
                <ul>
                    <li><strong>Job Seekers:</strong> Create a profile, search for jobs, and apply with ease.</li>
                    <li><strong>Employers:</strong> Post jobs, manage applications, and hire top talent.</li>
                    <li><strong>Admins:</strong> Ensure the platform is secure, functional, and user-friendly.</li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 JobHunter. All rights reserved.</p>
            <p>Follow us on:
                <a href="#" class="text-white mx-2"><i class="fab fa-facebook"></i></a>
                <a href="#" class="text-white mx-2"><i class="fab fa-twitter"></i></a>
                <a href="#" class="text-white mx-2"><i class="fab fa-linkedin"></i></a>
            </p>
        </div>
    </footer>

    <!-- Bootstrap JS and dependencies -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>