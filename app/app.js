import EventEmitter from 'events'
import http from 'http'
import fs from 'fs'
import path from 'path'

class App {
    constructor() {
        this.emitter = new EventEmitter()
        this.server = this._createServer()
        this.middlewares = []
        this.cache = {}
    }

    use(middleware) {
        this.middlewares.push(middleware)
    }

    listen(port, callback) {
        this.server.listen(port, callback)
    }

    addRouter(router) {
        Object.keys(router.endpoints).forEach(path => {
            const endpoint = router.endpoints[path]

            Object.keys(endpoint).forEach(method => {
                const handler = endpoint[method]

                this.emitter.on(this._getRouterMask(path, method), (req, res) => {
                    handler(req, res)
                })
            })
        })
    }

    _createServer() {
        return http.createServer((req, res) => {
            let body = ''

            req.on('data', (chunk) => {
                body += chunk
            })

            req.on('end', () => {
                if (body) {
                    req.body = JSON.parse(body)
                }

                this.middlewares.forEach(middleware => middleware(req, res)) 

                const emitted = this.emitter.emit(this._getRouterMask(req.pathname, req.method), req, res)

                if (!emitted) {
                    req.pathname.endsWith('.css') || req.pathname.endsWith('.jpg') || req.pathname.endsWith('.png') || req.pathname.endsWith('.svg') || req.pathname.endsWith('.js') ? 
                    this._serveStatic(res, `public/${this._resolvePath(req.pathname)}`)
                    : this._serveStatic(res, 'public/error.html')
                }
            })
            
               
        })
    }
    
    _serveStatic(res, absPath) {
        if (this.cache[absPath]) {
            res.end(this.cache[absPath])
        }
    
        else  {
            fs.exists(absPath, (exists) => {
                if (exists) {
                    fs.readFile(absPath, (err, data) => {
                            this.cache[absPath] = data
    
                            res.end(data)
                    })
                }
            })
        }
    }

    _getRouterMask(path, method) {
        return `[${path}]:[${method}]`
    }

    _resolvePath(url) {
        const parsed = path.parse(url)
        
        return /\.((svg)?(png)?(jpg)?){1}$/.test(parsed.base) ? `img/${parsed.base}`
        : /\.((css)?){1}$/.test(parsed.base) ? 'style.css'
        : parsed.base
    }
}

export default App