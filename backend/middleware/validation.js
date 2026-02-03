const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate({
      body: req.body,
      query: req.query,
      params: req.params
    }, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const details = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }));
      
      return res.status(400).json({
        message: 'Validation error',
        details
      });
    }
    
    req.validated = value;
    next();
  };
};

const studentSearchSchema = Joi.object({
  body: Joi.object({}).required(),
  query: Joi.object({
    pin: Joi.string().required(),
    branch: Joi.string().valid('CSE', 'ECE', 'Civil', 'Mech', 'EEE', 'AIML', 'CCN'),
    academicYear: Joi.string()
  }).required(),
  params: Joi.object({}).required()
});

const createStudentSchema = Joi.object({
  body: Joi.object({
    pin: Joi.string().required(),
    branch: Joi.string().valid('CSE', 'ECE', 'Civil', 'Mech', 'EEE', 'AIML', 'CCN').required(),
    academicYear: Joi.string().required(),
    personalInfo: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      dateOfBirth: Joi.date().required(),
      gender: Joi.string().valid('Male', 'Female', 'Other').required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      address: Joi.object({})
    }).required(),
    academicInfo: Joi.object({}),
    attendance: Joi.object({})
  }).required(),
  query: Joi.object({}).required(),
  params: Joi.object({}).required()
});

const loginSchema = Joi.object({
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required()
  }).required(),
  query: Joi.object({}).required(),
  params: Joi.object({}).required()
});

module.exports = {
  validateRequest,
  studentSearchSchema,
  createStudentSchema,
  loginSchema
};
