const Joi = require("joi");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const BaseController = require("../controllers/BaseController");
const RequestHandler = require("../utils/RequestHandler");
const Logger = require("../utils/logger");
const bcrypt = require("bcryptjs");
const auth = require("../utils/auth");
const email = require("../utils/email");
const { json } = require("body-parser");
const nodemailer = require("nodemailer");

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

const ADMIN = "admin";
const SUPER_ADMIN = "super_admin";

class UsersController extends BaseController {
  static async createUser(req, res) {
    try {
      const reqParam = req.body;
      if (reqParam.type == SUPER_ADMIN) {
        return requestHandler.sendError(
          req,
          res,
          new Error("You are not authorized to perform this action")
        );
      }

      let canCreateAdmin = false;
      if (req.user.type == SUPER_ADMIN) {
        canCreateAdmin = true;
      }

      const schema = {
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        phone_code: Joi.string().required(),
        password: Joi.string().min(6).required(),
        type: Joi.string().valid("sp", "admin").required(),
      };

      const { error } = Joi.validate(reqParam, schema);
      if (error) {
        return requestHandler.sendError(
          req,
          res,
          new Error("Invalid request data")
        );
      }

      if (reqParam.type == ADMIN && !canCreateAdmin) {
        return requestHandler.sendError(
          req,
          res,
          new Error("You are not authorized to perform this action")
        );
      }

      if (
        [ADMIN].includes(reqParam.type) &&
        !reqParam.email.endsWith("@trizhouse.com")
      ) {
        return requestHandler.sendError(
          req,
          res,
          new Error(
            "Admin and Super Admin emails must be on the @trizhouse.com domain"
          )
        );
      }

      const existingUser = await super.getByCustomOptions(req, "users", {
        where: { phone: reqParam.phone, phone_code: reqParam.phone_code },
      });
      if (existingUser) {
        return requestHandler.sendError(
          req,
          res,
          new Error("User with this phone number already exists")
        );
      }

      reqParam.password = await bcrypt.hash(reqParam.password, 10);

      const excludedData = [""];
      const filteredData = _.omit(reqParam, excludedData);
      const newUser = await super.create(req, "users", filteredData);

      await UsersController.sendCredentialsEmail(
        reqParam.email,
        req.body.password
      );

      return requestHandler.sendSuccess(res, "User Created")({ newUser });
    } catch (error) {
      return requestHandler.sendError(req, res, error);
    }
  }

