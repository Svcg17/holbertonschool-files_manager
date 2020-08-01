const fs = require('fs');
const { ObjectId } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

/** postUpload - controller for route POST /files
  Creates a file or a folder on the path `/temp/files_manager/*` containing data.

   JSON body:
     - name: name of the file
     - type: folder | file | image
     - parentId: id of the parent folder or zero for current folder
     - isPublic: true | false
     - data: base64 encoded string to decode as the file's content
*/
async function postUpload(req, res) {
  const key = req.headers['x-token']; // get token from header
  const userId = await redisClient.get(`auth_${key}`);

  let user = ''; // find connected user
  if (userId) user = await dbClient.client.collection('users').findOne({ _id: ObjectId(userId) });

  const { name } = req.body; // name
  if (!name) res.status(400).json({ error: 'Missing name' });

  const { type } = req.body; // type
  if (!type || !['folder', 'image', 'file'].includes(type)) res.status(400).json({ error: 'Missing type' });

  let path = '/tmp/files_manager'; // create file/folder in this path
  const parentId = req.body.parentId || 0; // parentId
  if (parentId !== 0) {
    const parentFile = await dbClient.client.collection('files').findOne({ _id: ObjectId(parentId) });
    if (!parentFile) {
      res.status(400).json({ error: 'Parent not found' });
      return;
    } if (parentFile.type !== 'folder') {
      res.status(400).json({ error: 'Parent is not a folder' });
      return;
    } path = parentFile.localPath;
  }

  const isPublic = req.body.isPublic || false; // isPublic

  let { data } = req.body; // data
  if (!data && type !== 'folder') res.status(400).json({ error: 'Missing data' });
  else if (data) data = Buffer.from(data, 'base64').toString(); // decode data

  const file = uuidv4();
  path += `/${file}`;

  // check if /tmp/files_manager exists, if not create it
  if (!fs.existsSync('/tmp/files_manager')) fs.mkdirSync('/tmp/files_manager');
  else console.log('exists');

  if (type === 'folder') fs.mkdirSync(path);
  else fs.writeFileSync(path, data);

  // save document on db
  const docFile = await dbClient.client.collection('files').insertOne({
    userId: user._id, name, type, isPublic, parentId, localPath: path,
  });
  if (docFile) {
    res.json({
      id: docFile.ops[0]._id, userId: docFile.ops[0].userId, name, type, isPublic, parentId,
    });
  }
}

module.exports = { postUpload };
