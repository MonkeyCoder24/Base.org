document.addEventListener('DOMContentLoaded', function(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const links = document.querySelectorAll('a[href^="#"]');

  if(toggle && nav){
    toggle.addEventListener('click', ()=>{
      nav.classList.toggle('open');
    });
  }

  links.forEach(l=>{
    l.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href && href.startsWith('#')){
        const target = document.querySelector(href);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth',block:'start'});
          if(nav) nav.classList.remove('open');
        }
      }
    });
  });

  // Add subtle header shadow on scroll
  const header = document.querySelector('header');
  window.addEventListener('scroll', ()=>{
    if(window.scrollY > 6) header.classList.add('shadow');
    else header.classList.remove('shadow');
  });
});
