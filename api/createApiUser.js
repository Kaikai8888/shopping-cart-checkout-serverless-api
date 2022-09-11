const { ApiUser} = require('./models')
const bcrypt = require('bcryptjs')
const inquirer = require('inquirer')
const questions = [
  {
    type: 'input',
    name: 'name',
    message: "Api user name: ",
  }, {
    type: 'input',
    name: 'email',
    message: 'Api user email: ',
  }, {
    type: 'input',
    name: 'password',
    message: 'Api user password (>= 8 characters): '
  }
];

async function main() {
  const testUser = await inquirer.prompt(questions)
  if (!testUser.name || !testUser.email || !testUser.password) throw 'Missing name / email / password!'
  const db = require('./config/mongoose')
  db.once('open', async () => {
    try {
      const user = await ApiUser.findOne({ email: testUser.email })
      if (user) throw 'Email has been registered!' 
      testUser.password = bcrypt.hashSync(testUser.password, bcrypt.genSaltSync(10))
      await ApiUser.create(testUser)
      console.log('Successfully create test user')
    } catch (err) {
      console.log('Error occurs: ', err)
    }
    process.exit()
  })
}

main()