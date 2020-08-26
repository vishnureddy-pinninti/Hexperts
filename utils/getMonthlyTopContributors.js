const {
    scores: {
        NEW_ANSWER, UPVOTE_ANSWER, DOWNVOTE_ANSWER, NEW_POST, UPVOTE_POST, DOWNVOTE_POST, NEW_COMMENT, UPVOTE_COMMENT, DOWNVOTE_COMMENT,
    },
} = require('./constants');

const getMonthlyTopContributors = (userMonthlyInfo, Month, Year) =>{
    let monthlyTopContributors = [];
    userMonthlyInfo.forEach(user => {
        let userReputation = user.answers.length * NEW_ANSWER + user.posts.length * NEW_POST;
        let upvotes = 0
        if(user.answerUpvotes && user.answerUpvotes.length != 0){
            upvotes += user.answerUpvotes[0].upvotes;
            userReputation += user.answerUpvotes[0].upvotes * UPVOTE_ANSWER;
        }
        if(user.postsUpvotes && user.postsUpvotes.length != 0){
            upvotes += user.postsUpvotes[0].upvotes;
            userReputation += user.postsUpvotes[0].upvotes * UPVOTE_POST;
        }
        let userMonthlyInfo = {
            _id: user._id,
            name: user.name,
            jobTitle: user.jobTitle,
            email: user.email,
            month: Month,
            year: Year,
            questions: user.questions.length,
            answers: user.answers.length,
            posts: user.posts.length,
            upvotes: upvotes,
            reputation: userReputation,
        }
        monthlyTopContributors.push(userMonthlyInfo);
    });
    monthlyTopContributors.sort( byReputationDesc );
    // userMonthlyInfo.forEach(user => {
    //     if(user.questions && user.questions.length != 0){
    //         user.questions.forEach(question => {
    //             let userMonthlyInfo = monthlyTopContributors.find( x=> x._id == user._id && x.month == question._id.month && x.year == question._id.year);
    //             if(userMonthlyInfo){
    //                 userMonthlyInfo["questions"] = question.questions;
    //                 //console.log("update questions: "+ userMonthlyInfo._id+" "+ userMonthlyInfo.month+" "+ userMonthlyInfo.year);
    //             }
    //             else{
    //                 userMonthlyInfo = {
    //                     _id: user._id,
    //                     name: user.name,
    //                     jobTitle: user.jobTitle,
    //                     month: question._id.month,
    //                     year: question._id.year,
    //                     questions: question.questions,
    //                     answers: 0,
    //                     posts: 0,
    //                     upvotes: 0,
    //                     reputation: 0,
    //                 }
    //                 //console.log("add questions: "+ userMonthlyInfo._id+" "+ userMonthlyInfo.month+" "+ userMonthlyInfo.year);
    //                 monthlyTopContributors.push(userMonthlyInfo);
    //             }
    //         })
    //     }
    //     if(user.answers && user.answers.length != 0){
    //         user.answers.forEach(answer => {
    //             let userMonthlyInfo = monthlyTopContributors.find( x=> x._id == user._id && x.month == answer._id.month && x.year == answer._id.year);
    //             if(userMonthlyInfo){
    //                 userMonthlyInfo["answers"] = answer.answers;
    //                 userMonthlyInfo["reputation"] += answer.answers*NEW_ANSWER;
    //                 //console.log("update answers: "+ userMonthlyInfo._id+" "+ userMonthlyInfo.month+" "+ userMonthlyInfo.year);
    //             }
    //             else{
    //                 userMonthlyInfo = {
    //                     _id: user._id,
    //                     name: user.name,
    //                     jobTitle: user.jobTitle,
    //                     month: answer._id.month,
    //                     year: answer._id.year,
    //                     questions: 0,
    //                     answers: answer.answers,
    //                     posts: 0,
    //                     upvotes: 0,
    //                     reputation: answer.answers*NEW_ANSWER,
    //                 }
    //                 //console.log("add answers: "+ userMonthlyInfo._id+" "+ userMonthlyInfo.month+" "+ userMonthlyInfo.year);
    //                 monthlyTopContributors.push(userMonthlyInfo);
    //             }
    //         })
    //     }
    //     if(user.posts && user.posts.length != 0){
    //         user.posts.forEach(post => {
    //             let userMonthlyInfo = monthlyTopContributors.find( x=> x._id == user._id && x.month == post._id.month && x.year == post._id.year);
    //             if(userMonthlyInfo){
    //                 userMonthlyInfo["posts"] = post.posts;
    //                 userMonthlyInfo["reputation"] += post.posts*NEW_POST;
    //                 //console.log("update posts: "+ userMonthlyInfo._id+" "+ userMonthlyInfo.month+" "+ userMonthlyInfo.year);
    //             }
    //             else{
    //                 userMonthlyInfo = {
    //                     _id: user._id,
    //                     name: user.name,
    //                     jobTitle: user.jobTitle,
    //                     month: post._id.month,
    //                     year: post._id.year,
    //                     questions: 0,
    //                     answers: 0,
    //                     posts: post.posts,
    //                     upvotes: 0,
    //                     reputation: post.posts*NEW_POST,
    //                 }
    //                 //console.log("add posts: "+ userMonthlyInfo._id+" "+ userMonthlyInfo.month+" "+ userMonthlyInfo.year);
    //                 monthlyTopContributors.push(userMonthlyInfo);
    //             }
    //         })
    //     }
    //     if(user.answerUpvotes && user.answerUpvotes.length != 0){
    //         user.answerUpvotes.forEach(answerUpvote => {
    //             let userMonthlyInfo = monthlyTopContributors.find( x=> x._id == user._id && x.month == answerUpvote._id.month && x.year == answerUpvote._id.year);
    //             if(userMonthlyInfo){
    //                 userMonthlyInfo["upvotes"] += answerUpvote.upvotes;
    //                 userMonthlyInfo["reputation"] += answerUpvote.upvotes*UPVOTE_ANSWER;
    //                 //console.log("update answerUpvotes: "+ userMonthlyInfo._id+" "+ userMonthlyInfo.month+" "+ userMonthlyInfo.year);
    //             }
    //             else{
    //                 userMonthlyInfo = {
    //                     _id: user._id,
    //                     name: user.name,
    //                     jobTitle: user.jobTitle,
    //                     month: answerUpvote._id.month,
    //                     year: answerUpvote._id.year,
    //                     questions: 0,
    //                     answers: 0,
    //                     posts: 0,
    //                     upvotes: answerUpvote.upvotes,
    //                     reputation: answerUpvote.upvotes*UPVOTE_ANSWER,
    //                 }
    //                 //console.log("add answerUpvotes: "+ userMonthlyInfo._id+" "+ userMonthlyInfo.month+" "+ userMonthlyInfo.year);
    //                 monthlyTopContributors.push(userMonthlyInfo);
    //             }
    //         })
    //     }
    //     if(user.postsUpvotes && user.postsUpvotes.length != 0){
    //         user.postsUpvotes.forEach(postsUpvote => {
    //             let userMonthlyInfo = monthlyTopContributors.find( x=> x._id == user._id && x.month == postsUpvote._id.month && x.year == postsUpvote._id.year);
    //             if(userMonthlyInfo){
    //                 userMonthlyInfo["upvotes"] += postsUpvote.upvotes;
    //                 userMonthlyInfo["reputation"] += postsUpvote.upvotes*UPVOTE_POST;
    //                 //console.log("update answerUpvotes: "+ userMonthlyInfo._id+" "+ userMonthlyInfo.month+" "+ userMonthlyInfo.year);
    //             }
    //             else{
    //                 userMonthlyInfo = {
    //                     _id: user._id,
    //                     name: user.name,
    //                     jobTitle: user.jobTitle,
    //                     month: postsUpvote._id.month,
    //                     year: postsUpvote._id.year,
    //                     questions: 0,
    //                     answers: 0,
    //                     posts: 0,
    //                     upvotes: postsUpvote.upvotes,
    //                     reputation: postsUpvote.upvotes*UPVOTE_POST,
    //                 }
    //                 //console.log("add answerUpvotes: "+ userMonthlyInfo._id+" "+ userMonthlyInfo.month+" "+ userMonthlyInfo.year);
    //                 monthlyTopContributors.push(userMonthlyInfo);
    //             }
    //         })
    //     }
    // });
    return monthlyTopContributors;
}

function byReputationDesc( a, b ) {
    if ( a.reputation < b.reputation ){
      return 1;
    }
    if ( a.reputation > b.reputation ){
      return -1;
    }
    return 0;
  }

module.exports = getMonthlyTopContributors;