const Intern = require("../models");
const User = require("../models/userModel")
const sendEmail = require("../services/mailer");
const formSubmissionEmail = require("../templates/formSubmissionEmail");
const  errorHandler  = require("../utils/error");
const ErrorResponse = require("../utils/errorResponse");
const filterObj = require("../utils/filterObj")
const bcryptjs = require("bcrypt")
const jwt = require('jsonwebtoken')



exports.addIntern = async (req, res, next) => {
    const filteredBody = await filterObj(
        req.body,
        "surname",
        "firstName",
        "middleName",
        "gender",
        "dateofbirth",
        "stateoforigin",
        "address",
        "email",
        "institution",
        "course",
        "level",
        "firstInternship",
        "internshipDetails",
        "reasonitems",
        "interest",
        "explainInterest",
        "skills",
        "expectations",
    );
 // to check if a verified intern with given intern id exists
  const intern = await Intern.findOne({email: req.body.email})
  try {
    if(intern){
      return next(
        new ErrorResponse("Internship already applied for", 400)
      );
    }
    // adding the intern to the database if the intern email doesm't exist
    const newIntern = await Intern.create(filteredBody);

    await newIntern.save({ new: true, validateModifiedOnly: true });
    
    // send form submission email to intern email address
    sendEmail({
        to: newIntern.email,
        subject: "University of Ibadan Internship Application",
        text: formSubmissionEmail(newIntern.firstName)
      });

    return res.status(200).json({
      status: "success",
      message: "Form submission email sent! Check your email",
      email: newIntern.email,
    });
  } catch (error) {
    next(error);
  }
};
exports.getInterns = async (req, res, next) => {
    const {email} = req.query
  try {
    const interns = email ? await Intern.findOne({email: email}): await Intern.find({})

    if (!interns) {
      return next(new ErrorResponse(`Intern${email? "": "s"} not found`, 400));
    }

    res.status(200).json({
      status: "success",
      data: interns,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteIntern = async (req, res, next) => {
  
  try {
    const intern = await Intern.findOneAndDelete({email: req.body.email})
    if (!intern) {
      return next(new ErrorResponse("Intern not found", 400));
    }

    res.status(200).json({
      status: "successfully deleted",
    });
  } catch (error) {
    next(error)
  }
};

exports.signUpAdmin = async (req, res, next)=>{
  const { email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error);
  }
}

exports.signInAdmin = async (req, res, next)=>{
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc; //To remove the password from showing inside the data
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
}


