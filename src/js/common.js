$(document).ready(function () {
  lazy();
  scrollInit();
  dropdown();
  search();
  aside();
  inputs();
  slider();
  scrollBtnTop();
  select();
});
$(window).resize(function () {
  innerWidth = $('body').innerWidth();
  cover();
});
$(window).on('scroll', function() {
  scrollTop = $(window).scrollTop();
  scrollBtnTop();
})

//global variables
var innerWidth = $('body').innerWidth(),
scrollTop = $(window).scrollTop(),
$checkbox = $('.checkbox'),
$slider = $('.slider'),
//scroll-styling
cursorcolorVar = "transparent",
cursorwidthVar = "15px",
cursorborderVar = "0",
cursorborderradiusVar = "0",
zindexVar = [100],
bouncescrollVar = false,
$scrollContainer = $('.scroll-container');


//lazy
function lazy() {
  $(".lazy").Lazy({
    effect: 'fadeIn',
    visibleOnly: true,
    effectTime: 300,
    afterLoad: function(element) {
      setTimeout(function() {
        var box = $(element).parent(),
        boxH = box.height(),
        boxW = box.width(),
        imgH = element.height(),
        imgW = element.width();

        if ((boxW / boxH) >= (imgW / imgH)) {
          element.addClass('ww').removeClass('wh');
        } else {
          element.addClass('wh').removeClass('ww');
        }

        element.addClass('visible');
      }, 100)
    }
  });
}

//scrollTop
function scrollBtnTop() {
  if(scrollTop>200) {
    $('.button_scroll-top').fadeIn();
  } else {
    $('.button_scroll-top').fadeOut();
  }
}

function cover() {
  setTimeout(function() {
    $('img.visible').each(function() {
      var box = $(this).parent(),
      boxH = box.height(),
      boxW = box.width(),
      imgH = $(this).height(),
      imgW = $(this).width();
  
      if ((boxW / boxH) >= (imgW / imgH)) {
        $(this).addClass('ww').removeClass('wh');
      } else {
        $(this).addClass('wh').removeClass('ww');
      }
    })
  }, 100)
}
//select
function select() {
  if ($('html').hasClass('android') || $('html').hasClass('ios')) {
  } else {
    $('.select').niceSelect();
  }
}
//scroll
function scrollInit() {
  if ($('html').hasClass('android') || $('html').hasClass('ios')) {
    $(".button_scroll-top").on('click', function(e) {
      e.preventDefault();
      $("html, body").animate({ scrollTop: 0 }, 500);
    })
  } else {
    $('body').niceScroll({
      cursorcolor: cursorcolorVar,
      cursorwidth: cursorwidthVar,
      cursorborder: cursorborderVar,
      cursorborderradius: cursorborderradiusVar,
      zindex: zindexVar,
      bouncescroll: bouncescrollVar,
      autohidemode: true
    });
    $scrollContainer.niceScroll(".scroll-wrapper", {
      cursorcolor: cursorcolorVar,
      cursorwidth: cursorwidthVar,
      cursorborder: cursorborderVar,
      cursorborderradius: cursorborderradiusVar,
      zindex: zindexVar,
      bouncescroll: bouncescrollVar,
      autohidemode: "leave",
    });
    var timerId = setInterval(function() {
      $('body').getNiceScroll().resize();
      $scrollContainer.getNiceScroll().resize();
    }, 50);

    $(".button_scroll-top").on('click', function(e) {
      e.preventDefault();
      $('body').getNiceScroll().doScrollPos(0,0);
    })
  }
};

//dropdowns
function dropdown() {
  var $link = $('.dropdown-item__button'),
      $dropdownContainer = $('.dropdown-item__container'),
      $dropdown = $('.dropdown-item'),
      flag;

  $(document).on('click touchstart', function (e) {
    if ($link.is(e.target)) {
      e.preventDefault();
    }
    if (!flag) {
      flag = true;
      setTimeout(function () {
        flag = false;
      }, 300);
      if ((!$dropdownContainer.is(e.target) && $dropdownContainer.has(e.target).length === 0 && !$link.is(e.target) && $dropdown.hasClass('visible')) || ($link.is(e.target) && $(e.target).parents('.dropdown-item').hasClass('visible'))) {
        $dropdown.removeClass('visible');
      } else if ($link.is(e.target)) {
        $dropdown.removeClass('visible');
        $(e.target).parents('.dropdown-item').addClass('visible');
      }
    }
  });
}
//search
function search() {
  var $searchOpen = $('.search-open'),
  $searchClose = $('.search-close'),
  $search = $('.header__search');

  $searchOpen.on('click', function(e) {
    e.preventDefault();
    $search.addClass('visible');
  })
  $searchClose.on('click', function(e) {
    e.preventDefault();
    $search.removeClass('visible');
  })
  $(window).resize(function () {
    if(innerWidth>576) {
      $search.removeClass('visible');
    }
  });
}

