const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Tax Income Calculator',
        errors: null,
        data: null,
        result: null 
    });
});

app.post('/calculate', (req, res) => {
    const { income1, income2 } = req.body;
    const errors = [];
    let result = null;

    // Validation
    if (!income1 || income1.trim() === '') {
        errors.push('Primary income source is required');
    } else if (isNaN(income1) || parseFloat(income1) < 0) {
        errors.push('Primary income must be a valid positive number');
    }

    if (!income2 || income2.trim() === '') {
        errors.push('Secondary income source is required');
    } else if (isNaN(income2) || parseFloat(income2) < 0) {
        errors.push('Secondary income must be a valid positive number');
    }

    // If no errors, calculate total
    if (errors.length === 0) {
        const primaryIncome = parseFloat(income1);
        const secondaryIncome = parseFloat(income2);
        const totalIncome = primaryIncome + secondaryIncome;

        result = {
            primaryIncome: primaryIncome,
            secondaryIncome: secondaryIncome,
            totalIncome: totalIncome
        };
    }

    res.render('index', {
        title: 'Tax Income Calculator',
        errors: errors.length > 0 ? errors : null,
        data: { income1, income2 },
        result: result
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Tax income calculator running at http://localhost:${port}`);
});

module.exports = app;
