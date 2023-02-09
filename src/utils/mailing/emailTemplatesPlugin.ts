import { Service } from "typedi";
import {
  accountCreationTemplate,
  passwordChangeTemplate,
  userForgetPasswordTemplate,
  contactUsTemplate
} from "./emailTemplates";
import { EmailOptions, EmailTemplate, EmailType } from "../../interfaces";
import { environment } from "../../config";

@Service()
export class EmailTemplatesPlugin {
  private static getHTMLTemplate(
    emailType: EmailType,
    options: EmailOptions,
  ): { html: string; subject: string } {
    return {
      [EmailType.ACCOUNT_CREATION]: {
        html: accountCreationTemplate(options),
        subject: "Welcome to RiverBrand ✅",
      },
      [EmailType.USER_FORGET_PASSWORD]: {
        html: userForgetPasswordTemplate(options),
        subject: "Let's help you get back into RiverBrand",
      },
      [EmailType.PASSWORD_CHANGE]: {
        html: passwordChangeTemplate(options),
        subject: "Password Changed",
      },
      [EmailType.CONTACT_US]: {
        html: contactUsTemplate(options),
        subject: "Contact Us Form",
      },
    }[emailType];
  }

  generateTemplate(emailType: EmailType, options: EmailOptions) {
    const template = EmailTemplatesPlugin.getHTMLTemplate(emailType, options);

    return {
      from: {
        email: environment.mail.from || "support@riverbrand.com",
      },
      to: options.recipient,
      subject: template.subject,
      text: template.subject,
      html: template.html,
    } as EmailTemplate;
  }
}
