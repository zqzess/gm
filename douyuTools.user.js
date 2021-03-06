// ==UserScript==
// @name           douyuTools
// @namespace      douyuTools.xinggsf
// @author         xinggsf
// @description    斗鱼TV去广告；开启CDN和GPU加速；去未登录限制；去礼物效果
// @homepageURL    https://greasyfork.org/zh-CN/scripts/18613
// updateURL       https://greasyfork.org/scripts/18613.js
// @include        http://www.douyu.com/*
// @include        https://www.douyu.com/*
// @version        2017.03.03
// @encoding       utf-8
// @compatible     chrome45+
// @compatible     firefox38+
// @grant          unsafeWindow
// @grant          GM_registerMenuCommand
// @grant          GM_setValue
// @grant          GM_getValue
// ==/UserScript==
"use strict";

const svrList = ['tct', 'ws2', 'ws', 'dl'];
function getCDN() {
	let n = GM_getValue('CDN', 9);
	if (n < svrList.length) return svrList[n];
	return svrList[~~(Math.random() * 3)];
}
function configValue(field, v) {
	if (typeof v === 'boolean') v = !GM_getValue(field, !1);
	GM_setValue(field, v);
	unsafeWindow.location.reload();
}
/*
const menuOpt = [
			['主线路','CDN',2],
			['线路5','CDN',0],
			['线路2','CDN',1],
			['网通','CDN',3],
			['电信线路随机','CDN',9],
			['去未登录限制','notLogin',!1],
			['去礼物效果','noDift',!1],
];
function buildMenu() {
	let title, i, r,
	cdn = GM_getValue('CDN', 9);
	for (i of menuOpt) {
		if (i[1] === 'CDN')
			r = cdn === i[2];
		else
			r = GM_getValue(i[1], i[2]);
		title = r ? ('√  ' + i[0]) : i[0];
		GM_registerMenuCommand(title, () => configValue(i[1], i[2]));
	}
} */
let _cdn = GM_getValue('CDN', 9);
function getTitle(title, field, val) {
	let r = (field === 'CDN') ? _cdn === val :
			GM_getValue(field, val);
	return r ? ('√  ' + title) : title;
}
function buildMenu() {
	let s = getTitle('线路5', 'CDN', 0);
	GM_registerMenuCommand(s, () => configValue('CDN', 0));
	s = getTitle('线路2', 'CDN', 1);
	GM_registerMenuCommand(s, () => configValue('CDN', 1));
	s = getTitle('主线路', 'CDN', 2);
	GM_registerMenuCommand(s, () => configValue('CDN', 2));
	s = getTitle('网通', 'CDN', 3);
	GM_registerMenuCommand(s, () => configValue('CDN', 3));
	s = getTitle('电信线路随机', 'CDN', 9);
	GM_registerMenuCommand(s, () => configValue('CDN', 9));
	s = getTitle('去未登录限制', 'notLogin', !1);
	GM_registerMenuCommand(s, () => configValue('notLogin', !1));
	s = getTitle('去礼物效果', 'noDift', !1);
	GM_registerMenuCommand(s, () => configValue('noDift', !1));
}

buildMenu();
let setFlash = !1,
$ = unsafeWindow.$,
options = {childList: true, subtree: true};
//$('.vcode9-sign').live('show', () => $(this).remove());//委托/后绑定事件
$('div[class|=room-ad],div[class$=-ad],.tab-content.promote').remove();
new MutationObserver(function(rs) {
	this.disconnect();
	$('.assort-ad,.chat-top-ad,.vcode9-sign,#watchpop,.giftbox,.focus,.js-live-room-recommend').remove();
	$('.focus-lead,.live-lead,.show-watch,div.no-login,.pop-zoom-container').remove();
	$('focus_lead,.live_lead,.show_watch,div.no_login,.pop_zoom_container').remove();
/*
	for (let col of rs) {
		//弹幕滚屏不处理
		if (!col.target.closest('div.chat-cont') && col.addedNodes.some(x => x.matches('image')))
			for (let e of col.addedNodes)
				e && e.parentNode.removeChild(e);
	} */
	console.log('remove ads!');
	//this.takeRecords();
	this.observe(document.body, options);

	if (setFlash) return;
	let rm = $('object[data*="/simplayer/WebRoom"]');
	if (!rm.length) return;
	//unsafeWindow.scrollTo(0, 120);
	let c = rm[0].children,
	s = c.flashvars.value;
	c.wmode.value = 'gpu';
	s = s.replace(/&(?:\w*RedBag|shopinfo|flashConfig)=[^&]*/g, '')
		 .replace(/&cdn=\w*/, '&cdn='+ getCDN());
	if (GM_getValue('notLogin', !1)) {
		s = s.replace('&uid=0', '&uid=11111');
	}
	if (GM_getValue('noDift', !1)) {
		s = s.replace(/&effect\w*=[^&]*/g, '');
	}
	c.flashvars.value = s;
	//rm.toggle().toggle();
	console.log('Flash Accelerate: gpu, cdn');
	setFlash = !0;
	//delete options.subtree;
	//$('span.tab-btn-text').click();
}).observe(document.body, options);