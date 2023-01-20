function emailToSecret(email: string) {
  const [username, domainname] = email.split("@");
  const usernameBase64 = Buffer.from(username).toString("base64");
  const domainnameHex = Buffer.from(domainname).toString("hex");

  return Buffer.from(`${usernameBase64}@${domainnameHex}`).toString("base64");
}

export const misc = { emailToSecret };
