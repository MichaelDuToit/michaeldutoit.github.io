var mobileBreak = 750;
var navMenuStatus = true;
var menuBtn = document.getElementById('menuBtn');
var menuLines = document.getElementById('menuLines');
var bodyEl = document.getElementsByTagName('body')[0];
var htmlEl = document.getElementsByTagName("html")[0];


function menu(){
    var menu_el = document.getElementById('menu');
    if (navMenuStatus == false){
        menu_el.classList.add('hide');
        menu_el.classList.remove('show');
        menuLines.classList.remove('change');
        navMenuStatus = true;
    } else {
        menu_el.classList.add('show');
        menu_el.classList.remove('hide');
        menuLines.classList.add('change');
        navMenuStatus = false;
    }
};
menuBtn.addEventListener('click', menu);

function isMobile(){
    if(bodyEl.clientWidth <= mobileBreak || document.documentElement.clientWidth <= mobileBreak){
        menuBtn.classList.add('show');
        menuBtn.classList.remove('hide');
        navMenuStatus = false;
        menu();
    }
    else {
        menuBtn.classList.add('hide');
        menuBtn.classList.remove('show');
        navMenuStatus = true;
        menu();
    }
};
window.addEventListener('load', isMobile);
window.addEventListener('resize', isMobile);

function scrollTo(element, to, duration){
    if(duration <= 0){
        return false;
    }
    var diff = to - element.scrollTop;
    var speed = diff / duration * 10;
    setTimeout(function(){
        element.scrollTop = element.scrollTop + speed;
        if (element.scrollTop === to){
            return;
        }
        scrollTo(element,to,duration - 10);
    }, 5)
};
var toTopBtn = document.getElementById('to-top');
function scrollToTop(){
    if(document.body.scrollTop != 0 || document.documentElement.scrollTop != 0){
        scrollTo(bodyEl,0,400);
        scrollTo(htmlEl,0,400);
    }
    else {
        return false;
    }
};
toTopBtn.addEventListener('click', scrollToTop);


if ('serviceWorker' in navigator){
    window.addEventListener('load', function(){
        navigator.serviceWorker.register('/sw.js', {scope: '/'}).then(function(registration){
            console.log('ServiceWorker registration successfull with scope: ', registration.scope);
        }).catch(function(err){
            console.log('ServiceWorker registration failed: ', err);
        });
    });
};