//aside
function aside() {
  var $catalogueToggle = $('.catalogue-toggle'),
  $filterToggle = $('.filter-toggle, .setup-open'),
  $sectionToggle = $('.filter-section__title'),
  $navToggle = $('.nav-toggle');

  //при клике на кнопку каталога
  $catalogueToggle.on('click', function(e) {
    e.preventDefault();
    $('html').toggleClass('catalogue-opened');
    if($('html').hasClass('filter-opened')) {
      $('html').removeClass('filter-opened');
    }
    $(".aside .scroll-container").getNiceScroll().doScrollPos(0,0);
  })

  //при клике на кнопку фильтров
  $filterToggle.on('click', function(e) {
    e.preventDefault();
    if($('html').hasClass('nav-opened')) {}
    else {
      scrollLock.hide($("body"));
      $('html').addClass('nav-opened');
    }
    $('html').toggleClass('filter-opened');
    $(".aside .scroll-container").getNiceScroll().doScrollPos(0,0);
  })

  //при клике на табы фильтров
  $sectionToggle.on('click', function(e) {
    e.preventDefault();
    $(this).parent().toggleClass('active');
  })

  //при клике на кнопку навигации
  $navToggle.on('click', function(e) {
    e.preventDefault();
    if($('html').hasClass('nav-opened')) {
      scrollLock.show($("body"));
      $('html').removeClass('filter-opened').removeClass('catalogue-opened').removeClass('nav-opened');
    } else {
      scrollLock.hide($("body"));
      $('html').addClass('nav-opened');
    }
  })
  
  //добавление тени при прокрутке
  if(scrollTop>0) {
    $('.aside').addClass('scrolled');
  } else {
    $('.aside').removeClass('scrolled');
  }
  $(window).on('scroll', function() {
    if(scrollTop>0) {
      $('.aside').addClass('scrolled');
    } else {
      $('.aside').removeClass('scrolled');
    }
  })
  
  //закртие навигации при условии изменения ширины монитора
  $(window).resize(function () {
    if(innerWidth>992) {
      $('body').removeClass('filter-opened').removeClass('catalogue-opened').removeClass('nav-opened');
      scrollLock.show($("body"));
    }
  });
}


//checkboses
function inputs() {
  var $reset = $('.form-reset-btn'),
  $input = $('input'),
  $form = $('form');

  checkboxCheck();
  filterState();

  $input.on('change', function() {
    checkboxCheck();
    filterState();
  })

  $reset.on('click', function() {
    //var $reset = $(this);
    setTimeout(function() {
      checkboxCheck();
      //$reset.prop('disabled', true);
      filterState();
    }, 100)
  })

  function checkboxCheck() {
    $checkbox.each(function() {
      if($(this).find('input').prop('checked')) {
        $(this).addClass('checked');
      } else {
        $(this).removeClass('checked');
      }
    })
  }

  function filterState() {
    $form.each(function() {
      if($(this).find($reset).length) {
        if($(this).find('input:checked').length > 0 || $(this).find('input').val()) {
          $(this).find($reset).prop('disabled', false);
        } else {
          $reset.prop('disabled', true);
        }
      }
    })
  }
}

//sliders
function slider() {
  $slider.on('init', function () {
    $(this).addClass('visible');
  });

  $slider.each(function () {
    $(this).on('init reInit afterChange', function(){
      lazy();
    });

    var slideCount = 1,
      slideCount1200 = 1,
      slideCount992 = 1,
      slideCount768 = 1,
      slideCount576 = 1,
      slideCount420 = 1,
      arrows = true,
      dots = false,
      autoplayVar = false,
      centerMode = false,
      adaptiveHeight = false,
      fadeVar = false;

    if ($(this).hasClass('main-slider__slider')) {
      fadeVar = true,
      autoplayVar = true;
    }
    
    $(this).slick({
      infinite: true,
      dots: dots,
      arrows: arrows,
      speed: 600,
      lazyLoad: 'ondemand',
      adaptiveHeight: adaptiveHeight,
      centerMode: centerMode,
      slidesToShow: slideCount,
      slidesToScroll: slideCount,
      fade: fadeVar,
      autoplay: autoplayVar,
      autoplaySpeed: 3000,
      prevArrow: '<button class="slick-prev slick-arrow" aria-label="Previous" type="button"><svg class="icon"><use xlink:href="img/icons/icons-sprite.svg#icon18"></use></svg></button>',
      nextArrow: '<button class="slick-next slick-arrow" aria-label="Previous" type="button"><svg class="icon"><use xlink:href="img/icons/icons-sprite.svg#icon18"></use></svg></button>',
      responsive: [{
          breakpoint: 1200,
          settings: {
            slidesToShow: slideCount1200,
            slidesToScroll: slideCount1200,
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: slideCount992,
            slidesToScroll: slideCount992,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: slideCount768,
            slidesToScroll: slideCount768,
          }
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: slideCount576,
            slidesToScroll: slideCount576,
          }
        },
        {
          breakpoint: 420,
          settings: {
            slidesToShow: slideCount420,
            slidesToScroll: slideCount420,
          }
        }
      ]
    });
  });
}