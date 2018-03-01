let arr = ['']

module.exports = (robot) => {
    robot.log('Yay, the app was loaded!')

    robot.on('issues.opened', async context => {
        const params = context.issue({body: 'Hello World!'})
        // console.log(params)
        // console.log('********')
        if (arr.indexOf(context.payload.sender.login) !== -1) {
            // cj
        } else {
            arr.push(context.payload.sender.login)
            console.log(arr)
            return context.github.issues.createComment(params)
        }
    })

    robot.on('issue_comment.created', async context => {
        const params = context.issue({body: 'Hello World!'})
        console.log(context.payload.comment.user.login)
        // console.log('********')
        // console.log(params)
        // if (arr.indexOf(context.payload.sender.login) !== -1) {
        //     // cj
        // } else {
        //     arr.push(context.payload.sender.login)
        //     console.log(arr)
        //     return context.github.issues.createComment(params)
        // }
    })


}