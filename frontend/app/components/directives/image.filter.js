export default function imageFilter() {
    return function (val) {
        if (val) {
            return val;
        }
        return 'assets/img/gallery/default_user.png';
    };
}
