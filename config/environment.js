const development = {
  name: "authentication",
  session_cookie_key: "blahsomething",
  db: "myFirstDatabase",
  db_pass: "akhil1234",
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "akhilsdevelopment@gmail.com",
      pass: "Akhilesh@07",
    },
  },
  google_client_id:
    "37193647257-tp7truqo6eg15an1ec8b4v0g8g33flct.apps.googleusercontent.com",
  google_client_secret: "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",
  google_call_back_url: "http://localhost:8000/users/auth/google/callback",
  jwt_secret: "authenticate",
};

const production = {
  name: "production",
};

module.exports = development;
