import angular from 'angular';
import ListErrors from './list-errors/list-errors.component';
import compareTo from './directives/compareTo.direcive';
import fileModel from './directives/uploadFile.directive';
import Back from './back/back.component';
import ListPagination from './list-pagination/list-pagination.component';
import ResetPassword from './reset-password/reset-password.component';
import CreateUser from './create-user/create-user.component';
import RecordPaymentComponent from './payment/payment-record.component';
import ViewPaymentComponent from './payment/payment.component';
import BillingHistoryComponent from './billing-history-details/billing-history-details.component';
import DateRangeComponent from './daterange/date-range.component';
import TransactionsComponent from './transactions/transactions.component';
import accessibleForm from './directives/accessible-form.directive';
import pgTab from './directives/pg-tab.directive';
import isActive from './directives/navigation.direcive';
import background from './directives/background.direcive';
import properFilter from './directives/proper-string.filter';
import momentFilter from './directives/moment.filter';
import rangeFilter from './directives/range.filter';
import imageFilter from './directives/image.filter';
import colorFilter from './directives/color.filter';
import rawHtmlFilter from './directives/raw.html.filter';
import shimmer from './shimmer/shimmer.component';
import avatar from './avatar/avatar.component';
import notification from './notification/notification.component';
import search from './search/search.component';
import CreateRole from './create-role/create-role.component';
import CreateBranch from './create-branch/create-branch.component';
import RoleListComponent from './role-list/role-list.component';
import emailValidator from './directives/email-validator.directive';
import starRating from './directives/star-rating.directive';
import SuponContactComponent from './contact/contact.component';
import PrivacyComponent from './privacy/privacy.component';
import Custom404Component from './404/custom404.component';

const componentsModule = angular.module('app.componentsModule', []);
componentsModule.run(['$rootScope', '$translate', '$translatePartialLoader', ($rootScope, $translate, $translatePartialLoader) => {
    $rootScope.$on('$translatePartialLoaderStructureChanged', () => {
        $translate.refresh();
    });
    $translatePartialLoader.addPart('components');
    $translate.refresh();
}]);

