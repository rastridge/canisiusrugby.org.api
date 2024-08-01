# Deployment of javascript server at https://api.canisiusrugby.org

## enable Proxy server on api.canisiusrugby.org

- see dreamhost instructions

```
https://panel.dreamhost.com/
```

## code the server and apply changes

- vscode api.canisiusrugby.org

- Upload js server '~/Code/canisiusrugby.org.nuxt2/canisiusrugby.org.api' to dreamhost

```
rsync -av --delete --exclude ".git" --exclude ".DS_Store" --exclude ".eslintrc.js" --exclude ".editorconfig" --exclude "/node_modules" --exclude "/public" --exclude "/imgs" ~/Code/canisiusrugby.org.nuxt2/canisiusrugby.org.api/ rastridge@vps30249.dreamhostps.com:/home/rastridge/api.canisiusrugby.org/

```

- Go to /home/rastridge/api.canisiusrugby.org

```
ssh rastridge@vps30249.dreamhostps.com
cd api.canisiusrugby.org
```

- Restart server

```
pm2 restart crc_server
```

# Supporting Services

A number of outside services are used to implement apps

## Sending Emails

ElasticEmail
setup and Usage

```
https://app.elasticemail.com/login
```

## Sending Text Messages

- Twilio - text messaging

```
https://www.twilio.com/login
```
