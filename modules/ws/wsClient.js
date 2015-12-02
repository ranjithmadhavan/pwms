var xpath = require("xpath");
var Dom = require("xmldom").DOMParser;
var auth = "Basic " + new Buffer("admin" + ":" + "admin").toString("base64");
var fs = require("fs");
var path = require("path");
var request = require("request");
var wso2url = "https://admin:admin@localhost:9443/services/RemoteTenantManagerService.RemoteTenantManagerServiceHttpsSoap12Endpoint/";

var getAllTenantsRequest = fs.readFileSync(path.resolve(__dirname+"../../../config/soaprequests/getAllTenants.xml"));

var options = {
    url : wso2url,
    method:'POST',
    rejectUnauthorized: false, 
    headers :{
         "Content-Type " : "application/soap+xml"
    },
    body: getAllTenantsRequest
}

var parseResponse = function(xmlString) {   
    var nameSpaceString = JSON.parse('{"ax2621" : "http://api.user.carbon.wso2.org/xsd"}');
    var xpathString = "//ax2621:domain/text()";
    var doc = new Dom().parseFromString(xmlString);
    var selector = xpath.useNamespaces(nameSpaceString);
    var nodes = selector(xpathString,doc);
    nodes.forEach(function(element, index, array){
        console.log("Element is "+element);
    });
}


function prepareRequest (wsdlurl, requestTemplateName, params) {
    return new Promise(function(resolve, reject){
        if (!wsdlurl || !requestTemplateName) {
            reject("WSDL Url and/or requestTemplateName cannot be empty")
        }
        options.url = wsdlurl;
        var requestXml = ""+fs.readFileSync(path.resolve(__dirname+"../../../config/soaprequests/"+requestTemplateName));
        for (var key in params) {
            requestXml = requestXml.replaceAll("##"+key+"##", params[key]);
        }       
        options.body = requestXml;
        resolve(options);
    });
}

/**
 * Parse the xml response and return data.
 * @param  {[type]} xmlString       [description]
 * @param  {[type]} nameSpaceString [description]
 * @param  {[type]} xpathString     [description]
 * @return {[type]}                 [description]
 */
module.exports.parseResponse = function(xmlString, nameSpaceString, xpathString) {   
    return new Promise(function(resolve, reject){   
        if (!xmlString || !xpathString) {
            reject("Empty XMLString or XPath provided");
        }
        var result = {};
        var doc = new Dom().parseFromString(xmlString);
        if (nameSpaceString) {
            var nameSpace = JSON.parse(nameSpaceString);
            var selector = xpath.useNamespaces(nameSpace);
            result = selector(xpathString,doc);
        } else {
            result = xpath.select(xpathString, doc);
        }
        resolve(result); 
    });
}

/**
 * Makes a soap call using the request API in node.
 * 
 * @param  {[type]} wsdlUrl             [description]
 * @param  {[type]} requestTemplateName [description]
 * @param  {[type]} params              [description]
 * @return {[type]}                     [description]
 */
module.exports.makeSoapCall = function(wsdlUrl, requestTemplateName, params) {  
    return new Promise(function(resolve, reject){    
        console.log("going to call prepare request");
        prepareRequest(wsdlUrl, requestTemplateName, params)
            .then(function(options){
                request(options, function(error, response, body){
                    if(error) {
                        console.log("Error is "+error);
                        reject(error);
                    } else {
                        // console.log(response.statusCode);
                        // console.log(body);
                        resolve(body);
                    }
                });            
            })
            .catch (function (error) {
                console.log("Rejected from makeSoapCall due to "+error);
                reject(error);
            });
    });
}