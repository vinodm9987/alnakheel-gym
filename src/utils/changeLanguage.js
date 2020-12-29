export const initialLanguage = (language) => {
  const rtlPath = ['/css/rtl.bootstrap.min.css', '/css/rtl.custom.css'];
  const path = '/css/bootstrap.min.css'
  const rtlScr = '/js/rtl.bootstrap.min.js'
  const scr = '/js/bootstrap.min.js'
  if (language === 'ar') {
    switchArabic(rtlPath, path, rtlScr, scr);
  } else {
    switchEnglish(rtlPath, path, rtlScr, scr);
  }
}

export const changeLanguage = (language) => {
  const rtlPath = ['/css/rtl.bootstrap.min.css', '/css/rtl.custom.css'];
  const path = '/css/bootstrap.min.css'
  const rtlScr = '/js/rtl.bootstrap.min.js'
  const scr = '/js/bootstrap.min.js'
  if (language === 'ar') {
    switchEnglish(rtlPath, path, rtlScr, scr);
  } else {
    switchArabic(rtlPath, path, rtlScr, scr);
  }
}

const switchArabic = (rtlPath, path, rtlScr, scr) => {
  const eleScr = document.getElementById(scr)
  eleScr && eleScr.remove()

  if (document.getElementById(rtlScr) === null) {
    const rtlEleScr = document.createElement('script');
    rtlEleScr.id = rtlScr;
    rtlEleScr.src = rtlScr;
    document.body.appendChild(rtlEleScr);
  }

  const ele = document.getElementById(path)
  ele && ele.remove();
  if (document.getElementById(rtlPath[0]) === null) {
    const parentEle = document.getElementById('/css/all.css')
    const link = document.createElement('link');
    link.id = rtlPath[0];
    link.rel = 'stylesheet';
    link.href = rtlPath[0];
    parentEle.parentNode.insertBefore(link, parentEle)
  }
  if (document.getElementById(rtlPath[1]) === null) {
    const link = document.createElement('link');
    link.id = rtlPath[1];
    link.rel = 'stylesheet';
    link.href = rtlPath[1];
    document.head.appendChild(link);
  }
}

const switchEnglish = (rtlPath, path, rtlScr, scr) => {
  const rtlEleScr = document.getElementById(rtlScr)
  rtlEleScr && rtlEleScr.remove()

  if (document.getElementById(scr) === null) {
    const eleScr = document.createElement('script');
    eleScr.id = scr;
    eleScr.src = scr;
    document.body.appendChild(eleScr);
  }

  for (const key of rtlPath) {
    const ele = document.getElementById(key);
    ele && ele.remove();
  }
  if (document.getElementById(path) === null) {
    const parentEle = document.getElementById('/css/all.css')
    const link = document.createElement('link');
    link.id = path;
    link.rel = 'stylesheet';
    link.href = path;
    parentEle.parentNode.insertBefore(link, parentEle)
  }
}