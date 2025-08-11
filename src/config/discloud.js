const discloud = {
    token: process.env['DISCLOUD_API_TOKEN'],
    app_id: process.env['DISCLOUD_APP_ID'],
}

Object.freeze(discloud)

module.exports = { discloud }
