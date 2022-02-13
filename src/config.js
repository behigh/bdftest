const config = {
    cloudApiUrl: 'https://cloud.iexapis.com/stable/',
    sandboxApiUrl: 'https://sandbox.iexapis.com/stable/',
    cloudApiToken: 'pk_a6cfda96d69e4544be7dcb0ffd16c9ab',
    sandBoxApiToken: 'Tpk_19e1f3c23ad7459eba316a212ee10b54',
    get apiUrl() {
        return this.sandbox ? this.sandboxApiUrl : this.cloudApiUrl
    },
    get apiToken() {
        return this.sandbox ? this.sandBoxApiToken : this.cloudApiToken
    },
    sandbox: true,
    loadFromDisk: false,
}

export default config
