class Router {
    constructor() {
        this.endpoints = {}
    }

    /* endpoint = {
        'path': {
            'method': handler
        }
    }
    */ 
    request(method = 'GET', path, handler) {
        if (!this.endpoints[path])
            this.endpoints[path] = {}


        const endpoint = this.endpoints[path]

        if (endpoint[method])
            throw new Error(`[${method}][${path}] already exists`)

        endpoint[method] = handler
        //mask [path]:[method]
       
    }

    get(path, handler) {
        this.request('GET', path, handler)
    }

    post(path, handler) {
        this.request('POST', path, handler)
    }
}

export default Router