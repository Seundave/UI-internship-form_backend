const Intern = require("../models");
const sendEmail = require("../services/mailer");
const formSubmissionEmail = require("../templates/formSubmissionEmail");
const ErrorResponse = require("../utils/errorResponse");
const filterObj = require("../utils/filterObj")

const sendSuccessMessage = (message, res, other) => {
  return res.status(200).json({
    status: "success",
    message: message,
    ...other,
  });
};


exports.addIntern = async (req, res, next) => {
    const filteredBody = await filterObj(
        req.body,
        "surname",
        "firstName",
        "middleName",
        "gender",
        "date",
        "state",
        "address",
        "email",
        "institution",
        "course",
        "level",
        "firstInternship",
        "internshipDetails",
        "reason",
        "interest",
        "explainInterest",
        "skills",
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

    return sendSuccessMessage(
      "Form submission email sent! Check your email",
      res,
      {
        email: newIntern.email,
      }
    );
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


