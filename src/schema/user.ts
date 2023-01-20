export const completeProfileSchema = {
  type: "object",
  additionalProperties: false,
  required: ["username", "interests"],
  properties: {
    username: { type: "string" },
    interests: { type: "array" },
  },
  errorMessage: {
    required: {
      username: "Username is required",
      interests: "Please select some interests",
    },
  },
};

export const setProfilePictureSchema = {
  type: "object",
  additionalProperties: false,
  required: ["imageUrl"],
  properties: {
    imageUrl: { type: "string" },
  },
  errorMessage: {
    required: {
      imageUrl: "ImageURL is required",
    },
  },
};

export const requestPhoneNumberVerificationSchema = {
  type: "object",
  additionalProperties: false,
  required: ["phone", "email"],
  properties: {
    phone: { type: "string" },
    email: { type: "string" },
  },
  errorMessage: {
    required: {
      phone: "Phone number is required",
      email: "Email address is required",
    },
  },
};

export const verifyPhoneNumberSchema = {
  type: "object",
  additionalProperties: false,
  required: ["phoneOtpCode", "email"],
  properties: {
    email: { type: "string" },
    phoneOtpCode: { type: "string" },
  },
  errorMessage: {
    required: {
      email: "Email address is required",
      phoneOtpCode: "OTP code is required",
    },
  },
};

export const updateUserAddressSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    line1: { type: "string" },
    city: { type: "string" },
    state: { type: "string" },
    country: { type: "string" },
  },
};

export const updateUserSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageUrl: { type: "string" },
    interests: { type: "array" },
    username: { type: "string" },
  },
};

export const updateUserPasswordSchema = {
  type: "object",
  additionalProperties: false,
  required: ["oldPassword", "newPassword"],
  properties: {
    oldPassword: { type: "string" },
    newPassword: { type: "string" },
  },
  errorMessage: {
    required: {
      oldPassword: "Old Password is required",
      newPassword: "New Password is required",
    },
  },
};

export const makeUserAdminSchema = {
  type: "object",
  additionalProperties: false,
  required: ["email"],
  properties: {
    email: { type: "string" },
  },
  errorMessage: {
    required: {
      email: "Email address is required",
    },
  },
};

export const suspendUserSchema = {
  type: "object",
  additionalProperties: false,
  required: ["userId"],
  properties: {
    userId: { type: "string" },
  },
  errorMessage: {
    required: {
      userId: "User Id is required",
    },
  },
};

export const unsuspendUserSchema = {
  type: "object",
  additionalProperties: false,
  required: ["userId"],
  properties: {
    userId: { type: "string" },
  },
  errorMessage: {
    required: {
      userId: "User Id is required",
    },
  },
};