  static async sendCredentialsEmail(email, password) {
    const emailAddress = email;

    const transporter = nodemailer.createTransport({
      host: process.env.ASES_HOST || "email-smtp.us-east-1.amazonaws.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.AWS_ACCESS_KEY_ID,
        pass: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@trizhouse.com",
      to: emailAddress,
      subject: "Super Admin Created",
      text: `Your account has been created. Here are your credentials:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease log in and change your password.`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  static async getUserById(req, res) {
    try {
      const reqParam = req.params.id;

      const schema = Joi.object({
        id: Joi.number().required(),
      });

      const { error } = schema.validate({ id: reqParam });
      requestHandler.validateJoi(error, 400, "Bad Request", "Invalid User ID");

      const result = await super.getById(req, "users", reqParam);

      if (!result) {
        return requestHandler.sendError(req, 404, "User not found");
      }

      const filteredResult = _.omit(result, [
        "to_be_logged_out",
        "password_changed_at",
        "smileid",
        "timezone",
        "deletedAt",
        "new_phone",
        "last_login_ip",
        "password",
        "otp",
        "device_token",
        "password_token",
      ]);

      return requestHandler.sendSuccess(
        res,
        "User Data Extracted"
      )(filteredResult);
    } catch (error) {
      console.error("Error fetching user:", error);
      return requestHandler.sendError(req, res, error);
    }
  }

  static async UpdateUsers(req, res) {
    try {
     
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        console.error("Invalid ID format:", req.params.id);
        return requestHandler.sendError(req, res, new Error("Invalid ID format"), 400);
      }
      const { firstname, lastname } = req.body;
      const schema = Joi.object({
        id: Joi.number().integer().required(),
        firstname: Joi.string().optional().allow(""),
        lastname: Joi.string().optional().allow(""),
      });
  
      const { error } = schema.validate({ id, firstname, lastname });
      if (error) {
        console.error("Validation Error:", error.details);
        return requestHandler.sendError(req, res, new Error("Invalid Request"), 400);
      }
      const existingUser = await super.getById(req, "users", id);
      if (!existingUser) {
        console.error("User not found:", id);
        return requestHandler.sendError(req, res, new Error("User not found"), 404);
      }
      const updateData = {};
      if (firstname !== undefined) updateData.firstname = firstname;
      if (lastname !== undefined) updateData.lastname = lastname;
      const [updateCount] = await super.updateById(req, "users", { id, ...updateData });
      console.log("Update Count:", updateCount);
  
      if (updateCount === 0) {
        console.error("No changes made or user not updated.");
        return requestHandler.sendError(req, res, new Error("No changes made or user not updated"), 400);
      }

      const updatedUser = await super.getById(req, "users", id);
      // console.log("Updated User:", updatedUser);
  
      return requestHandler.sendSuccess(res, "User Updated Successfully", updatedUser);
    } catch (error) {
      console.error("Error updating user:", error.stack);
      return requestHandler.sendError(req, res, new Error("Internal Server Error"), 500);
    }
  }
  
  

  static async deleteById(req, res) {
    try {

      const id = parseInt(req.params.id, 10);
  
      if (isNaN(id)) {
        console.error("Invalid ID format:", req.params.id);
        return requestHandler.sendError(req, res, new Error("Invalid ID format"), 400);
      }
  
      const schema = Joi.object({
        id: Joi.number().integer().required()
      });
  
      const { error } = schema.validate({ id });
      if (error) {
        console.error("Validation Error:", error.details);
        return requestHandler.sendError(req, res, new Error("Invalid Request"), 400);
      }
  
      const softDelete = await super.updateById(
        req,                
        "users",            
        { deletedAt: new Date() }  
      );
  
      if (softDelete === 0) {
        console.error("No changes made or user not updated.");
        return requestHandler.sendError(req, res, new Error("No changes made or user not updated"), 400);
      }
  
      return requestHandler.sendSuccess(res, "User Deleted Successfully", { id });
    } catch (error) {
      console.log(error.stack);
      return requestHandler.sendError(req, res, new Error("Internal Server Error"), 500);
    }
  }
  
  
  

  static async getProfile(req, res) {
    try {
      const tokenFromHeader = auth.getJwtToken(req);
      const user = jwt.decode(tokenFromHeader);
      const options = {
        where: { id: user.payload.id },
      };
      const userProfile = await super.getByCustomOptions(req, "users", options);
      const profile = _.omit(userProfile.dataValues, [
        "createdAt",
        "updatedAt",
        "last_login_date",
        "password",
      ]);
      return requestHandler.sendSuccess(
        res,
        "User Profile fetched Successfully"
      )({ profile });
    } catch (err) {
      return requestHandler.sendError(req, res, err);
    }
  }

  static async fetchAllUsers(req, res) {
    try {
      const excludedData = [
        "to_be_logged_out",
        "password_changed_at",
        "smileid",
        "timezone",
        "deletedAt",
        "new_phone",
        "last_login_ip",
        "password",
        "otp",
        "device_token",
        "password_token",
      ];

      const options = {
        attributes: { exclude: excludedData },
      };

      const list = await super.getList(req, "users", options);

      return requestHandler.sendSuccess(
        res,
        "Users fetched successfully"
      )(list);
    } catch (error) {
      return requestHandler.sendError(req, res, error);
    }
  }

  static async listOfServiceRequestById(req, res) {
    const param = req.params.user_id;

    try {
      const options = {
        where: { customer_id: param },
      };

      const getServiceRequestById = await super.getByCustomOptions(
        req,
        "service_requests",
        options
      );
      return requestHandler.sendSuccess(
        res,
        "Service Request fetched successfully",
        { getServiceRequestById }
      );
    } catch (error) {
      console.error("Error fetching service request:", error);
      return requestHandler.sendError(
        res,
        "Error fetching service request",
        error
      );
    }
  }

  // static async listOfJobsById(req, res) {
  //   const param = req.params.user_id;

  //   try {
  //     const options = {
  //       where: { customer_id: param },
  //     };
  //     // const result = req.app.get('db')['job']
  //     // console.log('result',result)
  //     // console.log('req',req)
  //     // console.log('option',options)
  //     const getServiceRequestById = await super.getByCustomOptions(
  //       req,
  //       "job",
  //       options
  //     );
  //     console.log("services", getServiceRequestById);
  //     return requestHandler.sendSuccess(res, "Jobs fetched successfully", {
  //       getServiceRequestById,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching service request:", error);
  //     return requestHandler.sendError(req, res, error);
  //   }
  // }

  static async listOfJobsById(req, res) {
    try {
      const { user_id } = req.params;
      const db = req.app.get('db').sequelize;

      // Example query (adjust based on your schema)
      const jobsQuery = `SELECT id AS jobId, title, description, created_at 
                        FROM jobs 
                        WHERE user_id = :user_id AND deleted_at IS NULL`;
      const jobs = await db.query(jobsQuery, {
        replacements: { user_id },
        type: db.QueryTypes.SELECT,
      });

      if (!jobs.length) {
        return requestHandler.sendError(res, 'No jobs found', 404);
      }

      const response = { jobs };
      return requestHandler.sendSuccess(res, 'Jobs retrieved successfully', 200, response);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return requestHandler.sendError(res, 'An error occurred while fetching jobs', 500);
    }
  }

  static async accountReset(req, res) {
    const char =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";
    const passwordLength = 10;
    const param = req.params.uniq_id;
    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * char.length);
      password += char[randomIndex];
    }

    const schema = Joi.object({
      uniq_id: Joi.string().required(),
    });

    const { error } = schema.validate({ uniq_id: param });
    requestHandler.validateJoi(error, 400, "Bad Request", "Invalid Request");

    try {
      const user = await super.getByCustomOptions(req, "users", {
        where: { uniq_id: param },
      });

      if (!user) {
        return requestHandler.sendError(req, res, 404, "User not found");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const resetPassword = await super.updateByCustomWhere(
        req,
        "users",
        { password: hashedPassword },
        { where: { uniq_id: param } }
      );

      if (resetPassword[0] === 0) {
        return requestHandler.sendError(req, res, 404, "User not updated");
      }
      return requestHandler.sendSuccess(res, "Password reset successfully", {
        password,
      });
    } catch (error) {
      return requestHandler.sendError(
        req,
        res,
        500,
        "An error occurred while resetting password"
      );
    }
  }
}

module.exports = UsersController;
