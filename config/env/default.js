var qlbaseurl = process.env.QUICKLAUNCH_BASE_URL || "https://localhost/QuickLaunch";
var wso2BaseUrl = process.env.WSO2_BASE_URL || "https://##USERNAME##:##PASSWORD##@localhost:9443";

module.exports = {
	environment : "development",
	wso2 : {
		webservices : {
			tenant : {
				getAllTenants : {
					url : "https://"+(process.env.WSO2_ADMIN_USER || "admin") + ":"+ (process.env.WSO2_ADMIN_PWD || "admin")+"@localhost:9443/services/RemoteTenantManagerService.RemoteTenantManagerServiceHttpsSoap12Endpoint/",
					namespace : ['{"ax2621" : "http://api.user.carbon.wso2.org/xsd"}'],
					xpath : ['//ax2621:domain/text()']
				}
			},
			user : {
				login : {
					url : wso2BaseUrl+"/services/UserIdentityManagementAdminService.UserIdentityManagementAdminServiceHttpsSoap12Endpoint/"
				}
			}
		}
	},
	quicklaunch : {		
		restapi : {
			authurl : qlbaseurl+"/open/authenticate"
		}
	},
	jwt : {
		secret : 'pwmsqlsso',
		expiresIn : 1800
	},
	db: 'mongodb://localhost/pwms',
};

