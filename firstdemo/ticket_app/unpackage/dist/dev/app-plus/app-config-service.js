
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/home/home","pages/mine/mine","pages/home/search/search","pages/home/ticketList/ticketList","pages/home/ticketDetail/ticketDetail","pages/home/orderConfirm/orderConfirm","pages/mine/authorization/authorization","pages/mine/orderList/orderList","pages/mine/orderDetail/orderDetail","pages/mine/ticketDetailInfo/ticketDetailInfo","pages/mine/applyRefund/applyRefund","pages/mine/applyDistribution/applyDistribution","pages/mine/myDistributerCode/myDistributerCode","pages/mine/myPerformance/myPerformance","pages/mine/checkTicket/checkTicket","pages/mine/checkTicket/scanTicket","pages/mine/checkTicket/checkTicketError","pages/home/webView/webView"],"window":{"navigationBarTextStyle":"black","navigationBarTitleText":"票务","navigationBarBackgroundColor":"#FFFFFF","backgroundColor":"#FFFFFF","bounce":"none"},"tabBar":{"color":"#7A7E83","selectedColor":"#333333","borderStyle":"black","backgroundColor":"#ffffff","list":[{"pagePath":"pages/home/home","iconPath":"static/tabbar/tab_home_unselected.png","selectedIconPath":"static/tabbar/tab_home_selected.png","text":"演出"},{"pagePath":"pages/mine/mine","iconPath":"static/tabbar/tab_mine_unselected.png","selectedIconPath":"static/tabbar/tab_mine_selected.png","text":"我的"}]},"nvueCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"ticket_app","compilerVersion":"3.0.7","entryPagePath":"pages/home/home","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/home/home","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"票务系统小程序"}},{"path":"/pages/mine/mine","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"我的"}},{"path":"/pages/home/search/search","meta":{},"window":{"navigationBarTitleText":"搜索"}},{"path":"/pages/home/ticketList/ticketList","meta":{},"window":{}},{"path":"/pages/home/ticketDetail/ticketDetail","meta":{},"window":{"navigationBarTitleText":"演出详情"}},{"path":"/pages/home/orderConfirm/orderConfirm","meta":{},"window":{"navigationBarTitleText":"确认订单"}},{"path":"/pages/mine/authorization/authorization","meta":{},"window":{"navigationBarTitleText":"微信授权"}},{"path":"/pages/mine/orderList/orderList","meta":{},"window":{"navigationBarTitleText":"我的订单"}},{"path":"/pages/mine/orderDetail/orderDetail","meta":{},"window":{"navigationBarTitleText":"订单详情"}},{"path":"/pages/mine/ticketDetailInfo/ticketDetailInfo","meta":{},"window":{"navigationBarTitleText":"演出票详情"}},{"path":"/pages/mine/applyRefund/applyRefund","meta":{},"window":{"navigationBarTitleText":"申请退款"}},{"path":"/pages/mine/applyDistribution/applyDistribution","meta":{},"window":{"navigationBarTitleText":"分销申请"}},{"path":"/pages/mine/myDistributerCode/myDistributerCode","meta":{},"window":{"navigationBarTitleText":"我的分销码"}},{"path":"/pages/mine/myPerformance/myPerformance","meta":{},"window":{"navigationBarTitleText":"我的业绩"}},{"path":"/pages/mine/checkTicket/checkTicket","meta":{},"window":{"navigationBarTitleText":"我是验票员"}},{"path":"/pages/mine/checkTicket/scanTicket","meta":{},"window":{"navigationBarTitleText":"扫码验票"}},{"path":"/pages/mine/checkTicket/checkTicketError","meta":{},"window":{"navigationBarTitleText":"我是验票员"}},{"path":"/pages/home/webView/webView","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});