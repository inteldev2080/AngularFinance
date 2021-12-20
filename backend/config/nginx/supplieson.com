server {
        listen 80 default_server;
        listen [::]:80 default_server;
        listen 443 ssl http2 default_server;
        listen [::]:443 ssl http2 default_server;

        root /usr/share/nginx/html;
        index index.html index.htm index.nginx-debian.html;

        server_name supplieson.com www.supplieson.com dev.supplieson.com;
        include snippets/self-signed.conf;
        include snippets/ssl-params.conf;

        location / {
                try_files $uri $uri/ /index.html =404;
        }

		location ~ ^/images/(.*) {
			alias /usr/share/nginx/api/supplieson_backend/images/$1;
		}

        location /api {
                proxy_pass http://localhost:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }

		error_page 404 /custom_404.html;
        location = /custom_404.html {
                root /usr/share/nginx/html;
                internal;
        }

        error_page 500 502 503 504 /custom_50x.html;
        location = /custom_50x.html {
                root /usr/share/nginx/html;
                internal;
        }

		location ~*  \.(jpg|jpeg|png|gif|ico|css|js)$ {
			expires 1m;
		}
}
