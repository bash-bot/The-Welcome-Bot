const db = require('./lib/schema').models;

module.exports = (robot) => {

  robot.log('Yay, the app was loaded!')

  robot.on('issues.opened', async context => {

    let username = context.payload.sender.login
      , repositoryName = context.payload.repository.full_name;
    console.log("**************************")
    console.log(context)
    if (username !== "the-welcome-bot[bot]")
      checkUser(context, username, repositoryName, "issueOpen")

  })

  robot.on('issue_comment.created', async context => {

    let username = context.payload.comment.user.login
      , repositoryName = context.payload.repository.full_name;

    if (username !== "the-welcome-bot[bot]")
      checkUser(context, username, repositoryName, "issueComment")

  })

  robot.on('pull_request.opened', async context => {

    let username = context.payload.sender.login
      , repositoryName = context.payload.repository.full_name;
    console.log("**************************")
    console.log(context)
    if (username !== "the-welcome-bot[bot]")
      checkUser(context, username, repositoryName, "prOpen")

  })

  function checkUser(context, username, repositoryName, eventType) {
    console.log("**************************")

    console.log(context)
    db.User.findOne({
      where: {
        username: username,
        repositoryName: repositoryName
      }
    }).then(function (user) {
      console.log("**************************")

      console.log(context)
      if (user === null) {
        db.User.create({
          username: username,
          repositoryName: repositoryName
        }).then(async user => {
          try {
            console.log("**************************")
            console.log(context)
            console.log("**************************")

            const config = await context.config('config.yml');
            console.log(config)
            let message;
            if (config) {
              switch (eventType) {
                case "issueOpen":
                  message = config.issueOpen || config.welcomeMessage;
                case "issueComment":
                  message = config.issueComment || config.welcomeMessage;
                case "prOpen":
                  message = config.prOpen || config.welcomeMessage;
              }
            }
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
        })
          .catch(function (err) {
            console.log(err);
          })
      }
    }).catch(function (err) {
      console.log(err);
    })
  }

}
