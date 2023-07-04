const express = require('express');
const app = express();
const PORT = process.env.PORT || 4001;

// Checks if parameter is a valid date
app.param('date', (req, res, next, date) => {
    const reqDate = new Date(date);
    if (/^[0-9]{5,}/.test(date)) { // param is unix timestamp
      req.unixDate = new Date(parseInt(date));
      next();
    } else if (isNaN(reqDate.getTime())) { // param is invalid date
      res.json({error: "Invalid Date"});
    } else { // param is valid date string
      req.date = reqDate;
      next();
    }
});

// An empty date parameter gets the current time
app.get('/api', (req, res) => {
    const date = new Date();
    res.json({
      unix: date.getTime(),
      utc: date.toUTCString()
    });
});

// Get a timestamp
app.get('/api/:date', (req, res) => {
    if (req.unixDate) { // param is unix timestamp
      res.json({
        unix: req.unixDate.getTime(),
        utc: req.unixDate.toUTCString()
      });
    } else { // param is date string
      res.json({
        unix: req.date.getTime(),
        utc: req.date.toUTCString()
      });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});