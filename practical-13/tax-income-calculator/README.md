# Tax Income Calculator

A simple Express.js web application for calculating total income from two sources, built with EJS templates and server-side validation.

## Features

- Clean, user-friendly interface
- Server-side input validation
- POST request handling
- EJS templating
- Responsive design
- Error handling and display
- Formatted currency output

## Installation

1. Navigate to the project directory:
   ```bash
   cd tax-income-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser and go to:
   ```
   http://localhost:3000
   ```

3. Enter your income from two sources and click "Calculate Total Income"

## Development

For development with auto-restart:
```bash
npm install -g nodemon
npm run dev
```

## Project Structure

```
tax-income-calculator/
├── app.js              # Main Express application
├── package.json        # Project dependencies and scripts
├── README.md          # Project documentation
├── views/
│   └── index.ejs      # EJS template for the form and results
└── public/
    └── styles.css     # CSS styles for the application
```

## Technologies Used

- Node.js
- Express.js
- EJS (Embedded JavaScript templates)
- CSS3
- HTML5

## License

ISC
