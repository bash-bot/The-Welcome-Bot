const db = require('./lib/schema').models;

module.exports = (robot) => {

  robot.log('Yay, the app was loaded!')

  robot.on('issues.opened', async context => {

    db.User.findOne({
      where: {
        username: context.payload.sender.login,
        repositoryName: context.payload.repository.full_name
      }
    }).then(function (user) {
      if (user === null) {
        db.User.create({
          username: context.payload.sender.login,
          repositoryName: context.payload.repository.full_name
        }).then(async user => {
          try {
            const config = await context.config('config.yml');
            if (config.welcomeMessage) {
              context.github.issues.createComment(context.issue({body: config.welcomeMessage}))
            }
          } catch (err) {
            if (err.code !== 404) {
              throw err;
            }
          }


        }).catch(function (err) {
          console.log(err);
        })
      }
    }).catch(function (err) {
      console.log(err);
    })


  })
  robot.on('issue_comment.created', async context => {

    db.User.findOne({
      where: {
        username: context.payload.comment.user.login,
        repositoryName: context.payload.repository.full_name
      }
    }).then(function (user) {
      if (user === null) {
        db.User.create({
          username: context.payload.comment.user.login,
          repositoryName: context.payload.repository.full_name
        }).then(user => {

          try {
            const config = context.config('config.yml');
            if (config.welcomeMessage) {
              return context.github.issues.createComment(context.issue({body: config.welcomeMessage}))
            }
          } catch (err) {
            if (err.code !== 404) {
              throw err;
            }
          }


        }).catch(function (err) {
          console.log(err);
        })
      }
    }).catch(function (err) {
      console.log(err);
    })
  })
  robot.on('pull_request.opened', async context => {

    db.User.findOne({
      where: {
        username: context.payload.sender.login,
        repositoryName: context.payload.repository.full_name
      }
    }).then(function (user) {
      if (user === null) {
        db.User.create({
          username: context.payload.sender.login,
          repositoryName: context.payload.repository.full_name
        }).then(user => {

          try {
            const config = context.config('config.yml');
            if (config.welcomeMessage) {
              return context.github.issues.createComment(context.issue({body: config.welcomeMessage}))
            }
          } catch (err) {
            if (err.code !== 404) {
              throw err;
            }
          }

        }).catch(function (err) {
          console.log(err);
        })
      }
    }).catch(function (err) {
      console.log(err);
    })
  })


}