define(['app'], function (app) {
	app.controller('LoginController', [ 'permissions', '$scope', '$rootScope', '$location', '$http', '$interval', function(permissions,$scope,$rootScope,$location,$http,$interval) {

		$scope.failcounter=0;

		$scope.DoLogin=function()
		{
			var musername=encodeURIComponent(btoa($('#username').val()));
			var mpassword=encodeURIComponent(btoa($('#password').val()));
			var bRememberMe=$('#rememberme').is(":checked");

			$.ajax({
				url: "json.htm?type=command&param=logincheck&username=" + musername + "&password=" + mpassword + "&rememberme="+bRememberMe,
				async: false, 
				dataType: 'json',
				success: function(data) {
					if (data.status != "OK") {
						HideNotify();
						$scope.failcounter+=1;
						if ($scope.failcounter>3) {
							window.location.href = "http://www.1112.net/lastpage.html";
							return;
						}
						else {
							ShowNotify($.i18n('Incorrect Username/Password!'), 2500, true);
						}
						return;
					}
					else {
						var permissionList = {
								isloggedin: true,
								rights: 0
						};
						if (data.user!="") {
							permissionList.isloggedin=true;
						}
						permissionList.rights=parseInt(data.rights);
						
						permissions.setPermissions(permissionList);
						window.location = '#/Dashboard';
					}
				},
				error: function(){
					HideNotify();
					$scope.failcounter+=1;
					if ($scope.failcounter>3) {
						window.location.href = "http://www.1112.net/lastpage.html";
						return;
					}
					else {
						ShowNotify($.i18n('Incorrect Username/Password!'), 2500, true);
					}
				}
			});
		}
		
		init();

		function init()
		{
			$.ajax({
				 url: "json.htm?type=command&param=getlanguage",
				 async: false, 
				 dataType: 'json',
				 success: function(data) {
					if (typeof data.language != 'undefined') {
						SetLanguage(data.language);
					}
					else {
						SetLanguage('en');
					}
				 },
				 error: function(){
				 }     
			});
		
			var $inputs = $('#login :input');
			$inputs.each(function() {
				if ($(this).attr("id")!="submit") {
					$(this).attr("placeholder",$.i18n($(this).attr("placeholder")));
				}
				else {
					$(this).attr("value",$.i18n("Login"));
				}
			});
			$("#remembermelbl").text($.i18n("Remember me"));
		};
	} ]);
});