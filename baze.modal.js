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
    btn     : 'bzm-btn'
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
    this.escapeKeyHandler();
    this.destroy();
  };

  Plugin.prototype.setupModal = function () {
    var target  = this.element.attr('data-target'),
        $target = $(target),
        $body   = $(document.body),

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

    $target.removeAttr('id');

    dBtnX
      .addClass( classes.btnX )
      .attr('data-close-modal', '')
      .text('Close');

    dTitle
      .addClass( classes.title )
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
      .append( dHeader )
      .append( dBody )
      .append( dFooter );

    dOverlay
      .attr('id', dID)
      .addClass( classes.overlay )
      .append( dDialog );

    $body.append( dOverlay );
  };

  Plugin.prototype.addClickHandler = function () {
    var cb = this.settings;

    var getTarget = function (e) {
      var target    = this.getAttribute('data-target'),
          $target   = $(target),
          $closeBtn = $target.find('[' + classes.closeBtn + ']'),
          callCloseModal;

      if ( !$target.length ) return;

      callCloseModal = function (e) {
        Plugin.prototype.closeModal( $target, cb.onClose );
      };

      Plugin.prototype.openModal( $target, cb.onOpen );

      $closeBtn
        .unbind('click')
        .bind('click', callCloseModal );
    };

    this.element
      .unbind('click', getTarget)
      .bind('click', getTarget );
  };

  Plugin.prototype.escapeKeyHandler = function () {
    var $doc  = $(document);
    var cb    = this.settings;

    var isEscapeKey = function (e) {
      var elem = $('.' + classes.show);

      if ( e.keyCode === 27 && elem.length ) {
        var $btnClose = elem.find('.' + classes.btnX);

        $btnClose.trigger('click');
      }

    };

    $doc
      .unbind('keyup', isEscapeKey)
      .bind('keyup', isEscapeKey );
  };


  Plugin.prototype.openModal = function ( target, cb ) {
    if ( !target.length ) return;

    target.addClass( classes.show );
    disableScroll();

    if ( cb ) {
      timeout( cb, 600 );
    }
  };

  Plugin.prototype.closeModal = function ( target, cb ) {
    if ( !target.length ) return;

    target.removeClass( classes.show );
    enableScroll();

    if ( cb ) {
      timeout( cb, 600 );
    }
  };

  Plugin.prototype.destroy = function () {
    var elem = this.element;

    elem.on('bazemodal.destroy', function () {
      elem.unbind('click');
    });
  };

  function disableScroll() {
    $page.addClass( classes.scroll );
  }

  function enableScroll() {
    $page.removeClass( classes.scroll );
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

      delta >= delay ? fn.call() : handle.value = requestAnimFrame(loop);
    }

    handle.value = requestAnimFrame(loop);
    return handle;
  }


  $.fn[ pluginName ] = function ( options ) {
    return this.each(function() {
      if ( !$.data( this, 'plugin_' + pluginName ) ) {
        $.data( this, 'plugin_' + pluginName, new Plugin( this, options ) );
      }
    });
  };

})( jQuery, window, document );