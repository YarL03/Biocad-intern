import App from "./app/app.js";
import Router from "./app/router.js";
import { parseUrl } from "./middlewares/parseUrl.js";

const db = {
    'cards': {
        0: 'free',
        1: 'free',
        2: 'free',
        3: 'free',
        4: 'free',
        length(pos = 0) {
           return this[pos] === undefined ? 0 : 1 + this.length(pos + 1)
        }  
    },
    
    'analytics': {
        liked: false
    }
}

const app = new App

const router = new Router

app.use(parseUrl('http://localhost:3000')) // заглушка

router.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'})
    app._serveStatic(res, 'public/main.html')    
})

router.get('/analytics', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'})
    app._serveStatic(res, 'public/analytics.html') 
})

router.get('/api/cards', (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(db['cards']))
})

router.post('/api/cards', (req, res) => {
    db['cards'][req.params.id] = req.body
})

router.get('/api/analytics', (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'})

    if (req.params.hasOwnProperty('liked')) {
        return res.end(JSON.stringify(db['analytics'].liked))
    }
})

router.post('/api/analytics', (req, res) => {
   if (req.params.hasOwnProperty('liked')) {
        return db['analytics'].liked = req.body
   }
})

app.addRouter(router)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))
