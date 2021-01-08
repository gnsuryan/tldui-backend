const oracledb = require('oracledb');
const queries = require(`${process.cwd()}/queries.js`)

/*gets property from path/to/properties file
You can also export this function using module.exports*/
const PropertiesReader = require('properties-reader');
const prop = PropertiesReader(`${process.cwd()}/config/config.properties`);
getProperty = (pty) => {return prop.get(pty);}

try {
    oracledb.initOracleClient({libDir: getProperty('db.client.dir')});
    oracledb.outFormat = oracledb.OBJECT;
  } catch (err) {
    console.error('Error while connecting to Database !! ');
    console.error(err);
    process.exit(1);
  }

queryDBAndFetchResults = async function (req, res,apiName,paramMap) {
  try 
  {
	  dbhost=getProperty('db.host');
	  dbport=getProperty('db.port');
	  dbservicename=getProperty('db.servicename');
	  dbusername=getProperty('db.username');
	  dbpassword=getProperty('db.password');

	  connection = await oracledb.getConnection
	  (
		  {
			  user          : `${dbusername}`,
			  password      : `${dbpassword}`,
			  connectString : `(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = ${dbhost})(PORT = ${dbport}))(CONNECT_DATA =(SERVICE_NAME= ${dbservicename})))`
		  }
	  );

	console.log('connected to database');
	query=eval(`${apiName}_sql_query`);

	console.log(`Before replacing Query: ${query}`);
	
	for (const [key, value] of paramMap.entries()) {
	   const search = `<${key}>`
	   const replacer = new RegExp(search, 'g')
	   //query=query.replace(/:``:/g,`${value}`);
	   query=query.replace(replacer, `${value}`)
	}

	console.log(`Executing Query: ${query}`);
	result = await connection.execute(`${query}`);

  } catch (err) {
    //send error message
    return res.send(err.message);
  } finally {
    if (connection) {
      try {
        // Always close connections
        await connection.close();
        console.log('close connection success');
      } catch (err) {
        console.error(err.message);
      }
    }
    
	if (result.rows.length == 0) {
      //send empty result
      return res.send('query send no rows');
    } else {
      //send all results
      return res.send(result.rows);
    }
  }
}

module.exports.queryDBAndFetchResults = queryDBAndFetchResults;