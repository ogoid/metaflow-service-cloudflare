# Cloudflare Metaflow Service

A bare-bones implementation of [Metaflow Service](https://github.com/Netflix/metaflow-service) on top of Cloudflare Workers.

Warning: do not use for critical/heavy load.

Intended just for sporadic usage when keeping a constantly running http/database server is not reasonable. 

Behavior differs from the original implementation since we're not using a sql database. We're particularly not checking for overwrites (can't have atomicity garantee) or even for non conformant data.

Setup your worker by copying `wrangler.toml.sample` to `wrangler.toml` and allocating a new namespace with `wrangler kv:namespace create METAFLOW`.