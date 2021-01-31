const dbutil = require(`${process.cwd()}/dbutil.js`)
const express = require('express')
const app = express()

const PropertiesReader = require('properties-reader');
const prop = PropertiesReader(`${process.cwd()}/config/config.properties`);
getProperty = (pty) => {return prop.get(pty);}

const port=getProperty('server.port');

//get system config for given release, team and risk category
  app.get('/configs/:release/:team/:riskcategory', function (req, res) {
  processRequest(req, res,'systemconfig');
})

//get all system config
  app.get('/configs', function (req, res) {
  processRequest(req, res,'allsystemconfig');
})

//get all releases
  app.get('/releases', function (req, res) {
  processRequest(req, res,'releases');
})

//get all runtypes
  app.get('/runtypes', function (req, res) {
  processRequest(req, res,'runtypes');
})

//get all runtypes for given release
app.get('/runtypes/:release', function (req, res) {
  processRequest(req, res,'runtypesForRelease');
})


//get all build labels
  app.get('/buildlabels', function (req, res) {
  processRequest(req, res,'buildlabels');
})

//get all teams
  app.get('/teams', function (req, res) {
  processRequest(req, res,'teams');
})

//get all risk categories
  app.get('/riskcategories', function (req, res) {
  processRequest(req, res,'riskcategories');
})

//get all config tool release mappings
  app.get('/config_tool_release_mappings', function (req, res) {
  processRequest(req, res,'config_tool_release_mappings');
})

  //get runtype regression report 
  app.get('/runtype_regression_report/:release/:previousruntype/:currentruntype', function (req, res) {
  processRequest(req, res,'runtype_regression_report');
})

  //get runtype regression report data
  app.get('/regression_report_data', function (req, res) {
  processRequest(req, res,'regression_report_data');
})

  //get build failure report data
  app.get('/build_failure_report', function (req, res) {
  processRequest(req, res,'build_failure_report');
})

  //get duplicate test case report
  app.get('/duplicate_test_case_report', function (req, res) {
  processRequest(req, res,'duplicate_test_case_report');
})

  //get duplicate test case report
  app.get('/consecutive_test_failure_report', function (req, res) {
  processRequest(req, res,'consecutive_test_failure_report');
})


processRequest = async function (req, res,apiName) {
    paramMap = getParamMap(req,apiName);
	printMap(paramMap);
	res.header("Access-Control-Allow-Origin", "*");
	return dbutil.queryDBAndFetchResults(req,res,apiName,paramMap);
}

function handleParamsForSystemConfig(req,map)
{
	const release = req.params.release 
	const team = req.params.team
	const riskcategory = req.params.riskcategory
	map.set("release",release);
	map.set("team",team);
	map.set("riskcategory",riskcategory);
}

function handleParamsForRunTypeRegressionReport(req,map)
{
	const release = req.params.release 
	const currentRunType = req.params.previousruntype
	const previousRunType = req.params.currentruntype
	map.set("release",release);
	map.set("currentRunType",currentRunType);
	map.set("previousRunType",previousRunType);
}

function handleParamsForRunTypesForRelease(req,map)
{
	const release = req.params.release
	map.set("release",release);
}

function getParamMap(req,apiName)
{
	let map = new Map();
	switch (apiName)
	{
		
		case "systemconfig":		
							handleParamsForSystemConfig(req,map);
							break; 

		case "runtype_regression_report":
			                handleParamsForRunTypeRegressionReport(req,map);
							break;

		case "runtypesForRelease":
			                handleParamsForRunTypesForRelease(req,map);
							break;


		default:			console.log("invalid api or api doesn't require parameter handling: "+apiName); 
							break;
	}

	return map;	
}

function printMap(map)
{
	console.log('==== PARAMETERS =========');
	for (const [key, value] of map.entries()) {
	  console.log(key, value);
	}
	console.log('==== PARAMETERS =========');
}

module.exports.startServer = startServer
	
function startServer() {
	app.listen(port, () => console.log("nodeOracleRestApi app listening on port %s!", port))
}

