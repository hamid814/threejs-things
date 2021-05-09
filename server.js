const express = require('express');

const PORT = 3131;
const publicFolder = 'dist';

const app = express();

app.use(express.static(publicFolder));

app.listen(PORT, () => {
  console.log(`listening on port ` + PORT);
  console.log(`content served from ` + publicFolder);
});
