const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('calculator', { result: null, error: null });
});

app.post('/calculate', (req, res) => {
    const { num1, num2, operation } = req.body;
    
    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);
    
    if (isNaN(number1) || isNaN(number2)) {
        return res.render('calculator', {
            result: null,
            error: 'Please enter valid numbers only! No letters or special characters allowed.',
            num1: num1,
            num2: num2,
            operation: operation
        });
    }
    
    let result;
    let error = null;
    
    try {
        switch (operation) {
            case 'add':
                result = number1 + number2;
                break;
            case 'subtract':
                result = number1 - number2;
                break;
            case 'multiply':
                result = number1 * number2;
                break;
            case 'divide':
                if (number2 === 0) {
                    error = 'Cannot divide by zero! Please enter a different second number.';
                    result = null;
                } else {
                    result = number1 / number2;
                    result = Math.round(result * 100) / 100;
                }
                break;
            default:
                error = 'Please select a valid operation.';
                result = null;
        }
    } catch (err) {
        error = 'Something went wrong! Please try again.';
        result = null;
    }
    
    res.render('calculator', {
        result: result,
        error: error,
        num1: num1,
        num2: num2,
        operation: operation
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kids Calculator is running on http://localhost:${PORT}`);
});
