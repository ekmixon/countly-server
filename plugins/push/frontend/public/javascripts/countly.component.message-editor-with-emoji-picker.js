/*global CV, countlyVue*/
(function(countlyPushNotificationComponent){
    countlyPushNotificationComponent.MessageEditorWithEmojiPicker = countlyVue.views.create({
        template: CV.T("/push/templates/message-editor-with-emoji-picker.html"),
        props: {
            placeholder: {
                type: String,
                required: false,
                default: ""
            },
            type: {
                type: String,
                required: false,
                default: "text"
            },
            id: {
                type: String,
                required: true
            }
        },
        data: function() {
            return {
                search: "",
            }
        },
        computed:{
            hasDefaultSlot: function() {
                return Boolean(this.$slots.default);
            },
        },
        methods: {
            appendZeroWidthSpace: function() {
                this.$refs.element.appendChild(document.createTextNode('\u200B'));
            },
            setCursorAtEnd: function() {
                var selection = window.getSelection();
                var textRange = document.createRange();
                selection.removeAllRanges();
                textRange.selectNodeContents(this.$refs.element);
                textRange.collapse(false);
                selection.addRange(textRange);
                this.$refs.element.focus();
            },
            onPropertyClick: function(id){
                var self = this;
                return function(){
                    self.$emit("click", id);
                }
            },
            addEmptyUserProperty: function(id,value) {
                if(!value){
                    value = "Select property|";
                }
                var newElement = document.createElement("span")
                newElement.setAttribute("id","id-"+id);
                newElement.setAttribute("contentEditable",false);
                newElement.setAttribute("class","cly-vue-push-notification-message-editor-with-emoji-picker__user-property");
                newElement.setAttribute("data-user-property-label","Select property");
                newElement.setAttribute("data-user-property-value", value);
                newElement.setAttribute("data-user-property-fallback","");
                newElement.innerText = value;
                newElement.onclick = this.onPropertyClick(id);
                this.$refs.element.appendChild(newElement);
                this.appendZeroWidthSpace();
                this.$emit('change', this.$refs.element.innerHTML);
            },
            removeUserProperty: function(id) {
                this.$refs.element.querySelector("#id-"+id).remove();
            },
            getHTMLContent: function() {
                return this.$refs.element.innerHTML;
            },
            setUserPropertyValue: function(id,previewValue,value){
                var element = this.$refs.element.querySelector("#id-"+id);
                element.innerText = previewValue;
                element.setAttribute("data-user-property-value", value);
                this.$emit('change', this.$refs.element.innerHTML);
            },
            setUserPropertyFallbackValue: function(id,previewValue,fallback) {
                var element = this.$refs.element.querySelector("#id-"+id);
                element.setAttribute("data-user-property-fallback",fallback);
                element.innerText = previewValue;
                this.$emit('change', this.$refs.element.innerHTML);
            },
            addEventListeners: function(ids) {
                var self = this;
                ids.forEach(function(id){
                    document.querySelector("#id-"+id).onclick = self.onPropertyClick(id);      
                });
            },
            reset: function(htmlContent,ids) {
                this.$refs.element.innerHTML = htmlContent;
                this.addEventListeners(ids);
            },
            appendEmoji: function(emoji) {
                this.$refs.element.appendChild(document.createTextNode(emoji));
                this.setCursorAtEnd();
                this.$emit('change', this.$refs.element.innerHTML);
            },
            onInput: function(newValue) {
                this.$emit('change', newValue);
            },
        },
        mounted: function() {
            var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
            if(isIE11){
                var element = document.querySelector('#'+this.id);
                element.addEventListener('textinput', function ( event ) {
                    var event = document.createEvent('Event');
                    event.initEvent('input', true, true);
                    element.dispatchEvent(event);
                });
            }
        },
        destroyed: function() {
            document.querySelector('#'+this.id).removeEventListener('textinput');
            //TODO: remove all user properties elements event listeners
        },
        components: {
            'emoji-picker': countlyPushNotificationComponent.EmojiPicker
        },
    });

})(window.countlyPushNotificationComponent = window.countlyPushNotificationComponent || {})