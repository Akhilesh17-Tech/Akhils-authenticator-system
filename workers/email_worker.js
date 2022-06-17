const queue = require("../config/kue");
const resetPasswordMailer = require("../mailers/forgot_password_mailer");
// console.log("============ akhilesh");
queue.process("emails", function (job, done) {
  console.log("worker is processing the jobs", job.data);
  resetPasswordMailer.newResetLink(job.data);
  done();
});
