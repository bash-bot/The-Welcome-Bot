const db = require('./lib/schema').models;

module.exports = (robot) => {

  robot.log('Yay, the app was loaded!')

  robot.on('issues.opened', async context => {

    let username = context.payload.sender.login
      , repositoryName = context.payload.repository.full_name;

    checkUser(username, repositoryName, issueOpen)

  })

  robot.on('issue_comment.created', async context => {

    let username = context.payload.comment.user.login
      , repositoryName = context.payload.repository.full_name;

    checkUser(username, repositoryName, issueComment)

  })

  robot.on('pull_request.opened', async context => {

    let username = context.payload.sender.login
      , repositoryName = context.payload.repository.full_name;

    checkUser(username, repositoryName, prOpen)

  })

  function checkUser(username, repositoryName, botCommentFunction) {
    db.User.findOne({
      where: {
        username: username,
        repositoryName: repositoryName
      }
    }).then(function (user) {
      if (user === null) {
        db.User.create({
          username: username,
          repositoryName: repositoryName
        }).then(botCommentFunction)
          .catch(function (err) {
            console.log(err);
          })
      }
    }).catch(function (err) {
      console.log(err);
    })
  }

  async function issueOpen(context) {
    try {
      const config = await context.config('config.yml');
      let message = config.issueOpen || config.welcomeMessage;
      if (message) {
        return context.github.issues.createComment(context.issue({body: message}))
      } else {
        return context.github.issues.createComment(context.issue({body: "Hello World! Welcome to this project."}))
      }
    } catch (err) {
      if (err.code !== 404) {
        throw err;
      }
    }
  }

  async function issueComment(context) {
    try {
      const config = await context.config('config.yml');
      let message = config.issueComment || config.welcomeMessage;
      if (message) {
        return context.github.issues.createComment(context.issue({body: message}))
      } else {
        return context.github.issues.createComment(context.issue({body: "Hello World! Welcome to this project."}))
      }
    } catch (err) {
      if (err.code !== 404) {
        throw err;
      }
    }
  }

  async function prOpen(context) {
    try {
      const config = await context.config('config.yml');
      let message = config.prOpen || config.welcomeMessage;
      if (message) {
        return context.github.issues.createComment(context.issue({body: message}))
      } else {
        return context.github.issues.createComment(context.issue({body: "Hello World! Welcome to this project."}))
      }
    } catch (err) {
      if (err.code !== 404) {
        throw err;
      }
    }
  }

}
