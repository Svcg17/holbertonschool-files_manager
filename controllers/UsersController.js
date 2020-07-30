const sha1 = require('sha1');
const dbClient = require('../utils/db');

/**
 * postNew - callback for route POST /users
 * Adds a user to the datbase
 * JSON body in post request:
 *  - email
 *  - password
 */
async function postNew(req, res) {
  const { email } = req.body; // const email = req.body.email;
  const pwd = req.body.password;

  if (!email) res.status(400).send('Missing email');
  if (!pwd) res.status(400).send('Missing password ');

  // check if email already exists in db
  const found = await dbClient.client.collection('users').find({ email }).count();
  if (found > 0) {
    res.status(400).send('Already exist');
    return;
  }
  // encrypt password and insert user in datbase
  const usr = { email, password: sha1(pwd) };
  const user = await dbClient.client.collection('users').insertOne(usr);
  if (user) res.status(201).json({ id: user.ops[0]._id, email: user.ops[0].email });
  else res.status(500).end('Could not create user');
}
module.exports = postNew;
