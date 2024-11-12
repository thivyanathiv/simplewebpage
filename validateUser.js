const Joi = require('joi');  // Import Joi

// Joi schema for validating user data
const userSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': '"name" should be a type of "text"',
    'string.min': '"name" should have a minimum length of 3',
    'any.required': '"name" is required'
  }),
  email: Joi.string().email().required().messages({
    'string.base': '"email" should be a type of "text"',
    'string.email': '"email" must be a valid email',
    'any.required': '"email" is required'
  }),

});

// Middleware to validate user data
const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();  // Continue to the next middleware or route handler
};

module.exports = { validateUser };
