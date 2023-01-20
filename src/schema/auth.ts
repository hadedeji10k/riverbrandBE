export const signUpSchema = {
  type: "object",
  additionalProperties: false,
  required: ["fullName", "phone", "email", "password"],
  properties: {
    fullName: { type: "string" },
    phone: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    interest: { type: "string" },
    referralCode: { type: "string" },
  },
  errorMessage: {
    required: {
      email: "Email is required",
      fullName: "Full name is required",
      phone: "Phone number is required",
      password: "Password is required",
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
