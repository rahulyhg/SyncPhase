require.config({
    urlArgs: 'x=xx',
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'handlebars': {
            exports: 'Handlebars'
        },
        'marked': {
            exports: 'marked'
        }
    },
    paths: {
        jquery: '../components/jquery/dist/jquery.min',
        backbone: '../components/backbone/backbone-min',
        underscore: '../components/underscore/underscore-min',
        handlebars: '../components/handlebars/handlebars.min',
        marked: '../components/marked/lib/marked'
    }
});

define('app', ['models/app'], function (AppModel) {
    return new AppModel();
});

require([
    'app',
    'views/app'
], function (App, AppView) {
    App.on('initiated', function () {
        var app_view = new AppView();
        app_view.render();
    });
    
    App.init();
});
