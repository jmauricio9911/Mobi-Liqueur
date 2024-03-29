/*Modulo Principal*/
angular.module('app.modulo', ['app.config', 'app.master', 'app.global', 'jcs-autoValidate', 'app.page'])
    .directive('enterKey', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.enterKey);
                    });

                    event.preventDefault();
                }
            });
        };
    });