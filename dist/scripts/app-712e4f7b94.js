"use strict";angular.module("baoziApp",["ngMaterial","ngMessages","ngSanitize","angular-md5","firebase","ui.router","md.data.table","uiGmapgoogle-maps"]).config(function(){var e={apiKey:"AIzaSyAI4HCemOw16WDwFWhjN7k443LF6PufuRM",authDomain:"zhenling-project.firebaseapp.com",databaseURL:"https://zhenling-project.firebaseio.com",storageBucket:""};firebase.initializeApp(e)}).run(["$rootScope","$state",function(e,t){e.$on("$stateChangeError",function(e,r,n,a,o,i){return e.preventDefault(),t.get("error").error={code:i.code},t.go("error")})}]).config(["$stateProvider","$urlRouterProvider",function(e,t){t.otherwise("/"),e.state("home",{url:"/",templateUrl:"templates/weather/weather.html",controller:"WeatherCtrl as weather",resolve:{requireNoAuth:["$state","Auth",function(e,t){return t.$requireSignIn().then(function(){e.go("panel.profile")})["catch"](function(e){console.error(e)})}]}}).state("error",{url:"/error",resolve:{errorObj:[function(){return this.self.error}]},controller:"ErrorCtrl as errorCtrl",templateUrl:"views/error.html"}).state("panel",{"abstract":!0,templateUrl:"templates/panel/panel.html",controller:"PanelCtrl as panel",resolve:{auth:["$state","Users","Auth",function(e,t,r){return r.$requireSignIn()["catch"](function(){e.go("home"),console.error("No User")})}]}}).state("panel.chat",{url:"/chat",templateUrl:"templates/panel/chat/chat.html",controller:"ChatCtrl as chatCtrl",resolve:{channels:["Channels",function(e){return e.$loaded()}],profile:["$state","Auth","Users",function(e,t,r){return t.$requireSignIn().then(function(t){return r.getProfile(t.uid).$loaded().then(function(t){return t.displayName?t:void e.go("panel.profile")})},function(t){console.error(t),e.go("home")})}]}}).state("panel.chat.create",{url:"/create",templateUrl:"templates/panel/chat/create.html",controller:"ChatCtrl as chatCtrl"}).state("panel.chat.messages",{url:"/{channelId}/messages",templateUrl:"templates/panel/chat/messages.html",controller:"MessageCtrl as messageCtrl",resolve:{messages:["$stateParams","Messages",function(e,t){return t.forChannel(e.channelId).$loaded()}],channelName:["$stateParams","channels",function(e,t){return"#"+t.$getRecord(e.channelId).name}],isChannel:function(){return!0}}}).state("panel.chat.direct",{url:"/{uid}/messages/direct",templateUrl:"templates/panel/chat/messages.html",controller:"MessageCtrl as messageCtrl",resolve:{messages:["$stateParams","Messages","profile",function(e,t,r){return t.forUsers(e.uid,r.$id).$loaded()}],channelName:["$stateParams","Users",function(e,t){return t.all.$loaded().then(function(){return"@"+t.getDisplayName(e.uid)})}],isChannel:function(){return!1}}}).state("panel.map",{url:"/map",templateUrl:"templates/panel/map/map.html",controller:"MapCtrl as mapCtrl",resolve:{profile:["$state","Auth","Users",function(e,t,r){return t.$requireSignIn().then(function(t){return r.getProfile(t.uid).$loaded().then(function(t){return t.displayName?t:void e.go("panel.profile")})},function(t){console.error(t),e.go("home")})}],businesses:["Businesses",function(e){return e.forBusiness().$loaded()}]}}).state("panel.meetup",{url:"/meetup",templateUrl:"templates/panel/meetup/meetup.html",controller:"MeetupCtrl as meetupCtrl",resolve:{profile:["$state","Auth","Users",function(e,t,r){return t.$requireSignIn().then(function(t){return r.getProfile(t.uid).$loaded().then(function(t){return t.displayName?t:void e.go("panel.profile")})},function(t){console.error(t),e.go("home")})}],meetups:["Meetups",function(e){return e.forMeetup().$loaded()}]}}).state("panel.business",{url:"/business",templateUrl:"templates/panel/business/business.html",controller:"BusinessCtrl as businessCtrl",resolve:{profile:["$state","Auth","Users",function(e,t,r){return t.$requireSignIn().then(function(t){return r.getProfile(t.uid).$loaded().then(function(t){return t.displayName?t:void e.go("panel.profile")})},function(t){console.log(t),e.go("home")})}],businesses:["Businesses",function(e){return e.forBusiness().$loaded()}],methods:["Methods","Auth",function(e,t){return t.$requireSignIn().then(function(t){return e.forMethod(t.uid).$loaded()})}],products:["Products",function(e){return e.forProduct().$loaded()}]}}).state("panel.blog",{url:"/blog",templateUrl:"templates/panel/chat/blog.html",controller:"PanelCtrl as panel",parent:"panel"}).state("panel.profile",{url:"/profile",controller:"ProfileCtrl as profileCtrl",templateUrl:"templates/panel/profile/profile.html",parent:"panel",resolve:{auth:["$state","Auth",function(e,t){return t.$requireSignIn()["catch"](function(){e.go("home"),console.log("No User")})}],profile:["Users","Auth",function(e,t){return t.$requireSignIn().then(function(t){return e.getProfile(t.uid).$loaded()})}],methods:["Methods","Auth",function(e,t){return t.$requireSignIn().then(function(t){return e.forMethod(t.uid).$loaded()})}]}})}]),angular.module("baoziApp").controller("AuthCtrl",["$state","Auth","$firebaseAuth","$firebaseObject","md5",function(e,t,r,n,a){var o=this,i=firebase.database().ref();o.user={email:"",password:""},o.guestLogin=function(){t.$signInAnonymously().then(function(t){e.go("panel.profile"),i.child("users").child(t.uid).set({displayName:"Guest-"+t.uid.substring(0,5),emailHash:t.uid,role:"guest"})},function(e){o.error=e})},o.login=function(){t.$signInWithEmailAndPassword(o.user.email,o.user.password).then(function(){e.go("panel.profile")},function(e){o.error=e})},o.register=function(){t.$createUserWithEmailAndPassword(o.user.email,o.user.password).then(function(e){i.child("users").child(e.uid).set({displayName:o.user.email,emailHash:a.createHash(o.user.email),mitbbsId:"",role:"buyer"}),i.child("methods").child(e.uid).push().set({paymentMethods:""}),o.login()})["catch"](function(e){o.error=e})}}]),angular.module("baoziApp").directive("userAuth",function(){return{templateUrl:"templates/components/auth/userauth.html",restrict:"E",controller:"AuthCtrl",controllerAs:"authCtrl",replace:!0,link:function(e){e.isLogin=!0,e.toLoginPage=function(){e.isLogin=!0},e.toRegisterPage=function(){e.isLogin=!1}}}}),angular.module("baoziApp").factory("Auth",["$firebaseAuth",function(e){return e()}]),angular.module("baoziApp").controller("MenulinkController",["$scope","$mdMedia",function(e,t){e.$mdMedia=t}]),angular.module("baoziApp").service("menu",function(){var e=[];return e.push({name:"My Profile",link:"panel.profile",icon:"&#xE55B;",awesome_icon:"fa fa-user"},{name:"Inventory Map",link:"panel.map",icon:"&#xE55B;",awesome_icon:"fa fa-map"},{name:"Business",link:"panel.business",icon:"&#xEB3F;",awesome_icon:"fa fa-briefcase"},{name:"Happy Chat",link:"panel.chat",icon:"&#xE0B7;",awesome_icon:"fa fa-comments"}),e}).directive("menuLink",["menu",function(e){return{scope:{section:"="},templateUrl:"templates/components/menulink/menulink.html",restrict:"E",controller:"MenulinkController",controllerAs:"menulink",replace:!0,link:function(t){t.menu=e}}}]).directive("isActiveLink",["$state",function(e){return{restrict:"A",replace:!1,link:function(t,r){var n=function(){var t=["#/"+e.current.name.split(".")[1],"#"+e.current.name.split(".")[1],e.current.name.split(".")[1]];angular.forEach(r.find("a"),function(e){e=angular.element(e);var r=e.children();-1!==t.indexOf(e.attr("href"))?r.addClass("mdl-color-text--green-400").removeClass("mdl-color-text--blue-grey-400"):r.removeClass("mdl-color-text--green-400").addClass("mdl-color-text--blue-grey-400")})};t.init=n,t.init(),t.$on("$stateChangeSuccess",n)}}}]),angular.module("baoziApp").controller("NavbarController",["$scope","$mdMedia","$mdSidenav",function(e,t,r){e.$mdMedia=t,e.$mdSidenav=r}]),angular.module("baoziApp").directive("navBar",function(){return{templateUrl:"templates/components/navbar/navbar.html",restrict:"E",controller:"NavbarController",controllerAs:"navbar",replace:!0}}),angular.module("baoziApp").controller("SidenavController",["$scope","$state","$timeout","$mdSidenav","$log","Users","Auth",function(e,t,r,n,a,o,i){var s=function(e,t){return t.$requireSignIn().then(function(t){return e.getProfile(t.uid).$loaded()})}(o,i);s.then(function(t){return e.emailHash=t.emailHash,e.name=t.displayName,t},function(e){console.log(e)}),e.logout=function(){s.then(function(e){"guest"===e.role?(console.log(e),e.$remove(),i.$deleteUser().then(function(){t.go("home"),console.debug("User removed successfully!")})["catch"](function(e){console.error("Error: ",e)})):(i.$signOut(),e.online=null,e.$save().then(function(){t.go("home")}))})},e.close=function(){n("left").close()}}]),angular.module("baoziApp").directive("sideNav",function(){return{templateUrl:"templates/components/sidenav/sidenav.html",restrict:"E",controller:"SidenavController",controllerAs:"sidenav",replace:!0}}),angular.module("baoziApp").controller("ErrorCtrl",["$scope","errorObj",function(e,t){var r=this;r.error=t}]),angular.module("baoziApp").controller("BusinessCtrl",["$scope","$mdDialog","$firebaseObject","$mdMedia","$firebaseArray","profile","businesses","methods","products",function(e,t,r,n,a,o,i,s,l){var u=firebase.database().ref(),c=this;e.query={filter:"",order:"mitbbsId",limit:5,page:1},e.businesses=i,e.selected=[];var d=r(u.child("isDisabled"));d.$bindTo(e,"isDisabled").then(function(){e.status=e.isDisabled.$value,e.toggledisableAdd=function(){e.isDisabled.$value===!0?(e.isDisabled.$value=!1,e.status=!1):(e.isDisabled.$value=!0,e.status=!0)}}),e.isadmin="admin"===o.role,e.isshenyi="shenyi"===o.role;var p=function(e,r,n,a,i){function c(t){"payment"===e.confirmTarget?t.paid||(t.paid=(new Date).toDateString(),a.$save(t)):"delivery"===e.confirmTarget&&(t.delivered||(t.delivered=(new Date).toDateString(),a.$save(t)))}function d(r){n.length>0?null===r.$value?e.error="Invalid Secret.":(n.forEach(c),t.cancel()):e.error="You need at least select one record."}function p(){e.error="Invalid Secret."}var m=function(){return{mitbbsId:e.mitbbsId,product:e.product,price:e.price,quantity:e.quantity,location:e.location,detailLoc:e.detailLoc,zipCode:e.zipCode,paymentMethod:e.paymentMethod,paid:!1,delivered:!1}},f=function(){return{product_name:e.name,product_price:e.price}},h=!1;e.cancel=function(){t.cancel()},e.mitbbsId=o.mitbbsId,e.products=l,e.methods=s,e.confirmTarget=i,e.uploadProduct=function(){a.$add(m()),t.hide()},e.writePrice=function(t){e.price=parseInt(t.product_price)},e.modifyProduct=function(t){e.updateProduct=t,e.name=t.product_name,e.price=t.product_price,h=!0},e.saveProduct=function(){h?(e.updateProduct.product_name=e.name,e.updateProduct.product_price=e.price,l.$save(e.updateProduct)):l.$add(f()),t.hide()},e.authorizeUser=function(){r(u.child(e.secret)).$loaded().then(d,p)}};p.$inject=["$scope","$firebaseObject","selectedBusinesses","businesses","confirmTarget"],c.showDialogInventory=function(r){var a=n("sm")||n("xs");t.show({controller:p,templateUrl:"templates/panel/business/business.create.html",parent:angular.element(document.body),targetEvent:r,clickOutsideToClose:!0,locals:{selectedBusinesses:e.selected,businesses:e.businesses,products:l,confirmTarget:""},fullscreen:a})},c.showDialogAddProduct=function(r){var a=n("sm")||n("xs");t.show({controller:p,templateUrl:"templates/panel/business/business.product.html",parent:angular.element(document.body),targetEvent:r,clickOutsideToClose:!0,locals:{selectedBusinesses:e.selected,businesses:e.businesses,products:l,confirmTarget:""},fullscreen:a})},c.showDialogPaymentConfirmation=function(r){var a=n("sm")||n("xs");t.show({controller:p,templateUrl:"templates/panel/business/business.payment.confirm.html",parent:angular.element(document.body),targetEvent:r,clickOutsideToClose:!0,locals:{selectedBusinesses:e.selected,businesses:e.businesses,confirmTarget:"payment"},fullscreen:a})},c.showDialogDeliveredConfirmation=function(r){var a=n("sm")||n("xs");t.show({controller:p,templateUrl:"templates/panel/business/business.delivery.confirm.html",parent:angular.element(document.body),targetEvent:r,clickOutsideToClose:!0,locals:{selectedBusinesses:e.selected,businesses:e.businesses,confirmTarget:"delivery"},fullscreen:a})}}]),angular.module("baoziApp").directive("meetupCreate",function(){return{restrict:"E",replace:!0,templateUrl:"templates/panel/business/business.create.html"}}),angular.module("baoziApp").directive("indicatorDonut",function(){return{restrict:"E",replace:!0,transclude:!0,controller:["$scope","$element",function(e,t){function r(e){return e*(Math.PI/180)}function n(e){return 360*e}function a(e,t,r){return{innerRadius:(e+r)*t,outerRadius:(e+r)*t}}e.radius=t.find("circle")[0].r.baseVal.value,e.canvasWidth=t.attr("width"),e.canvasHeight=t.attr("height"),e.spacing=.9,e.drawArc=function(){return d3.svg.arc().innerRadius(function(e){return e.innerRadius}).outerRadius(function(e){return e.outerRadius}).startAngle(0).endAngle(function(e){return e.endAngle})},e.pathColor=function(e){return e<.25?"red":e>=.25&&e<.5?"orange":"green"},e.getArcInfo=function(e,t,o,i){var s=n(t),l=a(e,o,i);return{innerRadius:l.innerRadius,outerRadius:l.outerRadius,startAngle:0,endAngle:r(s)}},e.tweenArc=function(e,t){return function(r){var n=d3.interpolate(r,e);for(var a in e)r[a]=e[a];return function(e){return t(n(e))}}}}],templateUrl:"templates/panel/business/business.indicator.html",scope:{submitCount:"@",deliveryCount:"@",paidCount:"@",expected:"@",name:"@"}}}).directive("pathGroup",function(){return{requires:"^indicatorDonut",link:function(e,t){e.deliveryCount=t.attr("transform","translate("+e.canvasWidth/2+","+e.canvasHeight/2+")")}}}).directive("deliveryPath",function(){return{restrict:"A",transclude:!0,requires:"^pathGroup",scope:{percentage:"@"},link:function(e,t){var r=d3.select(t[0]),n=e.$parent.drawArc(),a=e.$parent.getArcInfo(1.1,e.percentage,e.$parent.radius,.05);a.endAngle;a.endAngle=0,r.datum(a).attr("d",n);e.$watch("percentage",function(){var a=t.attr("class").split(/\s+/);r.transition().delay(100).duration(2e3).attrTween("d",e.$parent.tweenArc({endAngle:360*e.percentage*(Math.PI/180)},n)),a.indexOf("green")==-1&&a.indexOf("red")==-1&&a.indexOf("orange")?t.addClass(e.$parent.pathColor(e.percentage)):(a.indexOf("green")>-1&&t.removeClass("green"),a.indexOf("red")>-1&&t.removeClass("red"),a.indexOf("orange")>-1&&t.removeClass("orange"),t.addClass(e.$parent.pathColor(e.percentage)))})}}}).directive("paidPath",function(){return{restrict:"A",transclude:!0,requires:"^pathGroup",scope:{percentage:"@"},link:function(e,t){var r=d3.select(t[0]),n=e.$parent.drawArc(),a=e.$parent.getArcInfo(1.2,e.percentage,e.$parent.radius,.1);a.endAngle;a.endAngle=0,r.datum(a).attr("d",n),e.$watch("percentage",function(){var a=t.attr("class").split(/\s+/);r.transition().delay(100).duration(2e3).attrTween("d",e.$parent.tweenArc({endAngle:360*e.percentage*(Math.PI/180)},n)),a.indexOf("green")==-1&&a.indexOf("red")==-1&&a.indexOf("orange")?t.addClass(e.$parent.pathColor(e.percentage)):(a.indexOf("green")>-1&&t.removeClass("green"),a.indexOf("red")>-1&&t.removeClass("red"),a.indexOf("orange")>-1&&t.removeClass("orange"),t.addClass(e.$parent.pathColor(e.percentage)))})}}}).directive("generalPath",function(){return{restrict:"A",transclude:!0,requires:"^pathGroup",scope:{percentage:"@"},link:function(e,t){var r=d3.select(t[0]),n=e.$parent.drawArc(),a=e.$parent.getArcInfo(1.3,e.percentage,e.$parent.radius,.15);a.endAngle;a.endAngle=0,r.datum(a).attr("d",n),e.$watch("percentage",function(){var a=t.attr("class").split(/\s+/);r.transition().delay(100).duration(2e3).attrTween("d",e.$parent.tweenArc({endAngle:360*e.percentage*(Math.PI/180)},n)),a.indexOf("green")==-1&&a.indexOf("red")==-1&&a.indexOf("orange")?t.addClass(e.$parent.pathColor(e.percentage)):(a.indexOf("green")>-1&&t.removeClass("green"),a.indexOf("red")>-1&&t.removeClass("red"),a.indexOf("orange")>-1&&t.removeClass("orange"),t.addClass(e.$parent.pathColor(e.percentage)))})}}}),angular.module("baoziApp").factory("Businesses",["ArrayWithSum",function(e){var t=firebase.database().ref().child("businesses");return{forBusiness:function(){return e(t)},all:t}}]).factory("Products",["$firebaseArray",function(e){var t=firebase.database().ref().child("products");return{forProduct:function(){return e(t)},all:t}}]).factory("ArrayWithSum",["$firebaseArray",function(e){return e.$extend({sum:function(){var e={};return angular.forEach(this.$list,function(t){t.product in e?e[t.product]+=t.quantity:e[t.product]=t.quantity}),e},sumP:function(){var e={};return angular.forEach(this.$list,function(t){t.product in e?t.paid&&(e[t.product]+=t.quantity):t.paid&&(e[t.product]=t.quantity)}),e},sumD:function(){var e={};return angular.forEach(this.$list,function(t){t.product in e?t.delivered&&(e[t.product]+=t.quantity):t.delivered&&(e[t.product]=t.quantity)}),e}})}]),angular.module("baoziApp").controller("ChatCtrl",["$scope","$state","$mdMedia","Auth","Users","channels","profile",function(e,t,r,n,a,o,i){a.setOnline(i.$id);var s=this;s.direction=!1,s.profile=i,s.channels=o,s.getDisplayName=a.getDisplayName,s.getGravatar=a.getGravatar,s.newChannel={name:""},s.createChannel=function(){s.channels.$add(s.newChannel).then(function(e){t.go("panel.chat.messages",{channelId:e.key()}),s.newChannel={name:""}})},s.toggle=function(){s.direction=!s.direction},s.users=a.all}]),angular.module("baoziApp").directive("scrollBottom",function(){return{scope:{scrollBottom:"="},link:function(e,t){e.$watchCollection("scrollBottom",function(){$(t).scrollTop($(t)[0].scrollHeight)})}}}),angular.module("baoziApp").factory("Channels",["$firebaseArray",function(e){var t=firebase.database().ref().child("channels"),r=e(t);return r}]).factory("Messages",["$firebaseArray",function(e){var t=firebase.database().ref().child("channelMessages"),r=firebase.database().ref().child("userMessages");return{forChannel:function(r){return e(t.child(r))},forUsers:function(t,n){var a=t<n?t+"/"+n:n+"/"+t;return e(r.child(a))}}}]),angular.module("baoziApp").controller("MessageCtrl",["$mdMedia","profile","channelName","messages","isChannel",function(e,t,r,n,a){var o=this;o.$mdMedia=e,o.messages=n,o.channelName=r,o.message="",o.profile=t,o.isChannel=a,o.sendMessage=function(){o.message.length>0&&o.messages.$add({uid:t.$id,body:o.message,timestamp:firebase.database.ServerValue.TIMESTAMP}).then(function(){o.message=""})}}]),angular.module("baoziApp").controller("MapCtrl",["$scope","profile","businesses",function(e,t,r){for(var n=new google.maps.LatLng(39,(-95)),a=[],o=function(t){console.log("click"),t.showWindow=!1,e.$apply()},i=0;i<r.length;i++)a.push({id:i,latitude:r[i].detailLoc[0],longitude:r[i].detailLoc[1],showWindow:!1});console.log(a),_.each(a,function(t){t.closeClick=function(){t.showWindow=!1,e.$apply()},t.mitbbsId=r[t.id].mitbbsId,t.product=r[t.id].product,t.quantity=r[t.id].quantity,t.location=r[t.id].location,t.onClicked=function(){o(t)}}),e.markers=a,e.map={center:n,zoom:5}}]),angular.module("baoziApp").controller("MeetupCtrl",["$scope","$mdDialog","$firebaseObject","$mdMedia","profile","Meetups","meetups",function(e,t,r,n,a,o,i){var s=this;s.meetups=i,console.log(s.meetups),s.host=a.displayName;var l=function(e){var r=function(){var t="undefined"==typeof e.description?"":e.description;return console.log(e.guest),e.guest=e.guest.replace(/(^,)|(,$)/g,""),e.guests=e.guest.split(","),{name:e.name,host:e.host,type:e.type,location:e.location,detailLoc:e.detailLoc,guests:e.guests,startDateTime:new Date(e.startDateTime).getTime(),endDateTime:new Date(e.endDateTime).getTime(),description:t,createDate:(new Date).getTime(),createBy:a.displayName}};e.cancel=function(){t.cancel()},e.host=a.displayName,e.createEvent=function(){o.all.push(r()),t.hide()},e.types=["Conference","Meeting","Party","Wedding","Social Networking","Birthday","Family","Sport","Other"]};l.$inject=["$scope"],s.showDialog=function(e){var r=n("sm")||n("xs");t.show({controller:l,templateUrl:"templates/panel/meetup/meetup.create.html",parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!0,fullscreen:r})}}]),angular.module("baoziApp").directive("meetupCreate",function(){return{restrict:"E",replace:!0,templateUrl:"templates/panel/meetup/meetup.create.html"}}),angular.module("baoziApp").factory("Meetups",["$firebaseArray",function(e){var t=firebase.database().ref().child("meetups");return{forMeetup:function(){return e(t)},all:t}}]),angular.module("baoziApp").controller("PanelCtrl",["$scope","$mdMedia",function(e,t){e.$mdMedia=t}]),angular.module("baoziApp").controller("ProfileCtrl",["$state","$mdDialog","$mdMedia","$firebaseArray","md5","auth","profile","methods",function(e,t,r,n,a,o,i,s){var l=this;l.methods=s;var u=function(e){e.cancel=function(){t.cancel()},e.savePaymentMethod=function(){console.log(s),s.$add({paymentMethods:e.paymentMethod}),t.hide()}};u.$inject=["$scope"],l.profile=i,l.updateProfile=function(){l.profile.emailHash=a.createHash(o.email),l.profile.$save()},l.updateMethod=function(e){l.methods.$save(e)},l.deleteMethod=function(e){l.methods.$remove(e)},l.showDialogPaymentMethod=function(e){var n=r("sm")||r("xs");t.show({controller:u,templateUrl:"templates/panel/profile/profile.payment.method.html",parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!0,fullscreen:n})}}]),angular.module("baoziApp").factory("Methods",["$firebaseArray",function(e){var t=firebase.database().ref().child("methods");return{forMethod:function(r){return e(t.child(r))},all:t}}]),angular.module("baoziApp").factory("Users",["$firebaseArray","$firebaseObject",function(e,t){var r=firebase.database().ref().child("users"),n=firebase.database().ref().child(".info/connected"),a=e(r);return{getProfile:function(e){return t(r.child(e))},getDisplayName:function(e){return a.$getRecord(e).displayName},getGravatar:function(e){return"http://www.gravatar.com/avatar/"+a.$getRecord(e).emailHash},setOnline:function(a){var o=t(n),i=e(r.child(a+"/online"));o.$watch(function(){o.$value===!0&&i.$add(!0).then(function(e){e.onDisconnect().remove()})})},all:a}}]),angular.module("baoziApp").controller("WeatherCtrl",["$scope","$mdMedia",function(e,t){e.$mdMedia=t}]),angular.module("baoziApp").service("weatherService",["$http",function(e){var t={curWeather:{},forecast:{},getWeather:function(r,n){return r=r||"Sunnyvale,CA",t.curWeather[r]?t.curWeather[r]:(t.curWeather[r]={temp:{},icon:"undefined"},e.get("http://api.openweathermap.org/data/2.5/weather?q="+r+"&units="+n+"&APPID=b253934bbcdd1b68251e3854cc389ca0").success(function(e){e&&(e.main&&(t.curWeather[r].temp.current=e.main.temp,t.curWeather[r].temp.min=e.main.temp_min,t.curWeather[r].temp.max=e.main.temp_max),t.curWeather[r].icon=e.weather[0].icon)}),t.curWeather[r])},getForecast:function(r,n,a){return r=r||"Sunnyvale, CA",t.forecast[r]?t.forecast[r]:(t.forecast[r]={},e.get("http://api.openweathermap.org/data/2.5/forecast/daily?q="+r+"&units="+n+"&cnt="+a+"&APPID=b253934bbcdd1b68251e3854cc389ca0").success(function(e){e&&angular.copy(e,t.forecast[r])}),t.forecast[r])}};return t}]).filter("temp",["$filter",function(e){return function(t,r,n){r||(r=1);var a;switch(n){case"imperial":a="F",t=1.8*(t-273)+32;break;case"metric":a="C",t-=273;break;default:a="K"}var o=e("number");return o(t,r)+"&deg;"+a}}]).filter("temperature",["$filter",function(e){return function(t,r,n){r||(r=1);var a;switch(n){case"imperial":a="F";break;case"metric":a="C";break;default:a="K"}var o=e("number");return o(t,r)+"&deg;"+a}}]).filter("daysNow",function(){return function(e){return(new moment).add(e,"days").format("ddd MMM DD")}}).filter("daysInTheFuture",function(){return function(e){return(new moment).add(e,"days").format("ddd")}}).directive("weatherForecast",function(){return{scope:{location:"@",units:"@?"},restrict:"E",replace:!0,templateUrl:"templates/weather/weatherForecast.tpl.html",link:function(e){e.units=e.units||"metric"}}}).directive("weatherDisplayCard",["weatherService",function(e){return{scope:{location:"=",units:"="},restrict:"E",replace:"true",templateUrl:"templates/weather/weatherDisplayCard.tpl.html",link:function(t){t.findIndex=function(e){return t.forecast.list.indexOf(e)},t.firstday=e.getWeather(t.location,t.units),t.forecast=e.getForecast(t.location,t.units,"5")}}}]).directive("weatherGoogleIcon",function(){return{restrict:"E",replace:!0,scope:{icon:"@",customSize:"@?"},link:function(e){e.imgUrl=function(){var t="images/weathericon/";return t+e.icon+".png"}},template:'<img style="height:{{customSize}}px;width:{{customSize}}px;" class="md-card-image" ng-src="{{imgUrl()}}">'}}).directive("weather",function(){return{templateUrl:"templates/weather/weather.html",restrict:"E",controller:"WeatherController",controllerAs:"weather",replace:!0}});