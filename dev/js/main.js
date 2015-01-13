/*! [PROJECT_NAME] | December 2014 | Suitmedia */

;(function ( window, document, undefined ) {

    var path = {
        css: 'assets/css/',
        js : 'assets/js/vendor/'
    };

    var assets = {
        _jquery_cdn     : '//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js',
        _jquery_local   : myPrefix + path.js + 'jquery.min.js',
        _fastclick      : myPrefix + path.js + 'fastclick.min.js',
        _bazeModalJS    : myPrefix + path.js + 'baze.modal.min.js',
        _highlightCSS   : '//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/atelier-dune.light.min.css',
        _highlightJS    : '//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/highlight.min.js',
        _disqus         : myPrefix + path.js + 'disqus.min.js'
    };

    var Site = {

        init: function () {
            Site.fastClick();
            Site.enableActiveStateMobile();
            Site.WPViewportFix();
            Site.initModal();
            Site.codeHighlighter();
            Site.loadComment();
        },

        fastClick: function () {
            Modernizr.load({
                load    : assets._fastclick,
                complete: function () {
                    FastClick.attach(document.body);
                }
            });
        },

        enableActiveStateMobile: function () {
            if ( document.addEventListener ) {
                document.addEventListener('touchstart', function () {}, true);
            }
        },

        WPViewportFix: function () {
            if ( navigator.userAgent.match(/IEMobile\/10\.0/) ) {
                var style   = document.createElement("style"),
                    fix     = document.createTextNode("@-ms-viewport{width:auto!important}");

                style.appendChild(fix);
                document.getElementsByTagName('head')[0].appendChild(style);
            }
        },

        initModal: function () {
            var $triggers = $('[data-modal-trigger]');

            Modernizr.load({
                load    : [
                    assets._bazeModalJS
                ],
                complete: function () {
                    $triggers.bazeModal();
                }
            });
        },

        codeHighlighter: function () {
            var $html = $('html');

            if ( !$html.hasClass('csstransforms') ) return;

            Modernizr.load({
                load    : [ assets._highlightJS, assets._highlightCSS ],
                complete: function () {
                    hljs.initHighlighting();
                }
            });
        },

        loadComment: function () {
            var $trigger = $('#loadComment');

            $trigger.click( function () {
                Modernizr.load(assets._disqus);
                $(this).fadeOut();
            });
        }

    };

    var siteInit = function () {
        Site.init();
    };

    var checkJquery = function () {
        Modernizr.load([
            {
                test    : window.jQuery,
                nope    : assets._jquery_local,
                complete: siteInit
            }
        ]);
    };

    Modernizr.load({
        load    : assets._jquery_cdn,
        complete: checkJquery
    });

    window.Site = Site;

})( window, document );
