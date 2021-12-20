export default function rawHtmlFilter($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}
rawHtmlFilter.$inject = ['$sce'];
