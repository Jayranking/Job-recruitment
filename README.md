# Job Recruitment Website

**Project Description**

This Job Recruitment Website simplifies the recruitment process for organizations. The platform allows the admin to publish job listings, and users can apply for jobs online. After the application process, successful candidates are notified via email with login credentials to take a Computer-Based Test (CBT). The admin can view exam results and send appointment letters to qualified candidates.

**Features**

**Admin Panel:**

1. Publish job listings.
2. Notify successful applicants through email.
3. Generate login credentials for applicants to access the CBT.
4. View and manage exam results.
5. Send appointment letters to qualified candidates.

**User Functionality:**

1. Browse and apply for jobs.
2. Receive email notifications if shortlisted for an exam.
3. Log in using the provided credentials to take a CBT.

**Technology Stack**

1. Backend: Node.js, Express.js
2. Frontend: EJS (Embedded JavaScript templates)
3. Database: MongoDB

**Installation and Setup**

1. Clone the repository: *git clone https://github.com/Jayranking/Job-recruitment.git*
2. Navigate to the project directory: *cd Job-recruitment*
3. Install the dependencies: *npm start*
4. Set up environment variables in a .env file:
   
     APP_PORT = 5001

      DB_URI = mongodb://127.0.0.1:27017/job-recruitment

      TOKEN_SECRET = ""

     ===Email config===
 
    EMAILFROM = ''

    EMAIL_KEY = ''








