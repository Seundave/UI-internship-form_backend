const mongoose = require("mongoose");

const internSchema = new mongoose.Schema({
  surname: {
    type: String,
    required: [true, "surname is required"],
    trim: true,
  },
  firstName: {
    type: String,
    required: [true, "first name is required"],
    trim: true,
  },
  middleName: {
    type: String,
    required: [true, "middle name is required"],
    trim: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: [true, "gender is required"],
  },
  date: {
    type: Date,
    required: [true, "date is required"],
  },
  state: {
    type: String,
    required: [true, "state is required"],
  },
  address: {
    type: String,
    required: [true, "contact address is required"],
  },

  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },

  institution: {
    type: String,
    required: [true, "institution is required"],
    trim: true
  },
  course: {
    type: String,
    required: [true, "course of study is required"],
    trim: true
  },
  level: {
    type: Number,
    enum: [200, 300, 400],
    required: [true, "level field is required"],
  },
  firstInternship: {
    type: String,
    required: [true, "field is required"],
    trim: true
  },
  internshipDetails: {
    type: {
        year: String,
        company: String,
        duration: Number
    },
  },
  reason: {
    type: String,
    required: [true, "reason of study is required"],
    trim: true
  },
  interest: {
    type: Array,
    required: [true, "interest field is required"],
  },
  explainInterest: {
    type: String,
    required: [true, "explain-interest field is required"],
    trim: true
  },
  skills: {
    type: String,
    required: [true, "skill is required"],
    trim: true
  },
});

const Intern = new mongoose.model("Intern", internSchema);

module.exports = Intern;