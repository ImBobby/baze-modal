/*! Baze-Modal v1.2.0 | (c) 2014 @_bobbylie | github.com/ImBobby/baze-modal */

/**
 * requestAnimationFrame polyfill
 * http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
 **/
window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame    || 
      window.webkitRequestAnimationFrame  || 
      window.mozRequestAnimationFrame     || 
      window.oRequestAnimationFrame       || 
      window.msRequestAnimationFrame      || 
      function(callback, element){
        window.setTimeout(callback, 1000 / 60);
      };
})();

;(function ( $, window, document, undefined ) {

  var pluginName = 'bazeModal';

  var $page = $('html, body');

  var CBDURATION = supportTransition()? 600 : 100;

  var classes = {
    show    : 'bzm--show',
    scroll  : 'bzm-disable-scroll',
    closeBtn: 'data-close-modal',

    header  : 'bzm-header',
    title   : 'bzm-title',
    body    : 'bzm-body',
    footer  : 'bzm-footer',
    dialog  : 'bzm-dialog',
    overlay : 'bzm',
    btnX    : 'bzm-header-close',
    btn     : 'bzm-btn',
    oldie   : 'bzm--oldie',
    oldieS  : 'bzm--oldie-show'
  };

  var defaults = {
    onOpen: null,
    onClose: null
  };

  function Plugin ( element, options ) {
    this.element  = $(element);
    this.settings = $.extend( {}, defaults, options );

    this.init();
  }

  Plugin.prototype.init = function () {
    this.setupModal();
    this.addClickHandler();
    this.destroy();
  };

  Plugin.prototype.setupModal = function () {
    var target  = this.element.attr('data-target'),
        $target = $(target),
        $body   = $(document.body),
        UID     = getID(),

        dID       = $target.attr('id'),
        title     = $target.attr('data-title'),
        dContent  = $target.html(),
        dBtnX     = $( document.createElement('button') ),
        dTitle    = $( document.createElement('h3') ),
        dHeader   = $( document.createElement('div') ),
        dBody     = $( document.createElement('div') ),
        dBtnClose = $( document.createElement('button') ),
        dFooter   = $( document.createElement('div') ),
        dDialog   = $( document.createElement('div') ),
        dOverlay  = $( document.createElement('div') );

    $target
      .removeAttr('id')
      .attr('aria-hidden', 'true');

    dBtnX
      .addClass( classes.btnX )
      .attr('data-close-modal', '')
      .text('Close');

    dTitle
      .addClass( classes.title )
      .attr('id', UID)
      .text( title );

    dHeader
      .addClass( classes.header )
      .append( dTitle )
      .append( dBtnX );

    dBody
      .addClass( classes.body )
      .html( dContent );

    dBtnClose
      .addClass( classes.btn )
      .attr('data-close-modal', '')
      .text('Close');

    dFooter
      .addClass( classes.footer )
      .append( dBtnClose );

    dDialog
      .addClass( classes.dialog )
      .attr({
        'role': 'dialog',
        'aria-labelledby': UID
      })
      .append( dHeader )
      .append( dBody )
      .append( dFooter );

    dOverlay
      .attr({
        'id': dID,
        'aria-hidden': 'true',
        'tabindex': '-1'
      })
      .addClass( classes.overlay )
      .append( dDialog );

    if ( !supportTransition() ) {
      dOverlay.addClass( classes.oldie );
    }

    $body.append( dOverlay );
  };

  Plugin.prototype.addClickHandler = function () {
    var trigger = this.element,
        cbOpen  = this.settings.onOpen,
        cbClose = this.settings.onClose;

    var getTarget = function (e) {
      var target    = this.getAttribute('data-target'),
          $target   = $(target),
          $closeBtn = $target.find('[' + classes.closeBtn + ']'),
          openModal,
          closeModal;

      if ( !$target.length ) return;

      openModal = function () {
        if ( supportTransition() ) {
          $target.addClass( classes.show );
        } else {
          $target.addClass( classes.oldieS );
        }

        $target.attr({
          'aria-hidden': 'false',
          'tabindex': '0'
        });

        disableScroll();

        if ( cbOpen && typeof cbOpen === 'function' ) {
          timeout( cbOpen, CBDURATION );
        }

        timeout(function () {
          $closeBtn.eq(0).focus();
        }, CBDURATION);
      };

      closeModal = function () {
        if ( supportTransition() ) {
          $target.removeClass( classes.show );
        } else {
          $target.removeClass( classes.oldieS );
        }

        $target.attr({
          'aria-hidden': 'true',
          'tabindex': '-1'
        });

        enableScroll();
        trigger.focus();

        if ( cbClose && typeof cbClose === 'function' ) {
          timeout( cbClose, CBDURATION );
        }
      };

      openModal();

      $closeBtn
        .unbind('click')
        .bind('click', closeModal );
    };

    this.element
      .unbind('click', getTarget)
      .bind('click', getTarget );
  };

  Plugin.prototype.destroy = function () {
    var elem = this.element;

    elem.on('bazemodal.destroy', function () {
      elem.unbind('click');
    });
  };

  (function escapeKeyHandler() {
    var $doc  = $(document);
    var cb    = this.settings;

    var isEscapeKey = function (e) {
      var key   = ( window.event ) ? e.which : e.keyCode,
          elem;

      if ( supportTransition() ) {
        elem = $('.' + classes.show);
      } else {
        elem = $('.' + classes.oldieS);
      }

      if ( key === 27 && elem.length ) {
        var $btnClose = elem.find('.' + classes.btnX);

        $btnClose.trigger('click');
      }

    };

    $doc
      .unbind('keyup', isEscapeKey)
      .bind('keyup', isEscapeKey );
  })();

  function disableScroll() {
    $page.addClass( classes.scroll );
  }

  function enableScroll() {
    $page.removeClass( classes.scroll );
  }

  function getID() {
    var id = 'bzm' + (new Date()).getTime();

    return id;
  }


  /**
   * Better setTimeout using requestAnimationFrame
   * https://gist.github.com/joelambert/1002116#file-requesttimeout-js
   **/
  function timeout( fn, delay ) {
    if ( !window.requestAnimationFrame &&
         !window.webkitRequestAnimationFrame &&
         !( window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame ) &&
         !window.oRequestAnimationFrame &&
         !window.msRequestAnimationFrame )
      return window.setTimeout( fn, delay );

    var start   = new Date().getTime(),
        handle  = {};

    function loop() {
      var current = new Date().getTime(),
          delta   = current - start;

      if ( delta >= delay ) {
        fn.call();
      } else {
        handle.value = requestAnimFrame(loop);
      }
    }

    handle.value = requestAnimFrame(loop);
    return handle;
  }

  /**
   * http://stackoverflow.com/a/7265037/1762903
   **/
  function supportTransition() {
    var b = document.body || document.documentElement,
        s = b.style,
        p = 'transition';

    if ( p in s ) return true;

    var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];

    p = p.charAt(0).toUpperCase() + p.substr(1);

    for (var i = 0; i < v.length; i++) {
      if ( [v[i] + p] in s ) return true;
    }

    return false;
  }


  $.fn[ pluginName ] = function ( options ) {
    return this.each(function() {
      if ( !$.data( this, 'plugin_' + pluginName ) ) {
        $.data( this, 'plugin_' + pluginName, new Plugin( this, options ) );
      }
    });
  };

})( jQuery, window, document );