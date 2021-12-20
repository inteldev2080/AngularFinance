self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then(cache => cache.addAll([
            'index.html',
            'app/auth/auth.translate.ar.json',
            'app/auth/auth.translate.en.json',
            'app/admin/admin.translate.ar.json',
            'app/admin/admin.translate.en.json',
            'app/customer/customer.translate.ar.json',
            'app/customer/customer.translate.en.json',
            'app/supplier/supplier.translate.ar.json',
            'app/supplier/supplier.translate.en.json',
            'assets/img/bg/bg_1.jpg',
            'assets/img/bg/bg_2.jpg',
            'assets/img/bg/bg_3.jpg',
            'assets/img/bg/bg_4.jpg',
            'assets/img/bg/bg_5.jpg',
            'assets/img/bg/bg_6.jpg',
            'assets/img/bg/bg_7.jpg',
            'assets/img/bg/bg_8.jpg',
            'assets/img/bg/bg_9.jpg',
            'assets/img/bg/bg_10.jpg',
            'assets/plugins/angular-ui-select/select.min.js',
            'assets/plugins/bootstrap-form-wizard/js/jquery.bootstrap.wizard.min.js',
            'assets/plugins/select2/js/select2.full.min.js',
            'assets/plugins/classie/classie.js',
            'assets/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
            'node_modules/raven-js/dist/raven.js',
            'node_modules/showcaser/docs/showcaser.min.js'
        ]))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request).then((response) => {
        // caches.match() always resolves
        // but in case of success response will have value
        if (response !== undefined) {
            return response;
        }
        return fetch(event.request).then((response) => {
                // response may be used only once
                // we need to save clone to put one copy in cache
                // and serve second one
            const responseClone = response.clone();

            caches.open('v1').then((cache) => {
                cache.put(event.request, responseClone);
            });
            return response;
        }).catch(() => caches.match('/sw-test/gallery/myLittleVader.jpg'));
    }));
});
