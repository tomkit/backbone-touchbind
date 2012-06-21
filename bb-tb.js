(function() {

    "use strict";

    var MyView = Backbone.View.extend({

        el: '#container',

        events: {
            'click button:first': 'handleClick',
            'fastclick button:last': 'handleFastClick'
        },

        initialize: function() {

            this.$output = this.$('#output');

            this.addFastButtons();

        },

        handleClick: function() {

            this.$output.prepend('<p>handleClick()</p>');

        },

        handleFastClick: function() {

            this.$output.prepend('<p>handleFastClick()</p>');

        },

        addFastButtons: function(events) {

            var EVENT_NAME = 'click';
            events = events || (_.isFunction(this.events) ? this.events() : this.events) || {};
            
            // Thomas: Forked: Replace click with fastclick
            var newEvents = {};
            _.each(events, function(value, key, list) {
                if(key.substr(0, EVENT_NAME.length + 1) === EVENT_NAME + ' ' || key === EVENT_NAME) {
                    
                    var keyArray = key.split(' ');
                    keyArray[0] = 'fastclick';
                    key = keyArray.join(' ');
                }

                newEvents[key] = value;
            }, this);
            this.events = newEvents;
            
            var that = this;
            EVENT_NAME = 'fastclick';
            function byEventName(key) {
                return key.substr(0, EVENT_NAME.length + 1) === EVENT_NAME + ' ' || key === EVENT_NAME;
            }

            function toJustSelectors(key) {
                return key.substr(EVENT_NAME.length + 1);
            }

            function toMatchingElements(selector) {
                return selector === "" ? [that.el] : that.$(selector).toArray();
            }

            function registerTrigger(element) {
                var temp = new MBP.fastButton(element, function() {
                    $(element).trigger(EVENT_NAME);
                });
            }

            _.chain(newEvents).keys().filter(byEventName).map(toJustSelectors).map(toMatchingElements).flatten().each(registerTrigger);

        },
    });

    MBP.hadTouchEvent = true; // work around some Android 2.3.x workarounds for the demo...

    new MyView();

})();
