define('template', [
    'handlebars',
    'jquery',
    'underscore'
], function (Handlebars, jQuery, _) {
    var templates = {};

    var Template = function (id) {

        if (!_.isString(id)) {
            throw 'TemplateID must be string.';
        }

        id += '_template';
        var source_el = jQuery('#' + id);

        if (source_el.length !== 1) {
            throw 'Template Not Found.';
        }

        this.render = Handlebars.compile(source_el.html());
    };

    return function (id) {
        if (typeof templates[id] !== 'undefined') {
            return templates[id];
        }

        var template = templates[id] = new Template(id);
        return template;
    };
});