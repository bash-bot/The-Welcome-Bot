const db = require('./lib/schema').models;

//let arr = ["the-welcome-bot[bot]"]

module.exports = (robot) => {
  robot.log('Yay, the app was loaded!')

  robot.on('issues.opened', async context => {
    const params = context.issue({body: 'Hello World!'})
    // console.log(params)
    // console.log('********')
    // if (arr.indexOf(context.payload.sender.login) !== -1) {
    //   console.log(arr)
    // } else {
    //   arr.push(context.payload.sender.login)
    //   console.log(arr)
    //   return context.github.issues.createComment(params)
    // }

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

          console.log("reach")

          try {
            console.log("reached1")
            const config = await context.config('config.yml');
            console.log("reached2")

            if (config.welcomeMessage) {
              console.log("reached3")

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
     const params = context.issue({body: 'Hello World!'})
    // console.log(context.payload.comment.user.login)
    // // console.log(context.payload.comment.user.login)
    // console.log('********')
    // // console.log(params)
    // if (arr.indexOf(context.payload.comment.user.login) !== -1) {
    //   console.log(arr)
    // } else {
    //   arr.push(context.payload.comment.user.login)
    //   console.log(arr)
    //   return context.github.issues.createComment(params)
    // }

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
    const params = context.issue({body: 'Hello World!'})
    // console.log(context)
    // // console.log(context.payload.comment.user.login)
    // console.log('********')
    // // console.log(params)
    // if (arr.indexOf(context.payload.sender.login) !== -1) {
    //   console.log(arr)
    // } else {
    //   arr.push(context.payload.sender.login)
    //   console.log(arr)
    //   // console.log(context.github)
    //   return context.github.issues.createComment(params)
    // }


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