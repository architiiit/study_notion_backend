# Study Notion Backend
## Dependencies
The following dependencies are required for this project:

- `bcrypt`: ^5.1.1
- `cookie-parser`: ^1.4.7
- `dotenv`: ^16.4.7
- `jsonwebtoken`: ^9.0.2
- `mongoose`: ^8.10.1
- `nodemailer`: ^6.10.0
- `otp-generator`: ^4.0.1

To install these dependencies, run the following command:
```sh
npm install bcrypt@^5.1.1 cookie-parser@^1.4.7 dotenv@^16.4.7 jsonwebtoken@^9.0.2 mongoose@^8.10.1 nodemailer@^6.10.0 otp-generator@^4.0.1
```
## Overview
This project is the backend for the Study Notion application, which provides various educational resources and tools for students.

## Features
- User authentication and authorization
- Secure password management
- Email notifications
- OTP generation for two-factor authentication
- Database management with MongoDB

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/study-notion-backend.git
   ```
2. Navigate to the project directory:
   ```sh
   cd study-notion-backend
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```

### Configuration
1. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   PORT=your_port
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

### Running the Application
Start the server:
```sh
npm start
```

## Usage
- API documentation can be found [here](link_to_api_docs).

## Contributing
Contributions are welcome! Please read the [contributing guidelines](link_to_contributing_guidelines) first.

## License
This project is licensed under the MIT License. See the [LICENSE](link_to_license) file for details.

## Contact
For any inquiries, please contact [your_email@example.com](mailto:your_email@example.com).
