window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame       || 
      window.webkitRequestAnimationFrame || 
      window.mozRequestAnimationFrame    || 
      window.oRequestAnimationFrame      || 
      window.msRequestAnimationFrame     || 
      function(callback, element){
        window.setTimeout(callback, 1000 / 60);
      };
})();
window.requestTimeout=function(fn,delay){if(!window.requestAnimationFrame&&!window.webkitRequestAnimationFrame&&!(window.mozRequestAnimationFrame&&window.mozCancelRequestAnimationFrame)&&!window.oRequestAnimationFrame&&!window.msRequestAnimationFrame)return window.setTimeout(fn,delay);var start=(new Date).getTime(),handle=new Object;function loop(){var current=(new Date).getTime(),delta=current-start;delta>=delay?fn.call():handle.value=requestAnimFrame(loop)}handle.value=requestAnimFrame(loop);return handle};window.clearRequestTimeout=function(handle){window.cancelAnimationFrame?window.cancelAnimationFrame(handle.value):window.webkitCancelAnimationFrame?window.webkitCancelAnimationFrame(handle.value):window.webkitCancelRequestAnimationFrame?window.webkitCancelRequestAnimationFrame(handle.value):window.mozCancelRequestAnimationFrame?window.mozCancelRequestAnimationFrame(handle.value):window.oCancelRequestAnimationFrame?window.oCancelRequestAnimationFrame(handle.value):window.msCancelRequestAnimationFrame?window.msCancelRequestAnimationFrame(handle.value):clearTimeout(handle)};

;(function ( $, window, document, undefined ) {

  var pluginName  = 'bazeModal';

  var $page       = $('html, body');

  var classes     = {
    show    : 'modal--show',
    scroll  : 'modal-disable-scroll',
    closeBtn: 'modal-dialog-close'
  };

  var defaults    = {
    onOpen: null,
    onClose: null
  };

  function Plugin ( element, options ) {
    this.element    = $(element);
    this.settings   = $.extend( {}, defaults, options );

    this.init();
  }

  Plugin.prototype.init = function () {
    this.addClickHandler();
    this.escapeKeyHandler();
    this.destroy();
  };

  Plugin.prototype.addClickHandler = function () {
    var cb = this.settings;

    var getTarget = function (e) {
      var target    = this.getAttribute('data-target'),
          $target   = $(target),
          $closeBtn = $target.find('.' + classes.closeBtn),
          callCloseModal;

      if ( !$target.length ) return;

      var callCloseModal = function () {
        Plugin.prototype.closeModal( $target, cb.onClose );
      };

      Plugin.prototype.openModal( $target, cb.onOpen );

      $closeBtn
        .unbind('click')
        .click( callCloseModal );
    };

    this.element
      .unbind('click', getTarget)
      .click( getTarget );
  };

  Plugin.prototype.escapeKeyHandler = function () {
    var $doc  = $(document);
    var cb    = this.settings;

    var isEscapeKey = function (e) {
      var elem = $('.' + classes.show);

      if ( e.keyCode === 27 ) {
        Plugin.prototype.closeModal(elem, cb.onClose);
      }

    };

    $doc
      .unbind('keyup', isEscapeKey)
      .keyup( isEscapeKey );
  };


  Plugin.prototype.openModal = function ( target, cb ) {
    if ( !target.length ) return;

    target.addClass( classes.show );
    disableScroll();

    if ( cb ) {
      requestTimeout( cb, 600 );
    }
  };

  Plugin.prototype.closeModal = function ( target, cb ) {
    if ( !target.length ) return;

    target.removeClass( classes.show );
    enableScroll();

    if ( cb ) {
      requestTimeout( cb, 600 );
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


  $.fn[ pluginName ] = function ( options ) {
    this.each(function() {
      if ( !$.data( this, 'plugin_' + pluginName ) ) {
        $.data( this, 'plugin_' + pluginName, new Plugin( this, options ) );
      }
    });

    return this;
  };

})( jQuery, window, document );