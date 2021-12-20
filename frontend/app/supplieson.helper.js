function redirectToLogin() {
    return 'app.auth.login';
}
function redirectTo404() {
    return 'app.404';
}
function redirectToStaff() {
    return 'app.supplier.account.users';
}
function createBlob(result, fileName, extension) {
    const file = new Blob([result.data], { type: result.headers('content-type') });
    const fileURL = URL.createObjectURL(file);
    // window.open(fileURL);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = fileURL;  // For chrome,firefox,opera and safari
    a.download = `${fileName}.${extension}`;
    a.click();
}
module.exports = {
    redirectToLogin,
    redirectTo404,
    redirectToStaff,
    createBlob
};
