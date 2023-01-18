# link-shortener

link-shortener is a simple URL shortener for Cloudflare workers!

## Installation

To start, clone this repository and after:

```sh
# Install NPM packages
$ npm install
# Fill out `wrangler.example.toml` with the necessary information then rename it
$ mv wrangler.example.toml wrangler.toml
# Add secret to worker
$ npm run secret
# Deploy worker
$ npm run deploy
```

## Usage

To `PUT` a new link

```shell
curl -X PUT http://127.0.0.1:8787 \
    -H "Authorization: SECRET" \
    -d '{"url": "URL"}'
```

`DELETE` a link

```shell
curl -X DELETE http://127.0.0.1:8787/ID \
    -H "Authorization: SECRET"
```

## Todo

- [x] Support `DELETE` to delete a link
- [ ] Route to list all links
- [ ] Add link specific TTLs
- [ ] Maybe a hit tracker 👀
