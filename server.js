var builder = require('botbuilder');
var http = require('http');
var querystring = require('querystring');
var restify = require('restify');
var dotenv = require('dotenv');
dotenv.load();

var ConnectorBot = require('./connector');

var connectorBot = ConnectorBot.start();
