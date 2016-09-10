"use strict";angular.module("baoziApp",["ngMaterial","ngMessages","ngSanitize","angular-md5","firebase","ui.router","md.data.table","uiGmapgoogle-maps","hc.marked"]).config(function(){var e={apiKey:"AIzaSyAI4HCemOw16WDwFWhjN7k443LF6PufuRM",authDomain:"zhenling-project.firebaseapp.com",databaseURL:"https://zhenling-project.firebaseio.com",storageBucket:""};firebase.initializeApp(e)}).config(["markedProvider",function(e){e.setOptions({gfm:!0,tables:!0,highlight:function(e,t){return t?hljs.highlight(t,e,!0).value:hljs.highlightAuto(e).value}})}]).run(["$rootScope","$state",function(e,t){e.$on("$stateChangeError",function(e,n,r,a,o,i){return e.preventDefault(),t.get("error").error={code:i.code},t.go("error")})}]).config(["$stateProvider","$urlRouterProvider",function(e,t){t.otherwise("/"),e.state("home",{url:"/",templateUrl:"templates/weather/weather.html",controller:"WeatherCtrl as weather",resolve:{requireNoAuth:["$state","Auth",function(e,t){return t.$requireSignIn().then(function(){e.go("panel.profile")})["catch"](function(e){console.error(e)})}]}}).state("error",{url:"/error",resolve:{errorObj:[function(){return this.self.error}]},controller:"ErrorCtrl as errorCtrl",templateUrl:"views/error.html"}).state("panel",{"abstract":!0,templateUrl:"templates/panel/panel.html",controller:"PanelCtrl as panel",resolve:{auth:["$state","Users","Auth",function(e,t,n){return n.$requireSignIn()["catch"](function(){e.go("home"),console.error("No User")})}]}}).state("panel.chat",{url:"/chat",templateUrl:"templates/panel/chat/chat.html",controller:"ChatCtrl as chatCtrl",resolve:{channels:["Channels",function(e){return e.$loaded()}],profile:["$state","Auth","Users",function(e,t,n){return t.$requireSignIn().then(function(t){return n.getProfile(t.uid).$loaded().then(function(t){return t.displayName?t:void e.go("panel.profile")})},function(t){console.error(t),e.go("home")})}]}}).state("panel.chat.create",{url:"/create",templateUrl:"templates/panel/chat/create.html",controller:"ChatCtrl as chatCtrl"}).state("panel.chat.messages",{url:"/{channelId}/messages",templateUrl:"templates/panel/chat/messages.html",controller:"MessageCtrl as messageCtrl",resolve:{messages:["$stateParams","Messages",function(e,t){return t.forChannel(e.channelId).$loaded()}],channelName:["$stateParams","channels",function(e,t){return"#"+t.$getRecord(e.channelId).name}],isChannel:function(){return!0}}}).state("panel.chat.direct",{url:"/{uid}/messages/direct",templateUrl:"templates/panel/chat/messages.html",controller:"MessageCtrl as messageCtrl",resolve:{messages:["$stateParams","Messages","profile",function(e,t,n){return t.forUsers(e.uid,n.$id).$loaded()}],channelName:["$stateParams","Users",function(e,t){return t.all.$loaded().then(function(){return"@"+t.getDisplayName(e.uid)})}],isChannel:function(){return!1}}}).state("panel.map",{url:"/map",templateUrl:"templates/panel/map/map.html",controller:"MapCtrl as mapCtrl",resolve:{profile:["$state","Auth","Users",function(e,t,n){return t.$requireSignIn().then(function(t){return n.getProfile(t.uid).$loaded().then(function(t){return t.displayName?t:void e.go("panel.profile")})},function(t){console.error(t),e.go("home")})}],businesses:["Businesses",function(e){return e.forBusiness().$loaded()}]}}).state("panel.meetup",{url:"/meetup",templateUrl:"templates/panel/meetup/meetup.html",controller:"MeetupCtrl as meetupCtrl",resolve:{profile:["$state","Auth","Users",function(e,t,n){return t.$requireSignIn().then(function(t){return n.getProfile(t.uid).$loaded().then(function(t){return t.displayName?t:void e.go("panel.profile")})},function(t){console.error(t),e.go("home")})}],meetups:["Meetups",function(e){return e.forMeetup().$loaded()}]}}).state("panel.business",{url:"/business",templateUrl:"templates/panel/business/business.html",controller:"BusinessCtrl as businessCtrl",resolve:{profile:["$state","Auth","Users",function(e,t,n){return t.$requireSignIn().then(function(t){return n.getProfile(t.uid).$loaded().then(function(t){return t.displayName?t:void e.go("panel.profile")})},function(t){console.log(t),e.go("home")})}],businesses:["Businesses",function(e){return e.forBusiness().$loaded()}],methods:["Methods","Auth",function(e,t){return t.$requireSignIn().then(function(t){return e.forMethod(t.uid).$loaded()})}],products:["Products",function(e){return e.forProduct().$loaded()}]}}).state("panel.blog",{url:"/blog",templateUrl:"templates/panel/blog/blog.html",controller:"BlogCtrl as blogCtrl",parent:"panel",resolve:{profile:["$state","Auth","Users",function(e,t,n){return t.$requireSignIn().then(function(t){return n.getProfile(t.uid).$loaded().then(function(t){return t.displayName?t:void e.go("panel.profile")})},function(t){console.error(t),e.go("home")})}]}}).state("panel.profile",{url:"/profile",controller:"ProfileCtrl as profileCtrl",templateUrl:"templates/panel/profile/profile.html",parent:"panel",resolve:{auth:["$state","Auth",function(e,t){return t.$requireSignIn()["catch"](function(){e.go("home"),console.log("No User")})}],profile:["Users","Auth",function(e,t){return t.$requireSignIn().then(function(t){return e.getProfile(t.uid).$loaded()})}],methods:["Methods","Auth",function(e,t){return t.$requireSignIn().then(function(t){return e.forMethod(t.uid).$loaded()})}]}})}]),angular.module("baoziApp").controller("AuthCtrl",["$state","Auth","$firebaseAuth","$firebaseObject","md5",function(e,t,n,r,a){var o=this,i=firebase.database().ref();o.user={email:"",password:""},o.guestLogin=function(){t.$signInAnonymously().then(function(t){e.go("panel.profile"),i.child("users").child(t.uid).set({displayName:"Guest-"+t.uid.substring(0,5),emailHash:t.uid,role:"guest"})},function(e){o.error=e})},o.login=function(){t.$signInWithEmailAndPassword(o.user.email,o.user.password).then(function(){e.go("panel.profile")},function(e){o.error=e})},o.register=function(){t.$createUserWithEmailAndPassword(o.user.email,o.user.password).then(function(e){i.child("users").child(e.uid).set({displayName:o.user.email,emailHash:a.createHash(o.user.email),mitbbsId:"",role:"buyer"}),i.child("methods").child(e.uid).push().set({paymentMethods:""}),o.login()})["catch"](function(e){o.error=e})},o.resetPassword=function(){t.$sendPasswordResetEmail(o.user.email).then(function(){console.log("Password reset email send successfully!")})["catch"](function(e){console.error("Error: ",e)})}}]),angular.module("baoziApp").directive("userAuth",function(){return{templateUrl:"templates/components/auth/userauth.html",restrict:"E",controller:"AuthCtrl",controllerAs:"authCtrl",replace:!0,link:function(e){e.isLogin=!0,e.toLoginPage=function(){e.isLogin=!0},e.toRegisterPage=function(){e.isLogin=!1}}}}),angular.module("baoziApp").factory("Auth",["$firebaseAuth",function(e){return e()}]),angular.module("baoziApp").controller("MenulinkController",["$scope","$mdMedia",function(e,t){e.$mdMedia=t}]),angular.module("baoziApp").service("menu",function(){var e=[];return e.push({name:"My Profile",link:"panel.profile",icon:"&#xE55B;",awesome_icon:"fa fa-user"},{name:"Inventory Map",link:"panel.map",icon:"&#xE55B;",awesome_icon:"fa fa-map"},{name:"Business",link:"panel.business",icon:"&#xEB3F;",awesome_icon:"fa fa-briefcase"},{name:"Blog",link:"panel.blog",icon:"&#xE87A;",awesome_icon:"fa fa-pencil"},{name:"Happy Chat",link:"panel.chat",icon:"&#xE0B7;",awesome_icon:"fa fa-comments"}),e}).directive("menuLink",["menu",function(e){return{scope:{section:"="},templateUrl:"templates/components/menulink/menulink.html",restrict:"E",controller:"MenulinkController",controllerAs:"menulink",replace:!0,link:function(t){t.menu=e}}}]).directive("isActiveLink",["$state",function(e){return{restrict:"A",replace:!1,link:function(t,n){var r=function(){var t=["#/"+e.current.name.split(".")[1],"#"+e.current.name.split(".")[1],e.current.name.split(".")[1]];angular.forEach(n.find("a"),function(e){e=angular.element(e);var n=e.children();-1!==t.indexOf(e.attr("href"))?n.addClass("mdl-color-text--green-400").removeClass("mdl-color-text--blue-grey-400"):n.removeClass("mdl-color-text--green-400").addClass("mdl-color-text--blue-grey-400")})};t.init=r,t.init(),t.$on("$stateChangeSuccess",r)}}}]),angular.module("baoziApp").controller("NavbarController",["$scope","$mdMedia","$mdSidenav",function(e,t,n){e.$mdMedia=t,e.$mdSidenav=n}]),angular.module("baoziApp").directive("navBar",function(){return{templateUrl:"templates/components/navbar/navbar.html",restrict:"E",controller:"NavbarController",controllerAs:"navbar",replace:!0}}),angular.module("baoziApp").controller("SidenavController",["$scope","$state","$timeout","$mdSidenav","$log","Users","Auth",function(e,t,n,r,a,o,i){var l=function(e,t){return t.$requireSignIn().then(function(t){return e.getProfile(t.uid).$loaded()})}(o,i);l.then(function(t){return e.emailHash=t.emailHash,e.name=t.displayName,t},function(e){console.log(e)}),e.logout=function(){l.then(function(e){"guest"===e.role?(console.log(e),e.$remove(),i.$deleteUser().then(function(){t.go("home"),console.debug("User removed successfully!")})["catch"](function(e){console.error("Error: ",e)})):(i.$signOut(),e.online=null,e.$save().then(function(){t.go("home")}))})},e.close=function(){r("left").close()}}]),angular.module("baoziApp").directive("sideNav",function(){return{templateUrl:"templates/components/sidenav/sidenav.html",restrict:"E",controller:"SidenavController",controllerAs:"sidenav",replace:!0}}),angular.module("baoziApp").controller("ErrorCtrl",["$scope","errorObj",function(e,t){var n=this;n.error=t}]),angular.module("baoziApp").controller("BlogCtrl",["$scope","$mdDialog","$firebaseObject","$mdMedia","profile","Blogs",function(e,t,n,r,a,o){function i(){o.forBlog("mainthread").$loaded().then(function(e){l.blogs=e,console.log(l.blogs)})}var l=this;l.blogs="",l.profile=a,l.host=a.displayName;var s={"Main Thread":["Job","Stock","Ebiz","Second Hand","Immigration"],Shuati:["LeetCode","面经"],Travel:["美国： 走遍美国","中国： 大好河山"],"Contact Developer":["Bug Report","Feature Request"]};l.changeContent=function(e){o.forBlog(e.replace(" ","").toLowerCase()).$loaded().then(function(e){l.blogs=e})},i(),l.types=Object.keys(s),console.debug(l.types);var c=function(e,n,r,i){e.types=n,e.title=""!==i?i.title:e.title,e.content=""!==i?i.content:e.content;var s=function(){var t="undefined"==typeof e.content?"":e.content;return{title:e.title,type:e.type,subtype:e.subtype,content:t,createDate:(new Date).getTime(),createBy:a.displayName}};e.cancel=function(){t.cancel()},e.host=a.displayName,e.createPost=function(){console.log(e.type.replace(" ","").toLowerCase()),o.all.child(e.type.replace(" ","").toLowerCase()).push(s()),t.hide()},e.updatePost=function(){console.log(i),i.title=e.title,i.content=e.content,l.blogs.$save(i),t.hide()},e.subtypeChooser=function(t){e.subtypes=r[t]}};c.$inject=["$scope","types","typesCollection","post"],l.showDialogEditPost=function(e,n){var a=r("sm")||r("xs");t.show({controller:c,templateUrl:"templates/panel/blog/blog.edit.html",parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!0,locals:{types:l.types,typesCollection:s,post:n},fullscreen:a})},l.showDialogAddPost=function(e){var n=r("sm")||r("xs");t.show({controller:c,templateUrl:"templates/panel/blog/blog.create.html",parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!0,locals:{types:l.types,typesCollection:s,post:""},fullscreen:n})}}]),angular.module("baoziApp").factory("Blogs",["$firebaseArray",function(e){var t=firebase.database().ref().child("blogs");return{forBlog:function(n){return e(t.child(n))},all:t}}]),angular.module("baoziApp").controller("BusinessCtrl",["$element","$scope","$mdDialog","$firebaseObject","$mdMedia","$firebaseArray","$window","profile","businesses","methods","products",function(e,t,n,r,a,o,i,l,s,c,u){function d(){m.listStyle.height=.6*i.innerHeight+"px",t.$root.$$phase||t.$digest()}var p=firebase.database().ref(),m=this;t.query={filter:"",order:"mitbbsId",limit:5,page:1},t.businesses=s,t.selected=[];var f=r(p.child("isDisabled"));f.$bindTo(t,"isDisabled").then(function(){t.status=t.isDisabled.$value,t.toggledisableAdd=function(){t.isDisabled.$value===!0?(t.isDisabled.$value=!1,t.status=!1):(t.isDisabled.$value=!0,t.status=!0)}}),t.isadmin="admin"===l.role,t.isshenyi="shenyi"===l.role;var h=function(e,t,r,a,o){function i(t){"payment"===e.confirmTarget?t.paid||(t.paid=(new Date).toDateString(),a.$save(t)):"delivery"===e.confirmTarget&&(t.delivered||(t.delivered=(new Date).toDateString(),a.$save(t)))}function s(t){r.length>0?null===t.$value?e.error="Invalid Secret.":(r.forEach(i),n.cancel()):e.error="You need at least select one record."}function d(){e.error="Invalid Secret."}var m=function(){return{mitbbsId:e.mitbbsId,product:e.product,price:e.price,quantity:e.quantity,location:e.location,detailLoc:e.detailLoc,zipCode:e.zipCode,paymentMethod:e.paymentMethod,paid:!1,delivered:!1}},f=function(){return{product_name:e.name,product_price:e.price}},h=!1;e.cancel=function(){n.cancel()},e.mitbbsId=l.mitbbsId,e.products=u,e.methods=c,e.confirmTarget=o,e.uploadProduct=function(){a.$add(m()),n.hide()},e.writePrice=function(t){e.price=parseInt(t.product_price)},e.modifyProduct=function(t){e.updateProduct=t,e.name=t.product_name,e.price=t.product_price,h=!0},e.saveProduct=function(){h?(e.updateProduct.product_name=e.name,e.updateProduct.product_price=e.price,u.$save(e.updateProduct)):u.$add(f()),n.hide()},e.authorizeUser=function(){t(p.child(e.secret)).$loaded().then(s,d)}};h.$inject=["$scope","$firebaseObject","selectedBusinesses","businesses","confirmTarget"],m.showDialogInventory=function(e){var r=a("sm")||a("xs");n.show({controller:h,templateUrl:"templates/panel/business/business.create.html",parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!0,locals:{selectedBusinesses:t.selected,businesses:t.businesses,products:u,confirmTarget:""},fullscreen:r})},m.showDialogAddProduct=function(e){var r=a("sm")||a("xs");n.show({controller:h,templateUrl:"templates/panel/business/business.product.html",parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!0,locals:{selectedBusinesses:t.selected,businesses:t.businesses,products:u,confirmTarget:""},fullscreen:r})},m.showDialogPaymentConfirmation=function(e){var r=a("sm")||a("xs");n.show({controller:h,templateUrl:"templates/panel/business/business.payment.confirm.html",parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!0,locals:{selectedBusinesses:t.selected,businesses:t.businesses,confirmTarget:"payment"},fullscreen:r})},m.showDialogDeliveredConfirmation=function(e){var r=a("sm")||a("xs");n.show({controller:h,templateUrl:"templates/panel/business/business.delivery.confirm.html",parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!0,locals:{selectedBusinesses:t.selected,businesses:t.businesses,confirmTarget:"delivery"},fullscreen:r})},m.createDummyData=function(e){for(var t=0;t<e;t++)s.$add({mitbbsId:"DummyID",product:"Dummy IPad",price:"100",quantity:1,location:"Dummy Place",detailLoc:[-79.893168+10*Math.random(),177.177594+10*Math.random()],zipCode:"00000",paymentMethod:"Dummy method",paid:!1,delivered:!1})},m.listStyle={height:.6*i.innerHeight+"px"},i.addEventListener("resize",d)}]),angular.module("baoziApp").directive("businessVirtualList",function(){return{scope:{businessDataProvider:"="},replace:!0,restrict:"A",templateUrl:"templates/panel/business/business.virtual.list.html",link:function(e,t){var n=30;e.height=200,e.scrollTop=0,e.visibleProvider=[],e.cellsPerPage=0,e.numberofCells=0,e.canvasHeight=0,e.init=function(){t[0].addEventListener("scroll",e.onScroll),e.cellsPerPage=Math.round(e.height/n),e.numberofCells=3*e.cellsPerPage,e.canvasHeight={height:"500px"},e.updateList()},e.updateList=function(){var t=Math.max(Math.floor(e.scrollTop/n)-e.cellsPerPage,0),r=Math.min(t+e.numberofCells,e.numberofCells);e.visibleProvider=e.businessDataProvider.slice(t,t+r);for(var a=0;a<e.visibleProvider.length;a++)e.visibleProvider[a].style={top:(t+a)*n+"px"}},e.onScroll=function(){e.scrollTop=t.prop("scrollTop"),e.updateList(),e.$apply()},e.init()}}}),angular.module("baoziApp").directive("indicatorDonut",function(){return{restrict:"E",replace:!0,transclude:!0,controller:["$scope","$element",function(e,t){function n(e){return e*(Math.PI/180)}function r(e){return 360*e}function a(e,t,n){return{innerRadius:(e+n)*t,outerRadius:(e+n)*t}}e.radius=t.find("circle")[0].r.baseVal.value,e.canvasWidth=t.attr("width"),e.canvasHeight=t.attr("height"),e.spacing=.9,e.drawArc=function(){return d3.svg.arc().innerRadius(function(e){return e.innerRadius}).outerRadius(function(e){return e.outerRadius}).startAngle(0).endAngle(function(e){return e.endAngle})},e.pathColor=function(e){return e<.25?"red":e>=.25&&e<.5?"orange":"green"},e.getArcInfo=function(e,t,o,i){var l=r(t),s=a(e,o,i);return{innerRadius:s.innerRadius,outerRadius:s.outerRadius,startAngle:0,endAngle:n(l)}},e.tweenArc=function(e,t){return function(n){var r=d3.interpolate(n,e);for(var a in e)n[a]=e[a];return function(e){return t(r(e))}}}}],templateUrl:"templates/panel/business/business.indicator.html",scope:{submitCount:"@",deliveryCount:"@",paidCount:"@",expected:"@",name:"@"}}}).directive("pathGroup",function(){return{requires:"^indicatorDonut",link:function(e,t){e.deliveryCount=t.attr("transform","translate("+e.canvasWidth/2+","+e.canvasHeight/2+")")}}}).directive("deliveryPath",function(){return{restrict:"A",transclude:!0,requires:"^pathGroup",scope:{percentage:"@"},link:function(e,t){var n=d3.select(t[0]),r=e.$parent.drawArc(),a=e.$parent.getArcInfo(1.1,e.percentage,e.$parent.radius,.05);a.endAngle;a.endAngle=0,n.datum(a).attr("d",r);e.$watch("percentage",function(){var a=t.attr("class").split(/\s+/);n.transition().delay(100).duration(2e3).attrTween("d",e.$parent.tweenArc({endAngle:360*e.percentage*(Math.PI/180)},r)),a.indexOf("green")==-1&&a.indexOf("red")==-1&&a.indexOf("orange")?t.addClass(e.$parent.pathColor(e.percentage)):(a.indexOf("green")>-1&&t.removeClass("green"),a.indexOf("red")>-1&&t.removeClass("red"),a.indexOf("orange")>-1&&t.removeClass("orange"),t.addClass(e.$parent.pathColor(e.percentage)))})}}}).directive("paidPath",function(){return{restrict:"A",transclude:!0,requires:"^pathGroup",scope:{percentage:"@"},link:function(e,t){var n=d3.select(t[0]),r=e.$parent.drawArc(),a=e.$parent.getArcInfo(1.2,e.percentage,e.$parent.radius,.1);a.endAngle;a.endAngle=0,n.datum(a).attr("d",r),e.$watch("percentage",function(){var a=t.attr("class").split(/\s+/);n.transition().delay(100).duration(2e3).attrTween("d",e.$parent.tweenArc({endAngle:360*e.percentage*(Math.PI/180)},r)),a.indexOf("green")==-1&&a.indexOf("red")==-1&&a.indexOf("orange")?t.addClass(e.$parent.pathColor(e.percentage)):(a.indexOf("green")>-1&&t.removeClass("green"),a.indexOf("red")>-1&&t.removeClass("red"),a.indexOf("orange")>-1&&t.removeClass("orange"),t.addClass(e.$parent.pathColor(e.percentage)))})}}}).directive("generalPath",function(){return{restrict:"A",transclude:!0,requires:"^pathGroup",scope:{percentage:"@"},link:function(e,t){var n=d3.select(t[0]),r=e.$parent.drawArc(),a=e.$parent.getArcInfo(1.3,e.percentage,e.$parent.radius,.15);a.endAngle;a.endAngle=0,n.datum(a).attr("d",r),e.$watch("percentage",function(){var a=t.attr("class").split(/\s+/);n.transition().delay(100).duration(2e3).attrTween("d",e.$parent.tweenArc({endAngle:360*e.percentage*(Math.PI/180)},r)),a.indexOf("green")==-1&&a.indexOf("red")==-1&&a.indexOf("orange")?t.addClass(e.$parent.pathColor(e.percentage)):(a.indexOf("green")>-1&&t.removeClass("green"),a.indexOf("red")>-1&&t.removeClass("red"),a.indexOf("orange")>-1&&t.removeClass("orange"),t.addClass(e.$parent.pathColor(e.percentage)))})}}}),angular.module("baoziApp").factory("Businesses",["ArrayWithSum",function(e){var t=firebase.database().ref().child("businesses");return{forBusiness:function(){return e(t)},all:t}}]).factory("Products",["$firebaseArray",function(e){var t=firebase.database().ref().child("products");return{forProduct:function(){return e(t)},all:t}}]).factory("ArrayWithSum",["$firebaseArray",function(e){return e.$extend({sum:function(){var e={};return angular.forEach(this.$list,function(t){t.product in e?e[t.product]+=t.quantity:e[t.product]=t.quantity}),e},sumP:function(){var e={};return angular.forEach(this.$list,function(t){t.product in e?t.paid&&(e[t.product]+=t.quantity):t.paid&&(e[t.product]=t.quantity)}),e},sumD:function(){var e={};return angular.forEach(this.$list,function(t){t.product in e?t.delivered&&(e[t.product]+=t.quantity):t.delivered&&(e[t.product]=t.quantity)}),e}})}]),angular.module("baoziApp").controller("ChatCtrl",["$scope","$state","$mdMedia","Auth","Users","channels","profile",function(e,t,n,r,a,o,i){a.setOnline(i.$id);var l=this;l.direction=!1,l.profile=i,l.channels=o,l.getDisplayName=a.getDisplayName,l.getGravatar=a.getGravatar,l.newChannel={name:""},l.createChannel=function(){l.channels.$add(l.newChannel).then(function(e){t.go("panel.chat.messages",{channelId:e.key()}),l.newChannel={name:""}})},l.toggle=function(){l.direction=!l.direction},l.users=a.all}]),angular.module("baoziApp").directive("scrollBottom",function(){return{scope:{scrollBottom:"="},link:function(e,t){e.$watchCollection("scrollBottom",function(){$(t).scrollTop($(t)[0].scrollHeight)})}}}),angular.module("baoziApp").factory("Channels",["$firebaseArray",function(e){var t=firebase.database().ref().child("channels"),n=e(t);return n}]).factory("Messages",["$firebaseArray",function(e){var t=firebase.database().ref().child("channelMessages"),n=firebase.database().ref().child("userMessages");return{forChannel:function(n){return e(t.child(n))},forUsers:function(t,r){var a=t<r?t+"/"+r:r+"/"+t;return e(n.child(a))}}}]),angular.module("baoziApp").controller("MessageCtrl",["$mdMedia","profile","channelName","messages","isChannel",function(e,t,n,r,a){var o=this;o.$mdMedia=e,o.messages=r,o.channelName=n,o.message="",o.profile=t,o.isChannel=a,o.sendMessage=function(){o.message.length>0&&o.messages.$add({uid:t.$id,body:o.message,timestamp:firebase.database.ServerValue.TIMESTAMP}).then(function(){o.message=""})}}]),angular.module("baoziApp").controller("MapCtrl",["$scope","profile","businesses",function(e,t,n){for(var r=new google.maps.LatLng(39,(-95)),a=[],o=function(t){console.log("click"),t.showWindow=!1,e.$apply()},i=0;i<n.length;i++)a.push({id:i,latitude:n[i].detailLoc[0],longitude:n[i].detailLoc[1],showWindow:!1});console.log(a),_.each(a,function(t){t.closeClick=function(){t.showWindow=!1,e.$apply()},t.mitbbsId=n[t.id].mitbbsId,t.product=n[t.id].product,t.quantity=n[t.id].quantity,t.location=n[t.id].location,t.onClicked=function(){o(t)}}),e.markers=a,e.map={center:r,zoom:5}}]),angular.module("baoziApp").controller("MeetupCtrl",["$scope","$mdDialog","$firebaseObject","$mdMedia","profile","Meetups","meetups",function(e,t,n,r,a,o,i){var l=this;l.meetups=i,console.log(l.meetups),l.host=a.displayName;var s=function(e){var n=function(){var t="undefined"==typeof e.description?"":e.description;return console.log(e.guest),e.guest=e.guest.replace(/(^,)|(,$)/g,""),e.guests=e.guest.split(","),{name:e.name,host:e.host,type:e.type,location:e.location,detailLoc:e.detailLoc,guests:e.guests,startDateTime:new Date(e.startDateTime).getTime(),endDateTime:new Date(e.endDateTime).getTime(),description:t,createDate:(new Date).getTime(),createBy:a.displayName}};e.cancel=function(){t.cancel()},e.host=a.displayName,e.createEvent=function(){o.all.push(n()),t.hide()},e.types=["Conference","Meeting","Party","Wedding","Social Networking","Birthday","Family","Sport","Other"]};s.$inject=["$scope"],l.showDialog=function(e){var n=r("sm")||r("xs");t.show({controller:s,templateUrl:"templates/panel/meetup/meetup.create.html",parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!0,fullscreen:n})}}]),angular.module("baoziApp").directive("meetupCreate",function(){return{restrict:"E",replace:!0,templateUrl:"templates/panel/meetup/meetup.create.html"}}),angular.module("baoziApp").factory("Meetups",["$firebaseArray",function(e){var t=firebase.database().ref().child("meetups");return{forMeetup:function(){return e(t)},all:t}}]),angular.module("baoziApp").controller("PanelCtrl",["$scope","$mdMedia",function(e,t){e.$mdMedia=t}]),angular.module("baoziApp").controller("ProfileCtrl",["$state","$mdDialog","$mdMedia","$firebaseArray","md5","auth","profile","methods",function(e,t,n,r,a,o,i,l){var s=this;s.methods=l;var c=function(e){e.cancel=function(){t.cancel()},e.savePaymentMethod=function(){console.log(l),l.$add({paymentMethods:e.paymentMethod}),t.hide()}};c.$inject=["$scope"],s.profile=i,s.updateProfile=function(){s.profile.emailHash=a.createHash(o.email),s.profile.$save()},s.updateMethod=function(e){s.methods.$save(e)},s.deleteMethod=function(e){s.methods.$remove(e)},s.showDialogPaymentMethod=function(e){var r=n("sm")||n("xs");t.show({controller:c,templateUrl:"templates/panel/profile/profile.payment.method.html",parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!0,fullscreen:r})}}]),angular.module("baoziApp").factory("Methods",["$firebaseArray",function(e){var t=firebase.database().ref().child("methods");return{forMethod:function(n){return e(t.child(n))},all:t}}]),angular.module("baoziApp").factory("Users",["$firebaseArray","$firebaseObject",function(e,t){var n=firebase.database().ref().child("users"),r=firebase.database().ref().child(".info/connected"),a=e(n);return{getProfile:function(e){return t(n.child(e))},getDisplayName:function(e){return a.$getRecord(e).displayName},getGravatar:function(e){return"http://www.gravatar.com/avatar/"+a.$getRecord(e).emailHash},setOnline:function(a){var o=t(r),i=e(n.child(a+"/online"));o.$watch(function(){o.$value===!0&&i.$add(!0).then(function(e){e.onDisconnect().remove()})})},all:a}}]),angular.module("baoziApp").controller("WeatherCtrl",["$scope","$mdMedia",function(e,t){e.$mdMedia=t}]),angular.module("baoziApp").service("weatherService",["$http",function(e){var t={curWeather:{},forecast:{},getWeather:function(n,r){return n=n||"Sunnyvale,CA",t.curWeather[n]?t.curWeather[n]:(t.curWeather[n]={temp:{},icon:"undefined"},e.get("http://api.openweathermap.org/data/2.5/weather?q="+n+"&units="+r+"&APPID=b253934bbcdd1b68251e3854cc389ca0").success(function(e){e&&(e.main&&(t.curWeather[n].temp.current=e.main.temp,t.curWeather[n].temp.min=e.main.temp_min,t.curWeather[n].temp.max=e.main.temp_max),t.curWeather[n].icon=e.weather[0].icon)}),t.curWeather[n])},getForecast:function(n,r,a){return n=n||"Sunnyvale, CA",t.forecast[n]?t.forecast[n]:(t.forecast[n]={},e.get("http://api.openweathermap.org/data/2.5/forecast/daily?q="+n+"&units="+r+"&cnt="+a+"&APPID=b253934bbcdd1b68251e3854cc389ca0").success(function(e){e&&angular.copy(e,t.forecast[n])}),t.forecast[n])}};return t}]).filter("temp",["$filter",function(e){return function(t,n,r){n||(n=1);var a;switch(r){case"imperial":a="F",t=1.8*(t-273)+32;break;case"metric":a="C",t-=273;break;default:a="K"}var o=e("number");return o(t,n)+"&deg;"+a}}]).filter("temperature",["$filter",function(e){return function(t,n,r){n||(n=1);var a;switch(r){case"imperial":a="F";break;case"metric":a="C";break;default:a="K"}var o=e("number");return o(t,n)+"&deg;"+a}}]).filter("daysNow",function(){return function(e){return(new moment).add(e,"days").format("ddd MMM DD")}}).filter("daysInTheFuture",function(){return function(e){return(new moment).add(e,"days").format("ddd")}}).directive("weatherForecast",function(){return{scope:{location:"@",units:"@?"},restrict:"E",replace:!0,templateUrl:"templates/weather/weatherForecast.tpl.html",link:function(e){e.units=e.units||"metric"}}}).directive("weatherDisplayCard",["weatherService",function(e){return{scope:{location:"=",units:"="},restrict:"E",replace:"true",templateUrl:"templates/weather/weatherDisplayCard.tpl.html",link:function(t){t.findIndex=function(e){return t.forecast.list.indexOf(e)},t.firstday=e.getWeather(t.location,t.units),t.forecast=e.getForecast(t.location,t.units,"5")}}}]).directive("weatherGoogleIcon",function(){return{restrict:"E",replace:!0,scope:{icon:"@",customSize:"@?"},link:function(e){e.imgUrl=function(){var t="images/weathericon/";return t+e.icon+".png"}},template:'<img style="height:{{customSize}}px;width:{{customSize}}px;" class="md-card-image" ng-src="{{imgUrl()}}">'}}).directive("weather",function(){return{templateUrl:"templates/weather/weather.html",restrict:"E",controller:"WeatherController",controllerAs:"weather",replace:!0}});