// components
componentsModule.component('listErrors', ListErrors)
    .component('listPagination', ListPagination)
    .component('back', Back)
    .component('resetPassword', ResetPassword)
    .component('createUser', CreateUser)
    .component('createBranch', CreateBranch)
    .component('paymentRecord', RecordPaymentComponent)
    .component('viewPayment', ViewPaymentComponent)
    .component('billingHistory', BillingHistoryComponent)
    .component('dateRange', DateRangeComponent)
    .component('transactions', TransactionsComponent)
    .component('shimmer', shimmer)
    .component('avatar', avatar)
    .component('notification', notification)
    .component('search', search)
    .component('createRole', CreateRole)
    .component('roleList', RoleListComponent)
    .component('suponContact', SuponContactComponent)
    .component('privacyComponent', PrivacyComponent)
    .component('custom404Component', Custom404Component)
    /* Directives */
    .directive('isActive', isActive)
    .directive('background', background)
    .directive('fileModel', fileModel)
    .directive('compareTo', compareTo)
    .directive('accessibleForm', accessibleForm)
    .directive('pgTab', pgTab)
    .directive('emailValidator', emailValidator)
    .directive('backImg', () => function (scope, element, attrs) {
        const url = attrs.backImg;
        element.css({
            'background-image': `url(${url})`,
            'background-size': 'cover'
        });
    })
    .directive('emailComposer', () => function () {
        return {
            restrict: 'A',
            link(scope, element, attrs) {
                // Email composer
                const emailComposerToolbarTemplate = {
                    'font-styles': function (locale) {
                        return '<li class="dropdown">' + '<a data-toggle="dropdown" class="btn btn-default dropdown-toggle ">' + '<span class="editor-icon editor-icon-headline"></span>' + '<span class="current-font">Normal</span>' + '<b class="caret"></b>' + '</a>' + '<ul class="dropdown-menu">' + '<li><a tabindex="-1" data-wysihtml5-command-value="p" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">Normal</a></li>' + '<li><a tabindex="-1" data-wysihtml5-command-value="h1" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">1</a></li>' + '<li><a tabindex="-1" data-wysihtml5-command-value="h2" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">2</a></li>' + '<li><a tabindex="-1" data-wysihtml5-command-value="h3" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">3</a></li>' + '<li><a tabindex="-1" data-wysihtml5-command-value="h4" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">4</a></li>' + '<li><a tabindex="-1" data-wysihtml5-command-value="h5" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">5</a></li>' + '<li><a tabindex="-1" data-wysihtml5-command-value="h6" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">6</a></li>' + '</ul>' + '</li>';
                    },
                    emphasis(locale) {
                        return '<li>' + '<div class="btn-group">' + '<a tabindex="-1" title="CTRL+B" data-wysihtml5-command="bold" class="btn  btn-default" href="javascript:;" unselectable="on"><i class="editor-icon editor-icon-bold"></i></a>' + '<a tabindex="-1" title="CTRL+I" data-wysihtml5-command="italic" class="btn  btn-default" href="javascript:;" unselectable="on"><i class="editor-icon editor-icon-italic"></i></a>' + '<a tabindex="-1" title="CTRL+U" data-wysihtml5-command="underline" class="btn  btn-default" href="javascript:;" unselectable="on"><i class="editor-icon editor-icon-underline"></i></a>' + '</div>' + '</li>';
                    },
                    blockquote(locale) {
                        return '<li>' + '<a tabindex="-1" data-wysihtml5-display-format-name="false" data-wysihtml5-command-value="blockquote" data-wysihtml5-command="formatBlock" class="btn  btn-default" href="javascript:;" unselectable="on">' + '<i class="editor-icon editor-icon-quote"></i>' + '</a>' + '</li>';
                    },
                    lists(locale) {
                        return '<li>' + '<div class="btn-group">' + '<a tabindex="-1" title="Unordered list" data-wysihtml5-command="insertUnorderedList" class="btn  btn-default" href="javascript:;" unselectable="on"><i class="editor-icon editor-icon-ul"></i></a>' + '<a tabindex="-1" title="Ordered list" data-wysihtml5-command="insertOrderedList" class="btn  btn-default" href="javascript:;" unselectable="on"><i class="editor-icon editor-icon-ol"></i></a>' + '<a tabindex="-1" title="Outdent" data-wysihtml5-command="Outdent" class="btn  btn-default" href="javascript:;" unselectable="on"><i class="editor-icon editor-icon-outdent"></i></a>' + '<a tabindex="-1" title="Indent" data-wysihtml5-command="Indent" class="btn  btn-default" href="javascript:;" unselectable="on"><i class="editor-icon editor-icon-indent"></i></a>' + '</div>' + '</li>';
                    },
                    image(locale) {
                        return '<li>' + '<div class="bootstrap-wysihtml5-insert-image-modal modal fade">' + '<div class="modal-dialog ">' + '<div class="modal-content">' + '<div class="modal-header">' + '<a data-dismiss="modal" class="close">×</a>' + '<h3>Insert image</h3>' + '</div>' + '<div class="modal-body">' + '<input class="bootstrap-wysihtml5-insert-image-url form-control" value="http://">' + '</div>' + '<div class="modal-footer">' + '<a data-dismiss="modal" class="btn btn-default">Cancel</a>' + '<a data-dismiss="modal" class="btn btn-primary">Insert image</a>' + '</div>' + '</div>' + '</div>' + '</div>' + '<a tabindex="-1" title="Insert image" data-wysihtml5-command="insertImage" class="btn  btn-default" href="javascript:;" unselectable="on">' + '<i class="editor-icon editor-icon-image"></i>' + '</a>' + '</li>';
                    },
                    link(locale) {
                        return '<li>' + '<div class="bootstrap-wysihtml5-insert-link-modal modal fade">' + '<div class="modal-dialog ">' + '<div class="modal-content">' + '<div class="modal-header">' + '<a data-dismiss="modal" class="close">×</a>' + '<h3>Insert link</h3>' + '</div>' + '<div class="modal-body">' + '<input class="bootstrap-wysihtml5-insert-link-url form-control" value="http://">' + '<label class="checkbox"> <input type="checkbox" checked="" class="bootstrap-wysihtml5-insert-link-target">Open link in new window</label>' + '</div>' + '<div class="modal-footer">' + '<a data-dismiss="modal" class="btn btn-default">Cancel</a>' + '<a data-dismiss="modal" class="btn btn-primary" href="">Insert link</a>' + '</div>' + '</div>' + '</div>' + '</div>' + '<a tabindex="-1" title="Insert link" data-wysihtml5-command="createLink" class="btn  btn-default" href="javascript:;" unselectable="on">' + '<i class="editor-icon editor-icon-link"></i>' + '</a>' + '</li>';
                    },
                    html(locale) {
                        return '<li>' + '<div class="btn-group">' + '<a tabindex="-1" title="Edit HTML" data-wysihtml5-action="change_view" class="btn  btn-default" href="javascript:;" unselectable="on">' + '<i class="editor-icon editor-icon-html"></i>' + '</a>' + '</div>' + '</li>';
                    }
                };

                setTimeout(() => {
                    const emailBody = $(element).find('.email-body');
                    emailBody.length && emailBody.wysihtml5({
                        html: true,
                        stylesheets: ['pages/css/editor.css'],
                        customTemplates: emailComposerToolbarTemplate
                    });

                    $(element).find('.wysihtml5-toolbar').appendTo('.email-toolbar-wrapper');
                }, 500);
            }
        };
    })
    .directive('replyEditor', () => function () {
        // Wysiwyg editor custom options

        const editorTemplate = {
            'font-styles': function (locale) {
                return '<li class="dropdown dropup">' + '<a data-toggle="dropdown" class="btn btn-default dropdown-toggle ">    <span class="glyphicon glyphicon-font"></span>    <span class="current-font">Normal text</span>    <b class="caret"></b>  </a>' + '<ul class="dropdown-menu">    <li><a tabindex="-1" data-wysihtml5-command-value="p" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">Normal text</a></li>     <li><a tabindex="-1" data-wysihtml5-command-value="h1" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">Heading 1</a></li>    <li><a tabindex="-1" data-wysihtml5-command-value="h2" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">Heading 2</a></li>    <li><a tabindex="-1" data-wysihtml5-command-value="h3" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">Heading 3</a></li>    <li><a tabindex="-1" data-wysihtml5-command-value="h4" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">Heading 4</a></li>    <li><a tabindex="-1" data-wysihtml5-command-value="h5" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">Heading 5</a></li>    <li><a tabindex="-1" data-wysihtml5-command-value="h6" data-wysihtml5-command="formatBlock" href="javascript:;" unselectable="on">Heading 6</a></li>  </ul>' + '</li>';
            },
            emphasis(locale) {
                return '<li>' + '<div class="btn-group">' + '<a tabindex="-1" title="CTRL+B" data-wysihtml5-command="bold" class="btn  btn-default" href="javascript:;" unselectable="on"><i class="editor-icon editor-icon-bold"></i></a>' + '<a tabindex="-1" title="CTRL+I" data-wysihtml5-command="italic" class="btn  btn-default" href="javascript:;" unselectable="on"><i class="editor-icon editor-icon-italic"></i></a>' + '<a tabindex="-1" title="CTRL+U" data-wysihtml5-command="underline" class="btn  btn-default" href="javascript:;" unselectable="on"><i class="editor-icon editor-icon-underline"></i></a>' + '</div>' + '</li>';
            },
            blockquote(locale) {
                return '<li>' + '<a tabindex="-1" data-wysihtml5-display-format-name="false" data-wysihtml5-command-value="blockquote" data-wysihtml5-command="formatBlock" class="btn  btn-default" href="javascript:;" unselectable="on">' + '<i class="editor-icon editor-icon-quote"></i>' + '</a>' + '</li>';
            },
            lists(locale) {
                return '<li>' + '<div class="btn-group">' + '<a tabindex="-1" title="Unordered list" data-wysihtml5-command="insertUnorderedList" class="btn  btn-default" href="javascript:;" unselectable="on"><i class="editor-icon editor-icon-ul"></i></a>' + '<a tabindex="-1" title="Ordered list" data-wysihtml5-command="insertOrderedList" class="btn  btn-default" href="javascript:;" unselectable="on"><i class="editor-icon editor-icon-ol"></i></a>' + '<a tabindex="-1" title="Outdent" data-wysihtml5-command="Outdent" class="btn  btn-default" href="javascript:;" unselectable="on"><i class="editor-icon editor-icon-outdent"></i></a>' + '<a tabindex="-1" title="Indent" data-wysihtml5-command="Indent" class="btn  btn-default" href="javascript:;" unselectable="on"><i class="editor-icon editor-icon-indent"></i></a>' + '</div>' + '</li>';
            },
            image(locale) {
                return '<li>' + '<div class="bootstrap-wysihtml5-insert-image-modal modal fade">' + '<div class="modal-dialog ">' + '<div class="modal-content">' + '<div class="modal-header">' + '<a data-dismiss="modal" class="close">×</a>' + '<h3>Insert image</h3>' + '</div>' + '<div class="modal-body">' + '<input class="bootstrap-wysihtml5-insert-image-url form-control" value="http://">' + '</div>' + '<div class="modal-footer">' + '<a data-dismiss="modal" class="btn btn-default">Cancel</a>' + '<a data-dismiss="modal" class="btn btn-primary">Insert image</a>' + '</div>' + '</div>' + '</div>' + '</div>' + '<a tabindex="-1" title="Insert image" data-wysihtml5-command="insertImage" class="btn  btn-default" href="javascript:;" unselectable="on">' + '<i class="editor-icon editor-icon-image"></i>' + '</a>' + '</li>';
            },
            link(locale) {
                return '<li>' + '<div class="bootstrap-wysihtml5-insert-link-modal modal fade">' + '<div class="modal-dialog ">' + '<div class="modal-content">' + '<div class="modal-header">' + '<a data-dismiss="modal" class="close">×</a>' + '<h3>Insert link</h3>' + '</div>' + '<div class="modal-body">' + '<input class="bootstrap-wysihtml5-insert-link-url form-control" value="http://">' + '<div class="checkbox check-success"> <input type="checkbox" class="bootstrap-wysihtml5-insert-link-target" checked="checked" value="1" id="link-checkbox"> <label for="link-checkbox">Open link in new window</label></div>' + '</div>' + '<div class="modal-footer">' + '<a data-dismiss="modal" class="btn btn-default">Cancel</a>' + '<a data-dismiss="modal" class="btn btn-primary" href="">Insert link</a>' + '</div>' + '</div>' + '</div>' + '</div>' + '<a tabindex="-1" title="Insert link" data-wysihtml5-command="createLink" class="btn  btn-default" href="javascript:;" unselectable="on">' + '<i class="editor-icon editor-icon-link"></i>' + '</a>' + '</li>';
            }
        };

        const editorOptions = {
            'font-styles': true, // Font styling, e.g. h1, h2, etc. Default true
            emphasis: true, // Italics, bold, etc. Default true
            lists: false, // (Un)ordered lists, e.g. Bullets, Numbers. Default true
            html: false, // Button which allows you to edit the generated HTML. Default false
            link: true, // Button to insert a link. Default true
            image: true, // Button to insert an image. Default true,
            color: false, // Button to change color of font
            blockquote: true, // Blockquote
            stylesheets: ['pages/css/editor.css'],
            customTemplates: editorTemplate
        };

        return {
            restrict: 'A',
            link(scope, element, attrs) {
                !$(element).data('wysihtml5') && $(element).wysihtml5(editorOptions);
            }
        };
    })
    .directive('starRating', starRating)
    /* filters */
    .filter('color', colorFilter)
    .filter('rawHtml', rawHtmlFilter)
    .filter('image', imageFilter)
    .filter('range', rangeFilter)
    .filter('proper', properFilter)
    .filter('moment', momentFilter);

export default componentsModule;

