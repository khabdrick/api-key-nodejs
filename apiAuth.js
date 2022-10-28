const users = require("./initialData").users;
const MAX = 25;

const genAPIKey = () => {
  //create a base-36 string that contains 30 chars in a-z,0-9
  return [...Array(30)]
    .map((e) => ((Math.random() * 36) | 0).toString(36))
    .join("");
};

const createUser = (_username, req) => {
  let today = new Date().toISOString().split("T")[0];
  let user = {
    _id: Date.now(),
    api_key: genAPIKey(),
    username: _username,
    usage: [{ date: today, count: 0 }],
  };
 
  users.push(user);
  return user;
};

const authenticateKey = (req, res, next) => {
  let api_key = req.header("x-api-key"); //Add API key to headers
  let account = users.find((user) => user.api_key == api_key);
  // find() returns an object or undefined
  if (account) {
    //If API key matches
    //check the number of times the API has been used in a particular day
    let today = new Date().toISOString().split("T")[0];
    let usageCount = account.usage.findIndex((day) => day.date == today);
    if (usageCount >= 0) {
      //If API is already used today
      if (account.usage[usageCount].count >= MAX) {
        //stop if the usage exceeds max API calls
        res.status(429).send({
          error: {
            code: 429,
            message: "Max API calls exceeded.",
          },
        });
      } else {
        //have not hit todays max usage
        account.usage[usageCount].count++;
        console.log("Good API call", account.usage[usageCount]);
        next();
      }
    } else {
      //Push todays's date and count: 1 if there is a past date
      account.usage.push({ date: today, count: 1 });
      //ok to use again
      next();
    }
  } else {
    //Reject request if API key doesn't match
    res.status(403).send({ error: { code: 403, message: "You not allowed." } });
  }
};

module.exports = { createUser, authenticateKey };
