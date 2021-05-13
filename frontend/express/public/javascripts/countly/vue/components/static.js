/* global jQuery, CV, Vue*/

(function(countlyVue, $) {


    $(document).ready(function() {

        var SidebarView = countlyVue.views.create({
            template: CV.T('/javascripts/countly/vue/templates/sidebar.html'),
            mixins: [
                countlyVue.container.mixin({
                    "categories": "/sidebar/menuCategory",
                    "menus": "/sidebar/menu",
                    "submenus": "/sidebar/submenu"
                })
            ],
            watch: {
                'activeApp.type': function() {
                    var self = this;
                    this.$nextTick(function() {
                        self.$forceUpdate();
                    });
                }
            },
            computed: {
                activeApp: function() {
                    return this.$store.state.countlyCommon.activeApp;
                },
                categorizedMenus: function() {
                    if (!this.activeApp) {
                        return {};
                    }
                    var self = this;
                    return this.menus.reduce(function(acc, val) {
                        if (val.app_type === self.activeApp.type) {
                            (acc[val.category] = acc[val.category] || []).push(val);
                        }
                        return acc;
                    }, {});
                },
                categorizedSubmenus: function() {
                    if (!this.activeApp) {
                        return {};
                    }
                    var self = this;
                    return this.submenus.reduce(function(acc, val) {
                        if (val.app_type === self.activeApp.type) {
                            (acc[val.parent_code] = acc[val.parent_code] || []).push(val);
                        }
                        return acc;
                    }, {});
                }
            }
        });

        new Vue({
            el: $('#sidebar-vue').get(0),
            store: countlyVue.vuex.getGlobalStore(),
            components: {
                Sidebar: SidebarView
            },
            template: '<div><Sidebar></Sidebar></div>'
        });
    });

}(window.countlyVue = window.countlyVue || {}, jQuery));
