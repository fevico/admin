

const _ = require('lodash');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');
const { Op } = require('sequelize'); 

const logger = new Logger();
const errHandler = new RequestHandler(logger);
class BaseController {
	constructor(options) {
		this.limit = 20;
		this.options = options;
	}

    /**
    * Get an element by it's id .
    *
    *
    * @return a Promise
	* @return an err if an error occur
    */
	static async getById(req, modelName) {
		const reqParam = req.params.id;
		let result;
		try {
			result = await req.app.get('db')[modelName].findByPk(reqParam).then(
				errHandler.throwIf(r => !r, 404, 'not found', 'Resource not found'),
				errHandler.throwError(500, 'sequelize error ,some thing wrong with either the data base connection or schema'),
			);
		} catch (err) {
			return Promise.reject(err);
		}
		return result.get();
	}

	static async getByCustomOptions(req, modelName, options) {
		let result;
		try {
			result = await req.app.get('db')[modelName].findOne(options);
		} catch (err) {
			return Promise.reject(err);
		}
		return result;
	}
	static async getByCustomOptionsCount(req, modelName, options) {
		let result;
		try {
			
			result = await req.app.get('db')[modelName].count(options);
		} catch (err) {
			
			console.error(`Error counting records for ${modelName}:`, err);
			return Promise.reject(err); 
		}
		return result; 
	}
	

	static async deleteById(req, modelName) {
		const reqParam = req.params.id;
		let result;
		try {
			result = await req.app.get('db')[modelName].destroy({
				where: {
					id: reqParam,
				},
			}).then(
				errHandler.throwIf(r => r < 1, 404, 'not found', 'No record matches the Id provided'),
				errHandler.throwError(500, 'sequelize error'),
			);
		} catch (err) {
			return Promise.reject(err);
		}
		return result;
	}

	static async create(req, modelName, data) {
		let obj = data;
		if (_.isUndefined(obj)) {
			obj = req.body;
		}
		let result;
		try {
			result = await req.app.get('db')[modelName].build(obj).save().then(
				errHandler.throwIf(r => !r, 500, 'Internal server error', 'something went wrong couldnt save data'),
				errHandler.throwError(500, 'sequelize error'),

			).then(
				savedResource => Promise.resolve(savedResource),
			);
		} catch (err) {
			return Promise.reject(err);
		}
		return result;
	}


	static async updateById(req, modelName, data) {
		const recordID = req.params.id;
		let result;

		try {
			result = await req.app.get('db')[modelName]
				.update(data, {
					where: {
						id: recordID,
					},
				}).then(
					errHandler.throwIf(r => !r, 500, 'Internal server error', 'something went wrong couldnt update data'),
					errHandler.throwError(500, 'sequelize error'),

				).then(
					updatedRecored => Promise.resolve(updatedRecored),
				);
		} catch (err) {
			return Promise.reject(err);
		}
		return result;
	}

	static async updateByCustomWhere(req, modelName, data, options) {
		let result;

		try {
			result = await req.app.get('db')[modelName]
				.update(data, {
					where: options,
				}).then(
					errHandler.throwIf(r => !r, 500, 'Internal server error', 'something went wrong couldnt update data'),
					errHandler.throwError(500, 'sequelize error'),

				).then(
					updatedRecored => Promise.resolve(updatedRecored),
				);
		} catch (err) {
			return Promise.reject(err);
		}
		return result;
	}

	static async getList(req, modelName, options) {
		let page = parseInt(req.query.page, 10);
		if (isNaN(page) || page < 0) {
		  page = 0; 
		}
	  
		let limit = parseInt(req.query.limit, 10);
		if (isNaN(limit) || limit <= 0) {
		  limit = 50; 
		}
	  
		try {
		
		  if (_.isUndefined(options)) {
			options = {};
		  }
	  
		  options = _.extend({}, options, {
			offset: limit * page,
			limit: limit,
		  });
	  
		  const { count, rows } = await req.app.get('db')[modelName].findAndCountAll(options);
		  const totalPages = Math.ceil(count / limit);
	  
		  const protocol = req.protocol;
		  let next = page < totalPages - 1
			? `${protocol}://${req.get('host')}${req.baseUrl}${req.path}?page=${page + 1}&limit=${limit}`
			: null;
	  
		  let previous = page > 0
			? `${protocol}://${req.get('host')}${req.baseUrl}${req.path}?page=${page - 1}&limit=${limit}`
			: null;
		  return {
			total: count,
			pages: totalPages,
			currentPage: page, 
			next,
			previous,
			pageSize: limit,
			data: rows,
		  };
	  
		} catch (err) {
		  // Return the error with a consistent structure
		  return Promise.reject(err);
		}
	  }
	  
}
module.exports = BaseController;
