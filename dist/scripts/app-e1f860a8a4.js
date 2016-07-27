"use strict";angular.module("baoziApp",["ngMaterial","ngMessages","ngSanitize","angular-md5","firebase","ui.router","md.data.table"]).config(function(){var e={apiKey:"AIzaSyAI4HCemOw16WDwFWhjN7k443LF6PufuRM",authDomain:"zhenling-project.firebaseapp.com",databaseURL:"https://zhenling-project.firebaseio.com",storageBucket:""};firebase.initializeApp(e)}).run(["$rootScope","$state",function(e,t){e.$on("$stateChangeError",function(e,n,r,a,o,l){return e.preventDefault(),t.get("error").error={code:l.code},t.go("error")})}]).config(["$stateProvider","$urlRouterProvider",function(e,t){t.otherwise("/"),e.state("home",{url:"/",templateUrl:"templates/weather/weather.html",controller:"WeatherCtrl as weather",resolve:{requireNoAuth:["$state","$q","Auth",function(e,t,n){return n.$requireSignIn().then(function(){e.go("panel.profile")})["catch"](function(e){console.debug(e),console.debug("No Auth")})}]}}).state("error",{url:"/error",resolve:{errorObj:[function(){return this.self.error}]},controller:"ErrorCtrl as errorCtrl",templateUrl:"views/error.html"}).state("panel",{"abstract":!0,templateUrl:"templates/panel/panel.html",controller:"PanelCtrl as panel",resolve:{auth:["$state","Users","Auth",function(e,t,n){return n.$requireSignIn()["catch"](function(){e.go("home"),console.log("No User")})}]}}).state("panel.chat",{url:"/chat",templateUrl:"templates/panel/chat/chat.html",controller:"ChatCtrl as chatCtrl",resolve:{channels:["Channels",function(e){return e.$loaded()}],profile:["$state","Auth","Users",function(e,t,n){return t.$requireSignIn().then(function(t){return n.getProfile(t.uid).$loaded().then(function(t){return t.displayName?t:void e.go("panel.profile")})},function(t){console.log(t),e.go("home")})}]}}).state("panel.chat.create",{url:"/create",templateUrl:"templates/panel/chat/create.html",controller:"ChatCtrl as chatCtrl"}).state("panel.chat.messages",{url:"/{channelId}/messages",templateUrl:"templates/panel/chat/messages.html",controller:"MessageCtrl as messageCtrl",resolve:{messages:["$stateParams","Messages",function(e,t){return t.forChannel(e.channelId).$loaded()}],channelName:["$stateParams","channels",function(e,t){return"#"+t.$getRecord(e.channelId).name}],isChannel:function(){return!0}}}).state("panel.chat.direct",{url:"/{uid}/messages/direct",templateUrl:"templates/panel/chat/messages.html",controller:"MessageCtrl as messageCtrl",resolve:{messages:["$stateParams","Messages","profile",function(e,t,n){return t.forUsers(e.uid,n.$id).$loaded()}],channelName:["$stateParams","Users",function(e,t){return t.all.$loaded().then(function(){return"@"+t.getDisplayName(e.uid)})}],isChannel:function(){return!1}}}).state("panel.map",{url:"/map",templateUrl:"templates/panel/map/map.html",controller:"MapCtrl as mapCtrl",resolve:{profile:["$state","Auth","Users",function(e,t,n){return t.$requireSignIn().then(function(t){return n.getProfile(t.uid).$loaded().then(function(t){return t.displayName?t:void e.go("panel.profile")})},function(t){console.log(t),e.go("home")})}]}}).state("panel.meetup",{url:"/meetup",templateUrl:"templates/panel/meetup/meetup.html",controller:"MeetupCtrl as meetupCtrl",resolve:{profile:["$state","Auth","Users",function(e,t,n){return t.$requireSignIn().then(function(t){return n.getProfile(t.uid).$loaded().then(function(t){return t.displayName?t:void e.go("panel.profile")})},function(t){console.log(t),e.go("home")})}],meetups:["Meetups",function(e){return e.forMeetup().$loaded()}]}}).state("panel.business",{url:"/business",templateUrl:"templates/panel/business/business.html",controller:"BusinessCtrl as businessCtrl",resolve:{profile:["$state","Auth","Users",function(e,t,n){return t.$requireSignIn().then(function(t){return n.getProfile(t.uid).$loaded().then(function(t){return t.displayName?t:void e.go("panel.profile")})},function(t){console.log(t),e.go("home")})}],businesses:["Businesses",function(e){return e.forBusiness().$loaded()}],methods:["Methods",function(e){return e.forMethod().$loaded()}]}}).state("panel.blog",{url:"/blog",templateUrl:"templates/panel/chat/blog.html",controller:"PanelCtrl as panel",parent:"panel"}).state("panel.profile",{url:"/profile",controller:"ProfileCtrl as profileCtrl",templateUrl:"templates/panel/profile/profile.html",parent:"panel",resolve:{auth:["$state","Auth",function(e,t){return t.$requireSignIn()["catch"](function(){e.go("home"),console.log("No User")})}],profile:["Users","Auth",function(e,t){return t.$requireSignIn().then(function(t){return e.getProfile(t.uid).$loaded()})}]}})}]),angular.module("baoziApp").controller("AuthCtrl",["$state","Auth","$firebaseAuth","$firebaseObject","md5",function(e,t,n,r,a){var o=this,l=firebase.database().ref();o.user={email:"",password:""},o.login=function(){t.$signInWithEmailAndPassword(o.user.email,o.user.password).then(function(t){e.go("panel.profile")},function(e){o.error=e})},o.register=function(){t.$createUserWithEmailAndPassword(o.user.email,o.user.password).then(function(e){l.child("users").child(e.uid).set({displayName:o.user.email,emailHash:a.createHash(o.user.email),mitbbsId:""}),o.login()})["catch"](function(e){o.error=e})}}]),angular.module("baoziApp").directive("userAuth",function(){return{templateUrl:"templates/components/auth/userauth.html",restrict:"E",controller:"AuthCtrl",controllerAs:"authCtrl",replace:!0,link:function(e){e.isLogin=!0,e.toLoginPage=function(){e.isLogin=!0},e.toRegisterPage=function(){e.isLogin=!1}}}}),angular.module("baoziApp").factory("Auth",["$firebaseAuth",function(e){return e()}]),angular.module("baoziApp").controller("MenulinkController",["$scope","$mdMedia",function(e,t){e.$mdMedia=t}]),angular.module("baoziApp").service("menu",function(){var e=[];return e.push({name:"My Profile",link:"panel.profile",icon:"&#xE55B;",awesome_icon:"fa fa-user"},{name:"Food Map",link:"panel.map",icon:"&#xE55B;",awesome_icon:"fa fa-cutlery"},{name:"Meet Up",link:"panel.meetup",icon:"&#xE8CB;",awesome_icon:"fa fa-calendar"},{name:"Business",link:"panel.business",icon:"&#xEB3F;",awesome_icon:"fa fa-briefcase"},{name:"Travel Blog",link:"panel.blog",icon:"&#xE87A;",awesome_icon:"fa fa-suitcase"},{name:"Happy Chat",link:"panel.chat",icon:"&#xE0B7;",awesome_icon:"fa fa-comments"}),e}).directive("menuLink",["menu",function(e){return{scope:{section:"="},templateUrl:"templates/components/menulink/menulink.html",restrict:"E",controller:"MenulinkController",controllerAs:"menulink",replace:!0,link:function(t){t.menu=e}}}]).directive("isActiveLink",["$state",function(e){return{restrict:"A",replace:!1,link:function(t,n){var r=function(){var t=["#/"+e.current.name.split(".")[1],"#"+e.current.name.split(".")[1],e.current.name.split(".")[1]];angular.forEach(n.find("a"),function(e){e=angular.element(e);var n=e.children();-1!==t.indexOf(e.attr("href"))?n.addClass("mdl-color-text--green-400").removeClass("mdl-color-text--blue-grey-400"):n.removeClass("mdl-color-text--green-400").addClass("mdl-color-text--blue-grey-400")})};t.init=r,t.init(),t.$on("$stateChangeSuccess",r)}}}]),angular.module("baoziApp").controller("NavbarController",["$scope","$mdMedia","$mdSidenav",function(e,t,n){e.$mdMedia=t,e.$mdSidenav=n}]),angular.module("baoziApp").directive("navBar",function(){return{templateUrl:"templates/components/navbar/navbar.html",restrict:"E",controller:"NavbarController",controllerAs:"navbar",replace:!0}}),angular.module("baoziApp").controller("SidenavController",["$scope","$state","$timeout","$mdSidenav","$log","Users","Auth",function(e,t,n,r,a,o,l){var i=function(e,t){return t.$requireSignIn().then(function(t){return e.getProfile(t.uid).$loaded()})}(o,l);i.then(function(t){return e.emailHash=t.emailHash,e.name=t.displayName,t},function(e){console.log(e)}),e.logout=function(){i.then(function(e){l.$signOut(),e.online=null,e.$save().then(function(){t.go("home")})})},e.close=function(){r("left").close()}}]),angular.module("baoziApp").directive("sideNav",function(){return{templateUrl:"templates/components/sidenav/sidenav.html",restrict:"E",controller:"SidenavController",controllerAs:"sidenav",replace:!0}}),angular.module("baoziApp").controller("ErrorCtrl",["$scope","errorObj",function(e,t){var n=this;n.error=t}]),angular.module("baoziApp").controller("BusinessCtrl",["$scope","$mdDialog","$firebaseObject","$mdMedia","$firebaseArray","profile","businesses","methods",function(e,t,n,r,a,o,l,i){var s=firebase.database().ref(),c=this;e.query={filter:"",order:"mitbbsId",limit:5,page:1},e.businesses=l,e.selected=[],e.logItem=function(e){console.log(e.$id,"was selected")},console.log(e.selected);var u=function(e){var n=function(){return{mitbbsId:e.mitbbsId,product:e.product,price:e.price,quantity:e.quantity,location:e.location,zipCode:e.zipCode,paymentMethod:e.paymentMethod,paid:!1}};e.cancel=function(){t.cancel()},e.mitbbsId=o.mitbbsId,e.uploadProduct=function(){l.$add(n()),t.hide()},e.products=["Dell Inspiron 13 i7359-8408SLV  (-Adorama-)","Lenovo G50 80KR0015US Laptop (-Ebay-)","HP 15-ac143dx Laptop (-Bestbuy-)","Lenovo Ideapad 100s 80R90004US (-Bestbuy-)","DELL i5759-2012SLV Laptop (-DELL-)","Toshiba S55-C5274 Laptop (-Staples-)"],e.methods=i};u.$inject=["$scope"];var p=function(e){var n=!1;e.methods=i,e.writeMethod=function(t){e.paymentMethod=t,n=!0},e.cancel=function(){t.cancel()},e.savePaymentMethod=function(){n?i.$save(e.paymentMethod):i.$add(e.paymentMethod),t.hide()}};p.$inject=["$scope"];var m=function(e,n,r,a){function o(e){console.debug(e),e.paid||(e.paid=(new Date).toDateString(),a.$save(e),console.debug(e))}function l(n){console.debug(n),r.length>0?null==n.$value?e.error="Invalid Secret.":(r.forEach(o),t.cancel()):e.error="You need at least select one record."}function i(){e.error="Invalid Secret."}e.cancel=function(){t.cancel()},e.authorizeUser=function(){n(s.child(e.secret)).$loaded().then(l,i)}};m.$inject=["$scope","$firebaseObject","selectedBusinesses","businesses"],c.showDialogInventory=function(e){var n=r("sm")||r("xs");t.show({controller:u,templateUrl:"templates/panel/business/business.create.html",parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!0,fullscreen:n})},c.showDialogPaymentMethod=function(e){var n=r("sm")||r("xs");t.show({controller:p,templateUrl:"templates/panel/business/business.payment.method.html",parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!0,fullscreen:n})},c.showDialogPaymentConfirmation=function(n){var a=r("sm")||r("xs");t.show({controller:m,templateUrl:"templates/panel/business/business.payment.confirm.html",parent:angular.element(document.body),targetEvent:n,clickOutsideToClose:!0,locals:{selectedBusinesses:e.selected,businesses:e.businesses},fullscreen:a})}}]),angular.module("baoziApp").directive("meetupCreate",function(){return{restrict:"E",replace:!0,templateUrl:"templates/panel/business/business.create.html"}}),angular.module("baoziApp").factory("Businesses",["$firebaseArray",function(e){var t=firebase.database().ref().child("businesses");return{forBusiness:function(){return e(t)},all:t}}]).factory("Methods",["$firebaseArray",function(e){var t=firebase.database().ref().child("methods");return{forMethod:function(){return e(t)},all:t}}]),angular.module("baoziApp").controller("ChatCtrl",["$scope","$state","$mdMedia","Auth","Users","channels","profile",function(e,t,n,r,a,o,l){a.setOnline(l.$id);var i=this;i.direction=!1,i.profile=l,i.channels=o,i.getDisplayName=a.getDisplayName,i.getGravatar=a.getGravatar,i.newChannel={name:""},i.createChannel=function(){i.channels.$add(i.newChannel).then(function(e){t.go("panel.chat.messages",{channelId:e.key()}),i.newChannel={name:""}})},i.toggle=function(){i.direction=!i.direction},i.users=a.all}]),angular.module("baoziApp").directive("scrollBottom",function(){return{scope:{scrollBottom:"="},link:function(e,t){e.$watchCollection("scrollBottom",function(){$(t).scrollTop($(t)[0].scrollHeight)})}}}),angular.module("baoziApp").factory("Channels",["$firebaseArray",function(e){var t=firebase.database().ref().child("channels"),n=e(t);return n}]).factory("Messages",["$firebaseArray",function(e){var t=firebase.database().ref().child("channelMessages"),n=firebase.database().ref().child("userMessages");return{forChannel:function(n){return e(t.child(n))},forUsers:function(t,r){var a=t<r?t+"/"+r:r+"/"+t;return e(n.child(a))}}}]),angular.module("baoziApp").controller("MessageCtrl",["$mdMedia","profile","channelName","messages","isChannel",function(e,t,n,r,a){var o=this;o.$mdMedia=e,o.messages=r,o.channelName=n,o.message="",o.profile=t,o.isChannel=a,o.sendMessage=function(){o.message.length>0&&o.messages.$add({uid:t.$id,body:o.message,timestamp:firebase.database.ServerValue.TIMESTAMP}).then(function(){o.message=""})}}]),angular.module("baoziApp").controller("MeetupCtrl",["$scope","$mdDialog","$firebaseObject","$mdMedia","profile","Meetups","meetups",function(e,t,n,r,a,o,l){var i=this;i.meetups=l,console.log(i.meetups),i.host=a.displayName;var s=function(e){var n=function(){var t="undefined"==typeof e.description?"":e.description;return console.log(e.guest),e.guest=e.guest.replace(/(^,)|(,$)/g,""),e.guests=e.guest.split(","),{name:e.name,host:e.host,type:e.type,location:e.location,detailLoc:e.detailLoc,guests:e.guests,startDateTime:new Date(e.startDateTime).getTime(),endDateTime:new Date(e.endDateTime).getTime(),description:t,createDate:(new Date).getTime(),createBy:a.displayName}};e.cancel=function(){t.cancel()},e.host=a.displayName,e.createEvent=function(){o.all.push(n()),t.hide()},e.types=["Conference","Meeting","Party","Wedding","Social Networking","Birthday","Family","Sport","Other"]};s.$inject=["$scope"],i.showDialog=function(e){var n=r("sm")||r("xs");t.show({controller:s,templateUrl:"templates/panel/meetup/meetup.create.html",parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!0,fullscreen:n})}}]),angular.module("baoziApp").directive("meetupCreate",function(){return{restrict:"E",replace:!0,templateUrl:"templates/panel/meetup/meetup.create.html"}}).directive("googleplace",function(){return{require:"ngModel",link:function(e,t,n,r){var a={types:[],componentRestrictions:{}};e.gPlace=new google.maps.places.Autocomplete(t[0],a),e.gPlace.addListener("place_changed",function(){var n=e.gPlace.getPlace(),a=n.geometry.location.lat(),o=n.geometry.location.lng(),l=[];l.push(a,o),e.detailLoc=l,e.$apply(function(){r.$setViewValue(t.val())})})}}}),angular.module("baoziApp").factory("Meetups",["$firebaseArray",function(e){var t=firebase.database().ref().child("meetups");return{forMeetup:function(){return e(t)},all:t}}]),angular.module("baoziApp").controller("PanelCtrl",["$scope","$mdMedia",function(e,t){e.$mdMedia=t}]),angular.module("baoziApp").controller("ProfileCtrl",["$state","md5","auth","profile",function(e,t,n,r){var a=this;a.profile=r,a.updateProfile=function(){a.profile.emailHash=t.createHash(n.email),a.profile.$save()}}]),angular.module("baoziApp").factory("Users",["$firebaseArray","$firebaseObject",function(e,t){var n=firebase.database().ref().child("users"),r=firebase.database().ref().child(".info/connected"),a=e(n);return{getProfile:function(e){return t(n.child(e))},getDisplayName:function(e){return a.$getRecord(e).displayName},getGravatar:function(e){return"http://www.gravatar.com/avatar/"+a.$getRecord(e).emailHash},setOnline:function(a){var o=t(r),l=e(n.child(a+"/online"));o.$watch(function(){o.$value===!0&&l.$add(!0).then(function(e){e.onDisconnect().remove()})})},all:a}}]),angular.module("baoziApp").controller("WeatherCtrl",["$scope","$mdMedia",function(e,t){e.$mdMedia=t}]),angular.module("baoziApp").service("weatherService",["$http",function(e){var t={curWeather:{},forecast:{},getWeather:function(n,r){return n=n||"Sunnyvale,CA",t.curWeather[n]?t.curWeather[n]:(t.curWeather[n]={temp:{},icon:"undefined"},e.get("http://api.openweathermap.org/data/2.5/weather?q="+n+"&units="+r+"&APPID=b253934bbcdd1b68251e3854cc389ca0").success(function(e){e&&(e.main&&(t.curWeather[n].temp.current=e.main.temp,t.curWeather[n].temp.min=e.main.temp_min,t.curWeather[n].temp.max=e.main.temp_max),t.curWeather[n].icon=e.weather[0].icon)}),t.curWeather[n])},getForecast:function(n,r,a){return n=n||"Sunnyvale, CA",t.forecast[n]?t.forecast[n]:(t.forecast[n]={},e.get("http://api.openweathermap.org/data/2.5/forecast/daily?q="+n+"&units="+r+"&cnt="+a+"&APPID=b253934bbcdd1b68251e3854cc389ca0").success(function(e){e&&angular.copy(e,t.forecast[n])}),t.forecast[n])}};return t}]).filter("temp",["$filter",function(e){return function(t,n,r){n||(n=1);var a;switch(r){case"imperial":a="F",t=1.8*(t-273)+32;break;case"metric":a="C",t-=273;break;default:a="K"}var o=e("number");return o(t,n)+"&deg;"+a}}]).filter("temperature",["$filter",function(e){return function(t,n,r){n||(n=1);var a;switch(r){case"imperial":a="F";break;case"metric":a="C";break;default:a="K"}var o=e("number");return o(t,n)+"&deg;"+a}}]).filter("daysNow",function(){return function(e){return(new moment).add(e,"days").format("ddd MMM DD")}}).filter("daysInTheFuture",function(){return function(e){return(new moment).add(e,"days").format("ddd")}}).directive("weatherForecast",function(){return{scope:{location:"@",units:"@?"},restrict:"E",replace:!0,templateUrl:"templates/weather/weatherForecast.tpl.html",link:function(e){e.units=e.units||"metric"}}}).directive("weatherDisplayCard",["weatherService",function(e){return{scope:{location:"=",units:"="},restrict:"E",replace:"true",templateUrl:"templates/weather/weatherDisplayCard.tpl.html",link:function(t){t.findIndex=function(e){return t.forecast.list.indexOf(e)},t.firstday=e.getWeather(t.location,t.units),t.forecast=e.getForecast(t.location,t.units,"5")}}}]).directive("weatherGoogleIcon",function(){return{restrict:"E",replace:!0,scope:{icon:"@",customSize:"@?"},link:function(e){e.imgUrl=function(){var t="images/weathericon/";return t+e.icon+".png"}},template:'<img style="height:{{customSize}}px;width:{{customSize}}px;" class="md-card-image" ng-src="{{imgUrl()}}">'}}).directive("weather",function(){return{templateUrl:"templates/weather/weather.html",restrict:"E",controller:"WeatherController",controllerAs:"weather",replace:!0}});