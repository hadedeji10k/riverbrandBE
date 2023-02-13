export enum Message {
  signUpSuccessful = "User sign up successful",
  signInSuccessful = "User sign in successful",
  signInUserNotAdmin = "You are not an admin, sign in using the regular sign in page.",
  passwordOtpSent = "Password reset OTP sent successfully",
  passwordResetSuccessfully = "Password reset successfully",
  passwordChanged = "Password changed successfully",
  emailConfirmationSent = "Email confirmation request sent successfully.",
  emailConfirmed = "Email confirmation successfully.",
  emailNotVerified = "Your email is not verified, kindly verify your email to continue.",
  emailAlreadyConfirmed = "Email has already been confirmed",
  invalidOtp = "Invalid OTP code.",
  otpUsed = "OTP code has been used.",
  otpExpired = "OTP code has expired.",
  userNotFound = "User does not exist.",
  userDashboardFetched = "User dashboard fetched successfully.",
  authenticationRequired = "Authentication required.",
  notAuthorized = "You are not authorized to access this resource.",
  userFound = "User already exists",
  invalidPassword = "The credentials provided is invalid",
  passwordIsSameAsOld = "New password cannot be the same as old your password",
  oldPasswordNotCorrect = "Old password is not correct",
  usernameAlreadyInUse = "Username is already in use",
  phoneExists = "The phone number already exists",
  phoneVerified = "The phone number is already verified",
  profilePicUpdated = "Profile picture set successfully.",
  phoneNumberAdded = "Phone number added. An OTP has been sent to your phone, kindly verify.",
  phoneOtpSent = "An OTP has been sent to your phone, kindly verify.",
  phoneNumberVerified = "Phone number verified successfully.",
  noPinSet = "No transaction pin set.",
  oldTransactionPinIsIncorrect = "Old transaction pin is incorrect.",
  oldSameAsNewTransactionPin = "New transaction pin cannot be same as Old transaction pin.",
  pinAlreadySet = "Transaction pin already set.",
  pinSetSuccessfully = "Transaction pin set successfully.",
  pinUpdateSuccessfully = "Transaction pin updated successfully.",
  pinOtpSent = "Pin reset OTP sent to your email.",
  pinResetSuccessfully = "Transaction pin Reset successfully.",
  userAddressUpdated = "Address updated successfully.",
  userProfileUpdated = "User profile updated successfully.",
  alreadyReferred = "You have been referred already.",
  referralCodeGenerated = "Referral code generated successfully.",
  referralCodeAlreadyGenerated = "You have generated a referral code.",
  referralCodeNotGenerated = "You cannot generate a referral code, you must have at least 50 points.",
  referrerUserDetailsFetched = "Referrer fetched successfully.",
  notReferred = "You were not referred by any user.",
  userReferralsFetched = "Referrals fetched successfully.",
  emailConfirmationRequired = "Email confirmation required",
  phoneConfirmationRequired = "Phone confirmation required",
  userSuspendedSuccess = "User suspended successfully",
  userSuspended = "User has been suspended",
  userEnableSuccess = "User enabled Successfully",
  userAlreadyEnabled = "User already enabled",
  userAlreadySuspended = "User already suspended",
  userFetchedSuccess = "Users fetched successfully",
  usersFetchedSuccess = "Users fetched successfully",
  internalServerError = "An internal server error occurred",
  emailAlreadyRegistered = "Email already registered",
  phoneAlreadyRegistered = "Phone number already registered",
  usernameAlreadyExists = "Username already exists",
  configFetchedSuccessfully = "Config fetched successfully.",
  configSetSuccessfully = "Config set successfully.",
}
