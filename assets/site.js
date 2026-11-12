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

  // Download bar on every page (11-12). Blog posts ship their own #hfd-sticky + script, so only add it where missing.
  if(!document.getElementById('hfd-sticky')){
    var K='hfd_cta_dismissed',bar=document.createElement('div');
    bar.id='hfd-sticky';bar.setAttribute('role','region');bar.setAttribute('aria-label','Get Healthy Faith');bar.hidden=true;
    bar.innerHTML='<div class="in"><span class="tx">Get <strong>Healthy Faith</strong> free &middot; word study &amp; sermon notes</span>'+
      '<a class="btn btn-primary" data-app="healthy_faith" data-placement="sticky" rel="nofollow noopener" href="https://apps.apple.com/us/app/healthy-faith-bible-study/id6781374849?pt=128318750&amp;ct=hfd_site_sticky&amp;mt=8">App&nbsp;Store</a>'+
      '<a class="btn btn-dark" data-app="healthy_faith" data-placement="sticky" rel="nofollow noopener" href="https://play.google.com/store/apps/details?id=com.healthyone.healthyfaith">Google&nbsp;Play</a>'+
      '<button type="button" aria-label="Dismiss">&times;</button></div>';
    document.body.appendChild(bar);
    var until=0;try{until=parseInt(localStorage.getItem(K)||'0',10)}catch(e){}
    if(Date.now()>until){bar.hidden=false;document.body.classList.add('has-sticky')}
    bar.querySelector('button').addEventListener('click',function(){bar.hidden=true;document.body.classList.remove('has-sticky');
      try{localStorage.setItem(K,String(Date.now()+7*864e5))}catch(e){}
      cap('blog_download_cta_click',{placement:'sticky_dismiss',store:'',path:location.pathname,site:'healthyfaithdaily'});});
  }
})();
