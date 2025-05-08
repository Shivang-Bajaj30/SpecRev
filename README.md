# ==========================================SpecRev======================================

SpecRev is a web application that allows users to compare motorcycle specifications and features side by side. Built with Flask, this application provides an intuitive interface for motorcycle enthusiasts to make informed decisions when researching different bike models.

## Features

- **Motorcycle Comparison**: Compare two motorcycles side by side with detailed specifications
- **Variety of Bikes**: Search through a comprehensive variety of motorcycles by brand, model, or engine capacity
- **User Authentication**: Register and login using secure authentication
- **Detailed Specifications**: View comprehensive specifications such as engine type, horsepower, fuel efficiency, etc.
- **Secure Passwords**: Store passwords securely using Werkzeug library
- **Variant Selection**: Compare different variants of the same motorcycle model

## Technology Stack

- **Backend**: Python with Flask framework
- **Database**: MySQL, JSON file
- **Frontend**: HTML, CSS, JavaScript
- **Authentication**: Flask session management with password hashing

## Project Structure

```
SpecRev/
├── app.py                 # Main Flask application file
├── config.py              # Database configuration
├── firebaseKey.json       # Firebase configuration (for future integration)
├── static/                # Static assets
│   ├── css/               # CSS stylesheets
│   ├── data/              # JSON data files
│   │   └── bikes.json     # Motorcycle database
│   ├── img/               # Image assets
│   └── js/                # JavaScript files
│       ├── auth.js        # Authentication logic
│       ├── compare.js     # Comparison functionality
│       ├── compare-details.js # Detailed comparison logic
│       ├── dropdown.js    # UI components
│       └── main.js        # Main application logic
└── templates/             # HTML templates
    ├── about.html         # About page
    ├── compare.html       # Comparison page
    ├── index_combined.html # Homepage
    ├── login.html         # Login page
    └── signup.html        # Registration page
```

## Installation


1. Create and activate a virtual environment:
   ```
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   source .venv/bin/activate  # On macOS/Linux
   ```

2. Install dependencies:
   ```
   pip install flask mysql-connector-python werkzeug
   ```

3. Configure the database:
   - Update the database connection details in `config.py`
   - Create a MySQL database named 'test'
   - Create a 'user' table with columns for name, email, and password

4. Run the application:
   ```
   python app.py
   ```

5. Access the application at `http://localhost:5000`

## Database Schema

The application uses a MySQL database with the following structure:

- **user**: Stores user information
  - name: User's full name
  - email: User's email address (unique)
  - pswd: Hashed password

## Future Enhancements

- Add more motorcycles to the json data
- Implement user profiles with saved comparisons
- Implement a rating system for motorcycles
- Saving user preferences
- Adding more functionalities like search filters, sorting options, etc.
- Integration with external APIs for real-time data
- Implement dark mode theme
- Implement responsive design for mobile devices

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.