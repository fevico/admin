const Joi = require('joi');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const async = require('async');
const jwt = require('jsonwebtoken');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');
const BaseController = require('../controllers/BaseController');
const stringUtil = require('../utils/stringUtil');
const email = require('../utils/email');
const config = require('../config/appconfig');
const auth = require('../utils/auth');
const Sequelize = require('sequelize');  // Add this line at the top

const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const tokenList = {};

class AuthController extends BaseController {

	static async login(req, res) {
		try {
			const schema = {
				phone: Joi.string().required(),
				password: Joi.string().required(),
			};
			const { error } = Joi.validate({
				phone: stringUtil.removeLeadingZero(req.body.phone),
				password: req.body.password,
			}, schema);
			requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
			const options = {
				where: { phone: stringUtil.removeLeadingZero(req.body.phone), 
					type: {
					[Sequelize.Op.like]: '%admin'
				  }},
			};

			const user = await super.getByCustomOptions(req, 'users', options);

			if (!user) {
				requestHandler.throwError(400, 'bad request', 'invalid credentials')();
			}

			await bcrypt
				.compare(req.body.password, user.password)
				.then(
					requestHandler.throwIf(r => !r, 400, 'incorrect', 'failed to login bad credentials'),
					requestHandler.throwError(500, 'bcrypt error'),
				);
			const data = {
				last_login_at: new Date(),
			};
			    
			req.params.id = user.id;
			await super.updateById(req, 'users', data);
			const payload = _.omit(user.dataValues, ['id', 'email_verified_at', 'smileid', 'is_business_register', 'device_token', 'otp', 'password_token', 'new_phone', 'password_changed_at', 'active', 'timezone', 'last_login_ip', 'to_be_logged_out', 'subscribe', 'created_at', 'updated_at', 'last_login_at', 'password', 'phone', 'phone_code']);
			const token = jwt.sign({ payload }, config.auth.jwt_secret, { expiresIn: config.auth.jwt_expiresin, algorithm: 'HS512' });
			const refreshToken = jwt.sign({
				payload,
			}, config.auth.refresh_token_secret, {
				expiresIn: config.auth.refresh_token_expiresin,
			});
			const response = {
				status: 'Logged in',
				token,
				refreshToken,
				payload,
			};
			tokenList[refreshToken] = response;
			requestHandler.sendSuccess(res, 'User logged in Successfully')({ token, refreshToken,payload });
		} catch (error) {
			requestHandler.sendError(req, res, error);
		}
	}

	static async refreshToken(req, res) {
		try {
			const data = req.body;
			if (_.isNull(data)) {
				requestHandler.throwError(400, 'bad request', 'please provide the refresh token in request body')();
			}
			const schema = {
				refreshToken: Joi.string().required(),
			};
			const { error } = Joi.validate({ refreshToken: req.body.refreshToken }, schema);
			requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
			const tokenFromHeader = auth.getJwtToken(req);
			const user = jwt.decode(tokenFromHeader);

			if ((data.refreshToken) && (data.refreshToken in tokenList)) {
				const token = jwt.sign({ user }, config.auth.jwt_secret, { expiresIn: config.auth.jwt_expiresin, algorithm: 'HS512' });
				const response = {
					token,
				};
				// update the token in the list
				tokenList[data.refreshToken].token = token;
				requestHandler.sendSuccess(res, 'a new token is issued ', 200)(response);
			} else {
				requestHandler.throwError(400, 'bad request', 'no refresh token present in refresh token list')();
			}
		} catch (err) {
			requestHandler.sendError(req, res, err);
		}
	}

	static async logOut(req, res) {
		try {
			const schema = {
				platform: Joi.string().valid('ios', 'android', 'web').required(),
				fcmToken: Joi.string(),
			};
			const { error } = Joi.validate({
				platform: req.headers.platform, fcmToken: req.body.fcmToken,
			}, schema);
			requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');

			const tokenFromHeader = auth.getJwtToken(req);
			const user = jwt.decode(tokenFromHeader);
			const options = {
				where: {
					fcmToken: req.body.fcmToken,
					platform: req.headers.platform,
					user_id: user.payload.id,
				},
			};
			const fmcToken = await super.getByCustomOptions(req, 'UserTokens', options);
			req.params.id = fmcToken.dataValues.id;
			const deleteFcm = await super.deleteById(req, 'UserTokens');
			if (deleteFcm === 1) {
				requestHandler.sendSuccess(res, 'User Logged Out Successfully')();
			} else {
				requestHandler.throwError(400, 'bad request', 'User Already logged out Successfully')();
			}
		} catch (err) {
			requestHandler.sendError(req, res, err);
		}
	}
}
module.exports = AuthController;
