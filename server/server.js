// server.js

const app = require('./index');
const port = 3042;

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
