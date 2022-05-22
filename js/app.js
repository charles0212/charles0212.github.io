// 页面 header 处理
// var currentScrollHeight = window.pageYOffset, scrollOffset = 0
// window.onscroll = function (e) {
//     scrollOffset = window.pageYOffset - currentScrollHeight
//     currentScrollHeight = window.pageYOffset
//     if (scrollOffset > 0) { //如果向下浏览大于 100px 则隐藏，否则显示
//         document.querySelector('.site-header').classList.add('header-hidden');
//     } else {
//         document.querySelector('.site-header').classList.remove('header-hidden');
//     }
// }

function scrollToc() {
  var SPACING = 20;
  var $toc = $('.post-toc');
  var $footer = $('.footer');

  if ($toc.length) {

    // 设置toc的left值
    var $article = $('#posts');
    var left = $article.offset().left + $article.width() + 10;
    $toc.css("left", left);

    var minScrollTop = $toc.offset().top - SPACING;
    var maxScrollTop = $footer.offset().top - $toc.height() - SPACING;

    var tocState = {
      start: {
        'position': 'absolute',
        'top': minScrollTop
      },
      process: {
        'position': 'fixed',
        'top': SPACING
      },
      end: {
        'position': 'absolute',
        'top': maxScrollTop
      }
    }

    $(window).scroll(function () {
      var scrollTop = $(window).scrollTop();

      if (scrollTop < minScrollTop) {
        $toc.css(tocState.start);
      } else if (scrollTop > maxScrollTop) {
        $toc.css(tocState.end);
      } else {
        $toc.css(tocState.process);
        // TODO fixed的时候需要设置width
      }
    })
  }
};

function escapeSelector(selector) {
  return selector.replace(/[!"$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
};

function tocFollow() {
  var HEADERFIX = 30;
  var $toclink = $('.toc-link');

  // 通过toc的找到body中的锚点信息
  var $headerlink = $('.headerlink');

  var offsetBase = 0;
  var offsets = [];
  var targets = [];

  $(document.body)
    .find(".post-toc li>.toc-link")
    .map(function () {
      var $el = $(this)
      var href = $el.data('target') || $el.attr('href')
      var $href = /^#./.test(href) && $(escapeSelector(href))

      return ($href
        && $href.length
        && $href.is(':visible')
        && [[$href["offset"]().top + offsetBase, href]]) || null
    })
    .sort(function (a, b) {
      return a[0] - b[0]
    })
    .each(function () {
      offsets.push(this[0])
      targets.push(this[1])
    });

  // 没有文章目录不显示
  if (offsets.length == 0) {
    $('.post-toc').hide();
  }

  $(window).scroll(function () {
    var scrollTop = $(window).scrollTop();
    for (var i = 0; i < $toclink.length; i++) {
      var isLastOne = i + 1 === $toclink.length,
        currentTop = offsets[i] - HEADERFIX,
        nextTop = isLastOne ? Infinity : offsets[i + 1] - HEADERFIX;

      if (currentTop < scrollTop && scrollTop <= nextTop) {
        $($toclink[i]).addClass('active');
      } else {
        $($toclink[i]).removeClass('active');
      }
    }
  });
};

function scrollTop() {
  //当滚动条的位置处于距顶部150像素以下时，跳转链接出现，否则消失
  $(function () {
    $(window).scroll(function () {
      if ($(window).scrollTop() > 150) {
        $(".go-top").fadeIn(500);
      }
      else {
        $(".go-top").fadeOut(500);
      }
    });

    //当点击跳转链接后，回到页面顶部位置
    $(".go-top").click(function () {
      if ($('html').scrollTop()) {
        $('html').animate({scrollTop: 0}, 1000);
        return false;
      }
      $('body').animate({scrollTop: 0}, 1000);
      return false;
    });
  });
}

$(function () {
  scrollToc();
  tocFollow();
  scrollTop();
});
