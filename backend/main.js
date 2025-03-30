const express = require('express');
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors());


const routers = require("./routers/v1/routes");
app.use("/api/v1", routers)

const port = 8080
app.listen(port, () => {
    console.log('Listening on port ' + port)
    console.log('Proc CWD ' + process.cwd())
})