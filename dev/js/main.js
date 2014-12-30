/*! [PROJECT_NAME] | December 2014 | Suitmedia */

;(function ( window, document, undefined ) {

    var path = {
        css: 'assets/css/',
        js : 'assets/js/vendor/'
    };

    var assets = {
        _jquery_cdn     : '//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js',
        _jquery_local   : myPrefix + path.js + 'jquery.min.js',
        _fastclick      : myPrefix + path.js + 'fastclick.min.js'
    };

    var Site = {

        init: function () {
            Site.fastClick();
            Site.enableActiveStateMobile();
            Site.WPViewportFix();
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
