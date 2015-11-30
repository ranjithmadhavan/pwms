var wsClient = reqlib("/modules/ws/wsClient")

exports.makeSoapCall =  function(req, res){
    console.log("Called Make SoapCall Inside WebServices Controller");
    console.log("req.path is "+req.path);
    wsClient.makeSoapCall(
        "https://admin:admin@localhost:9443/services/RemoteTenantManagerService.RemoteTenantManagerServiceHttpsSoap12Endpoint/",
        "getAllTenants.xml",
        req.query
        ).then(function(soapResponse){
            wsClient.parseResponse(soapResponse,'{"ax2621" : "http://api.user.carbon.wso2.org/xsd"}',"//ax2621:domain/text()")
            .then(function(response){
                console.log("Response is "+response);
                var tenants = [];
                response.forEach(function(element, index, array){
                    tenants.push(element.data);
                });
                res.send(tenants);  
            });
        })
        .catch(function(err){
            console.log(chalk.red("Error in /ws is "+JSON.stringify(err)));
            res.status(400).send("Error in getting response from the IDP");
        });
}
