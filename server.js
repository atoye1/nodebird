const app = require('./app');

app.listen(app.get('port'), () => {
  console.log(app.get('port'), 'is up and listening for request');
});
