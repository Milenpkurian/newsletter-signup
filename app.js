const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const port = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  // console.log(firstName, lastName, email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/3677b48e88";
  const options = {
    method: "POST",
    auth: "M:2623a2bd7a51d2034dee831d21f7cf37-us21",
  };

  var responseData = {};
  const request = https.request(url, options, (response) => {
    let data = "";

    // Collect all response data
    response.on("data", (chunk) => {
      data += chunk;
    });

    // Process the collected data
    response.on("end", () => {
      responseData = JSON.parse(data);

      // Check if Success
      if (response.statusCode === 200 && responseData.error_count == 0)
        res.sendFile(__dirname + "/success.html");
      else {
        res.sendFile(__dirname + "/failure.html");
        console.log(responseData);
      }
    });
  });

  request.write(jsonData);
  request.end();
});

app.get("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Export the app for it to be run as a serverless function.
module.exports = app;

// Add a start script to package.json file in order to run the application locally.
// "start": "node app.js"
