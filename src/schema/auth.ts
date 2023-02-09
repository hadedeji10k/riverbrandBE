export const signUpSchema = {
  type: "object",
  additionalProperties: false,
  required: ["email", "phone", "first_name", "username", "last_name", "password", "country_code"],
  properties: {
    email: { type: "string" },
    phone: { type: "string" },
    first_name: { type: "string" },
    username: { type: "string" },
    last_name: { type: "string" },
    password: { type: "string" },
    country_code: { type: "string" },
    user_referral_code: { type: "string" },
  },
  errorMessage: {
    required: {
      email: "Email is required",
      phone: "Phone number is required",
      first_name: "First name is required",
      username: "Username is required",
      last_name: "Last name is required",
      password: "Password is required",
      country_code: "Country Code is required"
    },
  },
};

export const signInSchema = {
  type: "object",
  additionalProperties: false,
  required: ["email", "password"],
  properties: {
    email: { type: "string" },
    password: { type: "string" },
    captchaToken: { type: "string" },
  },
  errorMessage: {
    required: {
      email: "Email is required",
      password: "Password is required",
    },
  },
};

export const requestForgotPasswordSchema = {
  type: "object",
  additionalProperties: false,
  required: ["email"],
  properties: {
    email: { type: "string" },
  },
  errorMessage: {
    required: {
      email: "Email is required",
    },
  },
};

export const resetForgotPasswordSchema = {
  type: "object",
  additionalProperties: false,
  required: ["email", "otpCode", "password"],
  properties: {
    email: { type: "string" },
    otpCode: { type: "string" },
    password: { type: "string" },
  },
  errorMessage: {
    required: {
      email: "Email is required",
      otpCode: "OTP code is required",
      password: "Password is required",
    },
  },
};

export const changePasswordSchema = {
  type: "object",
  additionalProperties: false,
  required: ["email", "oldPassword", "newPassword"],
  properties: {
    email: { type: "string" },
    oldPassword: { type: "string" },
    newPassword: { type: "string" },
  },
  errorMessage: {
    required: {
      email: "Email is required",
      oldPassword: "Old Password is required",
      newPassword: "New Password is required",
    },
  },
};

export const requestEmailConfirmationSchema = {
  type: "object",
  additionalProperties: false,
  required: ["email"],
  properties: {
    email: { type: "string" },
  },
  errorMessage: {
    required: {
      email: "Email is required",
    },
  },
};

export const completeEmailConfirmationSchema = {
  type: "object",
  additionalProperties: false,
  required: ["email", "otpCode"],
  properties: {
    email: { type: "string" },
    otpCode: { type: "string" },
  },
  errorMessage: {
    required: {
      email: "Email is required",
      otpCode: "OTP code is required",
    },
  },
};

export const contactUsSchema = {
  type: "object",
  additionalProperties: false,
  required: ["email", "name", "message"],
  properties: {
    email: { type: "string" },
    name: { type: "string" },
    message: { type: "string" },
  },
  errorMessage: {
    required: {
      email: "Email is required",
      name: "Name is required",
      message: "Message is required",
    },
  },
};
