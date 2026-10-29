/* Healthy Faith Daily — nav + store-click tracking */
(function(){
  var nav=document.querySelector('.nav'),t=document.querySelector('.nav-toggle');
  if(t&&nav){t.addEventListener('click',function(){nav.classList.toggle('open');t.setAttribute('aria-expanded',nav.classList.contains('open'))});
    document.querySelectorAll('.nav-links a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open')})});}
  function cap(ev,props){try{if(window.posthog&&posthog.capture){posthog.capture(ev,props)}}catch(e){}}
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a');if(!a)return;
    var href=a.getAttribute('href')||'';var store='';
    if(href.indexOf('apps.apple.com')>-1)store='ios';else if(href.indexOf('play.google.com')>-1)store='android';
    if(!store)return;
    var app=a.getAttribute('data-app')||(href.indexOf('faithdailybible')>-1?'faith_daily_bible':'healthy_faith');
    var placement=a.getAttribute('data-placement')||(a.closest('.hero')?'hero':a.closest('.cta-box')?'cta_box':a.closest('#hfd-sticky')?'sticky':'inline');
    cap('store_click',{app:app,store:store,placement:placement,path:location.pathname,site:'healthyfaithdaily'});
    cap('blog_download_cta_click',{placement:placement,store:store,path:location.pathname,app:app,site:'healthyfaithdaily'});
  },true);
})();
