var pipes = require('amqp-pipes');
var filters = require('./config.json');

/**
 * Sets up all Pipes and Filters
 * run: $ node pipes-and-filters.js
 */
pipes(filters);
