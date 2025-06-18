## 🔗 Project Links
- [Live Demo](https://simpletodoangularapp.onrender.com/)
- [Full Documentation](https://github.com/alkisax/simpleTodoAngularApp/blob/main/README.md)
- [GitHub Repository](https://github.com/alkisax/simpleTodoAngularApp)
- [Step-by-Step Development Guide](https://github.com/alkisax/simpleTodoAngularApp/blob/main/instractionsTodoAngular.md)
- [swagger api-docs](https://simpletodoangularapp.onrender.com/api-docs/)

# create git

# back end
## basic crud for todo + mongoose in back

### .env
```
MONGODB_URI = mongodb+srv://alkisax:{***}@cluster0.8ioq6.mongodb.net/todoAngular?retryWrites=true&w=majority&appName=Cluster0
MONGODB_TEST_URI = mongodb+srv://alkisax:{***}@cluster0.8ioq6.mongodb.net/todoAngular_TEST?retryWrites=true&w=majority&appName=Cluster0

BACK_END_PORT = 3001

APP_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
```

### server.js
```js
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app'); 

const PORT = process.env.BACK_END_PORT || 3001

mongoose.set('strictQuery', false);
// συνδεση με την MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
    console.log('Routes setup complete. Starting server...');
// εδώ είναι το βασικό listen PORT μου
    app.listen(PORT, () => {
      // το εκανα σαν λινκ για να είναι clickable
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message);
  });
```

### app.js
```js
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');
// θα προστεθούν πολλα τέτοια endpoints οπως προχωρά η εφαρμογη
const todoRoutes = require('./routes/todo.routes')

// αυτό ειναι κάτι που ίσως μου χρειαστεί στο deploy και δεν το καταλαβαίνω καλα. (και παρακάτω μαζί με αυτό)
const path = require('path'); // requires explanation. added for rendering front page subpages

const app = express()
app.use(cors())
app.use(express.json());

// ενας logger για να καταγράφει το backend τις κλήσεις
app.use((req, res, next) => {
  console.log("Request reached Express!");
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// θα προστεθούν πολλα τέτοια endpoints οπως προχωρά η εφαρμογη
app.use('/api/todo', todoRoutes)

// swagger test page
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// για να σερβίρει τον φακελο dist του front μετα το npm run build
app.use(express.static('dist'))

// αυτό ειναι κάτι που ίσως μου χρειαστεί στο deploy // τελικά έβγαζε προβλήματα και χρησιμοποιήθηκε το επόμενο
// app.get('/*', (req, res, next) => {
//   if (req.path.startsWith('/api')) {
//     return next(); // let the API routes handle it
//   }
//αυτο
app.get(/^\/(?!api|api-docs).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

//   res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
// });

module.exports = app
```

### models/todo.models.js
```js
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const todoSchema = new Schema({
  username:{
    type: String
  },
  todo:{
    type: String
  }
},
{
  collection: 'todo',
  timestamps: true
})
module.exports = mongoose.model('Todo', todoSchema)
```

### daos/todo.dao.js
```js
const Todo = require('../models/todo.models');

const create = async (todoData) => {
  const todo = new Todo(todoData);
  return await todo.save();
};

const readAll = async () => {
  return await Todo.find();
};

const readById = async (todoId) => {
  return await Todo.findById(todoId)
}

const update = async (todoId, todoData) => {
  return await Todo.findByIdAndUpdate(todoId, todoData, { new: true })
}

const deleteTodoById = async (todoId) => {
  return await Todo.findByIdAndDelete(todoId)
}

module.exports = {
  create,
  readAll,
  readById,
  update,
  deleteTodoById
};
```

### controllers/todo.controller.js
```js
const Todo = require('../models/todo.models')
const todoDAO = require('../daos/todo.dao')

exports.create = async (req,res) => {
  let data = req.body

  const username = data.username
  const todo = data.todo

  try {
    const newTodo = await todoDAO.create({
      username,
      todo,
    });
    res.status(201).json(newTodo)
  } catch(error) {
    res.status(400).json({error: error.message})
  }
}

exports.findAll = async (req,res) => {
  try {
    const todos = await todoDAO.findAll();
    res.status(200).json({ status: true, data: todos });
  } catch (error) {
    res.status(500).json({ status: false, error: 'Internal server error' });
  }
}

exports.readById = async (req, res) => {
  const todoId = req.params.id
  try {
    const todo = await todoDAO.readById(todoId)
    res.status(200).json ({ status: true, data: todo})
  } catch (error)
 {
  res.status(500).json({ status: false, error: 'sever error readById'})
 }}

exports.updateById = async (req, res) => {
  const todoId = req.params.id
  const todoData = req.body
  try {
    const todo = await todoDAO.update(todoId, todoData)
    res.status(200).json ({ status: true, data: todo})
  } catch (error)
 {
  res.status(500).json({ status: false, error: 'sever error updateById'})
 }
}

exports.deleteById = async (req, res) => {
  const todoId = req.params.id
  if (!todoId){
    return res.status(400).json({
      status: false,
      error: 'Todo ID is required'
    })
  }
  
  try {
    const deleteTodo = await todoDAO.deleteTodoById(todoId) 

    if (!deleteTodo){
      return res.status(404).json({
        status: false,
        error: 'Todo not found'
      })
    } else {
      res.status(200).json({
        status: true,
        message: `Todo deleted successfully`,
      })
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    })
  }
}
```
### utils.swagger.js
```js
const m2s = require('mongoose-to-swagger');
const Todo = require('../models/todo.models')
const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      version: "1.0.0",
      title: "todo angular learning backend",
      description: "simple todo for learning angular front",
    },
    components: {
      schemas: {
        Todo: m2s(Todo)
      },
      // securitySchemes: {
      //   bearerAuth: {
      //     type: "http",
      //     scheme: "bearer",
      //     bearerFormat: "JWT"
      //   }
      // }
    },
    // security: [
    //   {
    //     bearerAuth: []
    //   }
    // ]
  },
  // 👇 This is the critical part: tell swagger-jsdoc where to find your route/controller annotations
  apis: ['./routes/*.js', './controllers/*.js'], // adjust paths if needed
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
```

### routes/todo.routes.js + swagger notes
```js
const express = require('express');
const router = express.Router()
const todoController = require('../controllers/todo.controller')

/**
 * @swagger
 * /api/todo:
 *   post:
 *     summary: Add a new todo
 *     tags: [Todo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: AName
 *               todo:
 *                 type: string
 *                 example: to do something
 *     responses:
 *       201:
 *         description: The todo was added
 *       400:
 *         description: Invalid input
 */
router.post('/', todoController.create)

/**
 * @swagger
 * /api/todo:
 *   get:
 *     summary: Get all todos
 *     tags: [Todo]
 *     responses:
 *       200:
 *         description: List of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 *       500:
 *         description: Server error
 */
router.get ('/', todoController.findAll)

/**
 * @swagger
 * /api/todo/{id}:
 *   get:
 *     summary: Get todo by id
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo id
 *     responses:
 *       200:
 *         description: The requested todo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
router.get ('/:id', todoController.readById)

/**
 * @swagger
 * /api/todo/{id}:
 *   put:
 *     summary: Update todo by id
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: AChangedName
 *               todo:
 *                 type: string
 *                 example: to do something else
 *     responses:
 *       200:
 *         description: The updated todo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       500:
 *         description: Server error
 */
router.put ('/:id', todoController.updateById)


/**
 * @swagger
 * /api/todo/{id}:
 *   delete:
 *     summary: Delete todo by id
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo id
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', todoController.deleteById)

module.exports = router
```
- tested with swagger and all ok

# Frontend with angular
## boilerplate
```bash
ng new simpleTodoAngular
```
#### στο tsconfig.json
```
    "baseUrl": "./",
```
#### bootstrap
```bash
npm install bootstrap
```
#### angular.json
 (προσοχη στα /)
```
"styles": [
  "src/styles.css",
  "node_modules/bootstrap/dist/css/bootstrap.rtl.min.css"
],
```` 

```bash
npm install --save-dev prettier
```

φτιάχνω αρχείο .pretierrc
```
{
  "overrides": [{
    "files": "*.html",
    "options": {
      "parser": "angular"
    }
  }]
}
```
## create header and menu component with area for showing sub-components

#### app.routes.ts
// εδώ εχουμε τα διαφορετικά routes το single page app. αναλόγος σε ποιο url/ βρησκομαι θα έχει μια περιοχή στην οθόνη που θα μου εμφανίζει το περιεχόμενο του αντίστοιχου component. Πχ εδώ αν πάω στο /welcome θα μου εμφανίζει το WelcomeComponent
```ts
// εδώ εχουμε τα διαφορετικά routes το single page app. αναλόγος σε ποιο url/ βρησκομαι θα έχει μια περιοχή στην οθόνη που θα μου εμφανίζει το περιεχόμενο του αντίστοιχου component. Πχ εδώ αν πάω στο /welcome θα μου εμφανίζει το WelcomeComponent

import { Routes } from '@angular/router';
import {WelcomeComponent } from './components/welcome/welcome.component'

export const routes: Routes = [
  { path:'welcome', component: WelcomeComponent },
  { path: '', redirectTo:'/welcome', pathMatch:'full' }
];
```
- δημιουργεία του μενου και δημιουργεία ενώς δοκιμαστικού welcome component
```bash
ng generate component components/list-menu
ng generate component components/welcome
```

#### list-menu-component.ts
```ts
import { Component } from '@angular/core';
// αυτά γίνανε import γιατί χρησιμοποιούνται στην html του menu.
// αυτό που κάνουν είναι να κάνουνε Link σε εσωτερικές ψευδοσελίδες
// οτι μπαίνει εδώ θα πρέπει να μπεί και παρακάτω στο imports [Α]
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-list-menu',
  // [Α] μπαίνουν και εδώ
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './list-menu.component.html',
  styleUrl: './list-menu.component.css'
})
export class ListMenuComponent {
  // αυτο το μενού θα εμπλουτιστεί σιγα σιγά με τις διαφορες επιλογές του μενού
  // τα text και linkName καλούνται στην html
  // το app-welcome απο το @component/selector του welcome component ts
  menu = [
    { text: 'Welcome', linkName: 'welcome' }
  ]
}
```

- η αντίστοιχη html του μενου
#### list-menu-component.html
```html
<p>list-menu works!</p>
<div class="list-group">
  <!-- για κάθε entry του μενου που ορίζετε στο ts του component -->
  @for (entry of menu; track entry) {
    <!-- φτιάξε ένα λινκ -->
    <!-- routerLink που να στέλνει το λινκ. -->
    <a
    class='list-group-item list-group-item-action text-truncate'
      [routerLink]="entry.linkName"
      [routerLinkActive] = "['active']"
    >{{entry.text}}</a>
  }
</div>
```

- επειδή ακόμα δεν μου εμφανίζετε τίποτα θα πρέπει το μενου να καταχωρηθεί στο κεντρικό app ts και html
#### app.components.html
```html
<!-- δηαλδή να μου εμφανίζει το μενου και να έχει χώρο για να εμφανίζει το περιεχόμενο του κάθε component. θα πρέπει να γίνουν import και στο ts -->
<app-list-menu></app-list-menu>
<router-outlet></router-outlet>
```

#### app.components.ts
```ts
import { Component } from '@angular/core';
// αυτό μου φτιάχνει έναν χώρο ως tag για να εμφανίζονται τα περιεχόμενα του κάθε υποcomponent σε κάθε ψευδοσελίδα του single page app. παίρνει τα routes του απο το αρχείο app.routes.ts
// οτι μπαίνει εδώ πρέπει να προστεθεί και στο @component- imports [A]
import { RouterOutlet } from '@angular/router';
import { ListMenuComponent } from './components/list-menu/list-menu.component'

@Component({
  selector: 'app-root',
  // [A]
  imports: [RouterOutlet, ListMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'simpleTodoAngular';
}
```

#### app.components.html
- φτιαχνω λιγο την εμφάνηση του html με Bootstrap
```html
<header class="bg-primary text-white p-3 sticky-top">
  <div class="container">
    <h1>Simple ToDo app</h1>
    <p>learning angular</p>
  </div>
</header>

#### welcome.component.html
```html
<p>welcome works!</p>
<!-- Angular serves the 'public' folder contents at the root. So the correct path excludes 'public' and starts directly with 'assets/' δηλαδή δεν βάζουμε ../../κλπ -->
<img src="assets/welcome.png" alt="Logo" style="width: 50%; height: auto;"/>
```

<div class="d-flex vh-100">
  <app-list-menu class="text-nowrap w-25   bg-light p-3 border-end"></app-list-menu>
  <span class="flex-grow-1 p-2 text-nowrap w-75">
    <router-outlet></router-outlet>  
  </span>
</div>
```

## create random number simple sub-component
- το ng add κανει install και τις ρυθμήσεις στα σετινγκσ
```bash
ng add @angular/material
```

```bash
ng generate component components/random
```
- αρχικά προσθέτουμε το νέου component στο routes/app/menu

#### app.routes.ts
```ts
import { RandomComponent } from './components/random/random.component'

  { path: 'random', component: RandomComponent},
```

#### list-menu.components.ts
```ts
  menu = [
    { text: 'Welcome', linkName: 'welcome' },
    { text: 'Random', linkName: 'random'}
  ]
```

- φτιαχνουμε την λογική του τυχαίου αρηθμού
#### random.components.ts
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-random',
  imports: [],
  templateUrl: './random.component.html',
  styleUrl: './random.component.css'
})
export class RandomComponent {
  // οι μεταβλητές που χρειάζομαι. τις αρχικοποιώ για να μην έχω ΝαΝ
  userInput: number = 0
  min: number = 0
  max: number = 100
  // αυτήν θα την καλέσω στη html με {{}} γιατί είναι το αποτέλεσμά μου
  randomNum: number = 100
  temp: number | null = null

  generateRandomNum = () => {
    // αν η max μικροτερη απο min τις κάνω swap
    if (this.max < this.min) {
      this.temp = this.max
      this.max = this.min
      this.min = this.temp
    }
    this.randomNum = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min
  }
  /*
  Σε react αυτο θα γραφόταν (με useState) 

  const handleMinChange = (e) => {
    setMin(Number(e.target.value));
  };
  
  η παράξενη συνταξη είναι γιατί η ts θέλει type asertion. 
  By default, TypeScript thinks event.target is just a generic "EventTarget" (could be any element)
  We're telling TypeScript: "No, trust me, this is specifically an HTML input element"
  */
  onMinInput(event: Event) {
    this.min = Number((<HTMLInputElement>event.target).value);
  }

  onMaxInput(event: Event) {
    this.max = Number((<HTMLInputElement>event.target).value);
  }
}
```

#### random.component.html
```html
<div class="random">
  <h1>Random number generator</h1>

<!-- τα βάζω όλα σε ένα d-flex div -->
<!-- class="form-control" είναι bootstrap -->
<!-- (input)="onMinInput($event)" οι παρενθέσεις λένε οτι είναι event binding. το $event κουβαλαέι τα data στο componenet και τα πιάνει με το  onMinInput(event: Event) {} -->
  <div class="d-flex gap-2">
    <div class="mt-2 d-flex flex-column gap-2 w-25">
      <label for="">Min num</label>
      <input 
        type="number" 
        class="form-control" 
        (input)="onMinInput($event)"
      >
      <span class="text-bg-info p-2">Current min {{ min }}</span>
    </div>
    <div class="mt-2 d-flex flex-column gap-2 w-25">
      <label for="">Max num</label>
      <input 
        type="number" 
        class="form-control"
        (input)="onMaxInput($event)"
      >
      <span class="text-bg-info p-2">Current max {{ max }}</span>
    </div>
  </div>

  <!-- Button to generate new number -->
  <p class="text-muted">Between {{ min }} and {{ max }}</p>

  <button class="generate-btn" (click)="generateRandomNum()">
    Generate New Number
  </button>

  <h3>Generated Number: <span class="text-primary">{{ randomNum }}</span></h3>

</div>

<script>
  /*
( )	- (click)="doStuff()"	- Event binding (output)
[ ]	- [value]="data"	- Property binding (input)
[( )]	- [(ngModel)]="name"	- Two-way binding (input + output)
$	- $event	- Event object (passed to handlers)
#	- #myInput	- Template reference variable
  */
</script>
```

## showcase connect with internet api sub-component
- http-client είναι το κεντρικό sub component μου
- weather είναι το sevice μου που αναλαμβάνει το `this.http.get<WeatherResponse>`
- weather είναι η tyescript κλάση μου διλώνω αν είναι string number etc
- environments είναι το env μου. Προσοχή έχει δύο αρχεία τα θέλω και τα δύο
```bash
ng generate component components/http-client
ng generate service shared/services/weather
ng genarate interface shared/interfaces/weather
ng generate environments
```

#### app.config.ts
- αυτά μονο είναι καινούργια
```
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
```
```ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()) // Enables HTTP client functionality throughout your application, the withInterceptorsFromDi() part allows you to use dependency-injected interceptors
  ]
};
```

#### weather.service.ts
σημείωση <font color="red"> @Injectable({})  </font>
```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { WeatherResponse  } from '../interfaces/weather'
import { environment } from '../../../environments/environment'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?q='

// Πού χρησιμοποιείται; - Στο component σου ως:
// weatherService = inject(WeatherService);
@Injectable({ //Το @Injectable δηλώνει ότι αυτή η κλάση μπορεί να χρησιμοποιηθεί ως service από άλλα μέρη της εφαρμογής.
  providedIn: 'root' //Λέει στην Angular: "Κάνε διαθέσιμο αυτό το service σε ολόκληρη την εφαρμογή".
})
export class WeatherService {

  // αυτή η μεταβλιτή κληρονομοί όλλες τις ιδιώτητες του service HttpClient. Με το inject γιατί έχει @Injectable εδώ λίγο παραπάνω
  http: HttpClient = inject(HttpClient)

    // μαζί με τις παραμέτρους δηλώνω και τον τύπο τους και την αρχική τους τιμή
    getWeather(city: string = 'Athens', country: string = 'Greece') {
    return this.http.get<WeatherResponse>(
      `${baseUrl}${city},${country}&units=metric&appid=${environment.weatherApiKey}`, {
        //Σημαίνει: θέλω να μου στείλεις δεδομένα σε JSON μορφή
        headers:{
          Accept: "application/json"
        }
      }
    )
  }
}
```
#### interfaces/weather.ts
- δεν μπορώ να φτιάξω το Interface ακόμα γιατί δεν ξέρω σε τι μορφή μου έρχετε απο το Api τα data. Θα το προχωρήσω ως το σημειό που κάτι θα μου επιστρέφει και θα το κάνω τοτε

- για να εμφανιστεί στο μενου τα προσθέτω στα routes/list-menu
#### app.routes.ts
```ts
import { HttpClientComponent } from './components/http-client/http-client.component'

  { path: 'weather', component: HttpClientComponent},
```

#### list-menu.component.ts
```ts
    { text: 'Weather', linkName: 'weather'},
```

- Ο client  
σημείωση <font color="red"> ngOnInit(): void{}</font>  
σημείωση <font color="red"> this.weatherService.getWeather().subscribe((data) => {console.log(data);})</font>
#### http-client.components.ts
```ts
import { Component, inject, OnInit } from '@angular/core';
import { WeatherService } from '../../shared/services/weather.service'
import { WeatherResponse  } from '../../shared/interfaces/weather'

@Component({
  selector: 'app-http-client',
  imports: [],
  templateUrl: './http-client.component.html',
  styleUrl: './http-client.component.css'
})
export class HttpClientComponent {
  // επειδη το service εχει @Injectable
  weatherService = inject(WeatherService)

  // το weatherData έρχετε απο το interface μου. προσθέθηκε λίγο αργότερα αφου έκανα log την πρώτη κλήσει για να δω τι μου επιστρέφει και τι τύπου είναι
  weatherData: WeatherResponse  | null = null;

  // τι τρέχει κάθε φορα που κάνει refresh
  // : void σημαίνει οτι δεν επιστρέφει τίποτα
  ngOnInit(): void{
    this.refreshWeather()
  }

  /*
  Ένα Observable είναι σαν Promise, αλλά:
  Για να "το ενεργοποιήσεις" → κάνεις .subscribe()
  Για Promise → κάνεις await ή .then(...)
  Σύγκριση:
  // Observable
  this.http.get(...).subscribe(data => console.log(data));
  // Promise
  const data = await axios.get(...);
  console.log(data);
  Και τα δύο περιμένουν ασύγχρονα αποτελέσματα — απλώς το Observable είναι πιο "πλούσιο" (μπορεί να στείλει πολλά events αντί για ένα μόνο).
  */
  refreshWeather(){
    this.weatherService.getWeather()
      .subscribe((data) => {
        console.log(data);
        // προστέθηκε αφου κάναμε ένα log σκέτο ωστε να μπορέσουμε να φτιάξουμε το interface
        this.weatherData = data 
      })
  }
}
```

- αφου κάνω ng serve μου κάνει Log
```
{
  "coord": {
    "lon": 23.7162,
    "lat": 37.9795
  },
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "clear sky",
      "icon": "01d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 297.76,
    "feels_like": 297.37,
    "temp_min": 296.34,
    "temp_max": 299.49,
    "pressure": 1017,
    "humidity": 40
  },
  "visibility": 10000,
  "wind": {
    "speed": 4.92,
    "deg": 157,
    "gust": 9.83
  },
  "clouds": {
    "all": 0
  },
  "dt": 1747665267,
  "sys": {
    "type": 2,
    "id": 2081401,
    "country": "GR",
    "sunrise": 1747624308,
    "sunset": 1747675902
  },
  "timezone": 10800,
  "id": 264371,
  "name": "Athens",
  "cod": 200
}
```
- πηγα στην ιστοσελίδα https://transform.tools/json-to-typescript και μου έυτιαξε το interface
```ts
export interface WeatherResponse  {
  coord: Coord
  weather: Weather[]
  base: string
  main: Main
  visibility: number
  wind: Wind
  clouds: Clouds
  dt: number
  sys: Sys
  timezone: number
  id: number
  name: string
  cod: number
}

export interface Coord {
  lon: number
  lat: number
}

export interface Weather {
  id: number
  main: string
  description: string
  icon: string
}

export interface Main {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
}

export interface Wind {
  speed: number
  deg: number
  gust: number
}

export interface Clouds {
  all: number
}

export interface Sys {
  type: number
  id: number
  country: string
  sunrise: number
  sunset: number
}
```
- τώρα που έλαβα τα ντάτα και τα διαμόρφωσα πρέπει να τα κάνω να εμφανιστουν στην σελίδα φτιαχνοντας το αντιστοιχοο τεμπλειτ
#### http-client.component.ts
```ts
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

  imports: [MatButtonModule, MatCardModule],
```

#### http-client.component.html
```html
<!-- το ! ειναι -> είμαι σίγουρος ότι αυτή η τιμή ΔΕΝ είναι null ή undefined — μην μου βγάζεις λάθος -->
@if (weatherData) {
  <mat-card>
    <mat-card-header>
      <mat-card-title>
        Weather in {{ weatherData!.name }}, {{ weatherData!.sys.country }}
      </mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <p>Temperature: {{ weatherData!.main.temp }} C</p>
      <p>Feels Like: {{ weatherData!.main.feels_like }} C</p>
      <p>Condition: {{ weatherData!.weather[0].description }}</p>
      <p>Wind Speed: {{ weatherData!.wind.speed }} m/s</p>
      <p>Cloudiness: {{ weatherData!.clouds.all }}%</p>
      <p>Visibility: {{ weatherData!.visibility }} meters</p>
    </mat-card-content>
  </mat-card>
} @else {
  <p>Loading or no data...</p>
}
```

## todo sub-component
```bash
ng generate component components/todo
ng generate interface shared/Interfaces/todo
ng generate service shared/services/todo
```

#### environment.development.ts
```ts
export const environment = {
  production: false,
  apiURL: 'http://localhost:3001'
};
```
<!-- TOC --><a name="environmentts"></a>
#### environment.ts
```ts
export const environment = {
  production: true,
  apiURL: "https://θαΠροστεθείΟτανΓινειDeploy.com"
};
```

### φτιάχνω το ιντερφεισ
#### todo.ts
```ts
export interface Todo {
  username: string,
  todo: string,
  _id: string
}
```

### φτιάχνω το service
#### todo.service.js
```ts
import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Todo } from '../interfaces/todo'
import { Router } from '@angular/router';

// σχολια στο weather.service.ts

// τα routes τα βλέπω απο τον σερβερ στο backend
const API_URL = `${environment.apiURL}/api/todo`

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  http: HttpClient = inject(HttpClient);

  createTodo (todo:Todo) {
    return this.http.post<{status: boolean, data: Todo}>(`${API_URL}`, todo)
  }

  getAllTodo () {
    return this.http.get<{status: boolean, data: Todo[]}>(`${API_URL}`)
  }

  getByIdTodo (_id: string) {
    return this.http.get<{status: boolean, data: Todo}>(`${API_URL}/${_id}`)
  }

  putByIdTodo (_id: string, todo:Todo) {
    return this.http.put<{status: boolean, data: Todo}>(`${API_URL}/${_id}`, todo)
  }

  deleteByIdTodo (_id: string) {
    return this.http.delete<{status: boolean, data: Todo}>(`${API_URL}/${_id}`)
  }
  
}

/*
const express = require('express');
const router = express.Router()
const todoController = require('../controllers/todo.controller')

router.post('/', todoController.create)
router.get ('/', todoController.findAll)
router.get ('/:id', todoController.readById)
router.put ('/:id', todoController.updateById)
router.delete('/:id', todoController.deleteById)

module.exports = router
*/
```

### τώρα πρέπει να τα βάλω μέσα στην υπόλοιπη σελίδα για να τα βλέπω
#### app.routes.ts
```ts
import { TodoComponent } from './components/todo/todo.component';

  { path: 'todo', component: TodoComponent},
```

#### listmenu.ts
```ts
{ text: 'TODO', linkName: 'todo'}
```

### Πάω τώρα να φτιάξω το html του todo
- πρώτα στο todo.component.ts για την εμφάνιση
#### todo.component.ts
```ts
import { Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { 
  AbstractControl, // Base class for all form controls – useful when working generically with any form control
  FormControl,     // Represents a single form input (like an input box)
  FormGroup,       // Represents a group of form controls (like a whole form)
  ReactiveFormsModule, // Required module for using reactive forms in Angular
  Validators       // Built-in validation functions (like required, minLength, email, etc.)
} from '@angular/forms';
import { TodoService } from 'src/app/shared/services/todo.service';
import { Todo } from '../../shared/interfaces/todo'


@Component({
  selector: 'app-todo',
  imports: [
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent {
  todoService = inject(TodoService)

  todoData: Todo | null = null

  ngOnInit(): void {
    this.refreshTodo()
  }

  refreshTodo () {
    this.todoService.getAllTodo()
      .subscribe((data) => {
        console.log(data);
        // το data.data και όχι data είναι γιατι στο service είναι:
        // getAllTodo () {return this.http.get<{status: boolean, data: Todo}>(`${API_URL}`)}
        // δηλ τo data έχει μέσα του {status, data}
        this.todoData = data.data       
      })
  }

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    todo: new FormGroup('', Validators.required)
  })
}
```

- κανω μια δοκιμή με html
```html
<p>todo works!</p>
<h3>Loaded Todo Data:</h3>
@if (todoData) {
  <pre>{{ todoData }}</pre>
}
```
- και βλεπω οτι μου επιστρέφει πράγματα. οπότε τώρα πάω να ολοκληρώσω το υπολοιππ crud του frontend

### προσθήκες στο ts για εφαρμογή του get by id
#### todo.component.ts
```ts
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common'; // για να μπορέσω να χρησιμοποιήσω το *ngIf γιατι στην φορμα δεν μπορω @if

  imports: [
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule,
    MatCardModule,
    CommonModule
  ],

    // get by id
  todoById: Todo | null = null;

  idForm = new FormGroup({
    _id: new FormControl('', Validators.required)
  })

  onSubmitViewById() {
    const _id = this.idForm.value._id;
    if (!_id) return; // Με υποχρέωσε η ts να το προσθέσω

    this.todoService.getByIdTodo(_id)
      .subscribe((data) => {
        this.todoById = data.data
      });
  }
```

#### todo.component.html
```html
<!-- για την εφαρμογή του view by id -->
<form [formGroup]="idForm" (ngSubmit)="onSubmitViewById()" class="d-flex flex-column">
  <mat-form-field>
    <mat-label>display by id</mat-label>
    <input type="text" matInput formControlName="_id"/>
  </mat-form-field>
  <button
    mat-flat-button
    color="primary"
    class="mt-2"
    type="submit"
  >see by id</button>
</form>


<!-- θέλει Import MatCardModule -->
<mat-card *ngIf="todoById">
  <mat-card-header>
    <mat-card-title>
      Πληροφορίες για το todo με id: {{todoById!._id}}
    </mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <p>username: {{ todoById!.username }}</p>
    <p>todo: {{todoById!.todo}}</p>
  </mat-card-content>
</mat-card>
```

### προσθήκες στο ts για εφαρμογή για delete by id
#### todo.component.ts
```ts
  //delete by id
  deleteById: Todo | null = null
   onSubmintDeleteById() {
    const _id = this.idForm.value._id
    if (!_id) return

    const confirmed = window.confirm('Are you sure you want to delete this todo?');
    if (!confirmed) {
      return; 
    }

    this.todoService.deleteByIdTodo(_id)
      .subscribe((data) => {
        console.log("deleted", data)        
      })
    this.refreshTodo()
   }
```
#### todo.comonent.html
```html
<form
  [formGroup]="idForm"
  (ngSubmit)="onSubmitViewById()"
  class="d-flex flex-column"
>
<!-- ...[etc]... -->
  <!-- έχουμε ήδη ενα type submit btn για αυτό (click) -->
  <button
    mat-flat-button
    color="warn"
    class="mt-2"
    type="button"
    (click)="onSubmintDeleteById()"
  >delete by id</button>
</form>
```

### προσθήκες στο ts για εφαρμογή για create todo
#### todo.component.ts
```ts
   // create todo

  createForm = new FormGroup({
    username: new FormControl('', Validators.required),
    todo: new FormControl('', Validators.required)
  })

  onSubmitCreateTodo() {
    if (this.createForm.invalid) {
      return; 
    }

    const newTodo: Todo = {
      username: this.createForm.value.username!,
      todo: this.createForm.value.todo!,
      _id: ''  // _id will be assigned by backend, so empty here
    };

    this.todoService.createTodo(newTodo)
      .subscribe((response) => {
          console.log('Created todo:', response.data);
          window.alert('Todo created successfully!');
          this.createForm.reset(); // Clear the form after create
          this.refreshTodo();
        }
      );
  }
```
#### todo.component.html
```html
<h3>Create new todo</h3>
<form
  [formGroup]="createForm"
  (ngSubmit)="onSubmitCreateTodo()"
  class="d-flex flex-column mb-5"
>
  <mat-form-field>
    <mat-label>username</mat-label>
    <input 
      type="text"
      matInput
      formControlName="username"
    />
  </mat-form-field>

  <mat-form-field>
    <mat-label>To Do</mat-label>
    <input 
      type="text"
      matInput
      formControlName="todo"
    />
  </mat-form-field>

  <button
    mat-flat-button
    color="primary"
    class="mt-2"
    type="submit"
    [disabled]="createForm.invalid"
  >submit</button>
</form>
```

### προσθήκες για εφαρμογή του put
- Συναντησα το εξής προβλημα, έφτιαχνα ένα νεο todo για να σταλθεί για την αλλαγή. Αν στην αλλαγή οριζόntαn _id τοτε χτύπαγε το backend που περίμενε μόνο δυο πεδία. αλλα αν το εβγαζα χτύπαγε η ts γιατι δεν ακολουθούσα το interface. για να διορθωθεί αυτο έγινε η εξής αλλαγή στο interface με την προσθήκη _id? όπου το '?' σημαίνει μη υποχρεωτικό πεδίο
#### interface/todo.ts
```ts
export interface Todo {
  username: string,
  todo: string,
  _id?: string
}
```

#### todo.component.ts
```ts
  // change todo
  // το changeForm εμφανίζετε αν πατηθεί το κομπι change μέσα στο υπομενου που εμφανίζετε αν δώσεις αναζήτηση μέσο id. 

  changeTodoById: Todo | null = null // αρχικόποιώ μια μεταβλητή για να αποθηκέυσει το παλιό todo θα χρειαστεί για να κάνω prefill την φορμα αλλαγής
  isToChange: boolean = false // θα χρησιμοποιηθεί για να κάνει toggle το changeForm

  // εχω δύο κουμπια. το ένα για να επηλέξω οτι θέλω να αλλαξω το todo δινοντας id. και το άλλο για να κάνω submit την αλλαγή μου
  toggleIsToChange = () => {
    this.isToChange = !this.isToChange
    this.onSubmitViewById() // το viewById όχι μονο χρειάζετε για να είναι σιγουρο οτι βλέπω το todo που αλλάζω αλλα μου δημιουργεί και το todoById

    if (this.isToChange) {
      const _id = this.idForm.value._id;
      if (!_id) return; 

      this.todoService.getByIdTodo(_id)
        .subscribe((data) => {
          this.changeTodoById = data.data
          
          // Prefill form
            console.log('Received for patching:', this.changeTodoById);
          // patchValue updates the form controls with the given values without affecting other controls.
          // It allows partial updates to the form — you don't have to provide values for all controls,
          // only the ones you want to change. Here, we're pre-filling the 'username' and 'todo' inputs
          // in the form with the data fetched from the backend so the user can edit them easily.
          this.changeForm.patchValue({
            username: this.changeTodoById.username,
            todo: this.changeTodoById.todo
          });
        });
    }
  }

  changeForm = new FormGroup({
    username: new FormControl('', Validators.required),
    todo: new FormControl('', Validators.required)
  })

  onSubmitChangeTodo() {
    const _id = this.idForm.value._id // το id απο το idForm
    if (!_id) return

    if (this.changeForm.invalid) { // το changeForm έιναι άλλο απο το idForm 
      return; 
    }

    const newTodo: Todo = {
      username: this.changeForm.value.username!,
      todo: this.changeForm.value.todo!,
      // _id: ''  // _id will be assigned by backend, so empty here
    };

    const confirmed = window.confirm('Are you sure you want to change this todo?');
    if (!confirmed) {
      return; 
    }

    this.todoService.putByIdTodo(_id, newTodo)
      .subscribe((response) => {
          console.log('Created todo:', response.data);
          window.alert('Todo changed successfully!');
          this.changeForm.reset(); // Clear the form after create
          this.isToChange = false // για να μου κρήψει το υπομενου
          this.refreshTodo();
        }
      );
  }
```

#### todo.component.html
```html
<!-- για την εφαρμογή του view by id -->
<h3>Alter todo by id</h3>
<form
  [formGroup]="idForm"
  (ngSubmit)="onSubmitViewById()"
  class="d-flex flex-column"
>
  <mat-form-field>
    <mat-label>display by id</mat-label>
    <input type="text" matInput formControlName="_id"/>
  </mat-form-field>
  <button
    mat-flat-button
    color="primary"
    class="mt-2"
    type="submit"
  >see by id</button>

  <!-- έχουμε ήδη ενα type submit btn για αυτό (click) -->
  <button
    mat-flat-button
    color="warn"
    class="mt-2"
    type="button"
    (click)="onSubmintDeleteById()"
  >delete by id</button>

  <button
    mat-flat-button
    color="accent"
    class="mt-2"
    type="button"
    (click)="toggleIsToChange()"
  >change by id</button>
</form>


<!-- θέλει Import MatCardModule -->
<mat-card *ngIf="todoById">
  <mat-card-header>
    <mat-card-title>
      Πληροφορίες για το todo με id: {{todoById!._id}}
    </mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <p>username: {{ todoById!.username }}</p>
    <p>todo: {{todoById!.todo}}</p>
  </mat-card-content>
</mat-card>

<mat-card *ngIf="isToChange">
  <mat-card-header>
    change To Do
  </mat-card-header>
  <form
    [formGroup]="changeForm"
    (ngSubmit)="onSubmitChangeTodo()"
    class="d-flex flex-column mb-5"
  >
    <mat-form-field>
      <mat-label>username</mat-label>
      <input 
        type="text"
        matInput
        formControlName="username"
      />
    </mat-form-field>

    <mat-form-field>
      <mat-label>To Do</mat-label>
      <input 
        type="text"
        matInput
        formControlName="todo"
      />
    </mat-form-field>

    <button
      mat-flat-button
      color="primary"
      class="mt-2"
      type="submit"
      [disabled]="changeForm.invalid"
    >submit</button>
  </form>
</mat-card>
```

### τελικές αλλαγές στο view all που δεν κάνει καλό display στο html

#### todo.component.ts
```ts
  todoData: Todo[] | null = null //προστεθηκε το [] γιατί ήταν λάθος. περιμενα επιστροφή απο arr και οχι ένα μονο. η αλλαγή έγινε και στο σερβις
```
#### todo.component.html
```html
<h3>Loaded Todo Data:</h3>
@if (todoData?.length) {
  <ul>
    @for (todo of todoData; track todo._id) {
      <li>
        <strong>{{ todo.username }}</strong> <br />
        {{ todo.todo }} <hr />
        <small>id: {{ todo._id }}</small><br/>
        <hr />
      </li>
    }
  </ul>
} @else {
  <p>No todos found.</p>
}
```

### ο συνολικός κοδικας για την σύνδεση με το backend todo
#### todo.ts
```ts
export interface Todo {
  username: string,
  todo: string,
  _id?: string
}
```
#### todo.service.ts
```ts
import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Todo } from '../interfaces/todo'
import { Router } from '@angular/router';

// σχολια στο weather.service.ts

// τα routes τα βλέπω απο τον σερβερ στο backend
const API_URL = `${environment.apiURL}/api/todo`

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  http: HttpClient = inject(HttpClient);

  createTodo (todo:Todo) {
    return this.http.post<{status: boolean, data: Todo}>(`${API_URL}`, todo)
  }

  getAllTodo () {
    return this.http.get<{status: boolean, data: Todo[]}>(`${API_URL}`)
  }

  getByIdTodo (_id: string) {
    return this.http.get<{status: boolean, data: Todo}>(`${API_URL}/${_id}`)
  }

  putByIdTodo (_id: string, todo:Todo) {
    return this.http.put<{status: boolean, data: Todo}>(`${API_URL}/${_id}`, todo)  
  }

  deleteByIdTodo (_id: string) {
    return this.http.delete<{status: boolean, data: Todo}>(`${API_URL}/${_id}`)
  }
  
}

/*
const express = require('express');
const router = express.Router()
const todoController = require('../controllers/todo.controller')

router.post('/', todoController.create)
router.get ('/', todoController.findAll)
router.get ('/:id', todoController.readById)
router.put ('/:id', todoController.updateById)
router.delete('/:id', todoController.deleteById)

module.exports = router
*/
```

#### todo.component.ts
```ts
import { Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { 
  AbstractControl, // Base class for all form controls – useful when working generically with any form control
  FormControl,     // Represents a single form input (like an input box)
  FormGroup,       // Represents a group of form controls (like a whole form)
  ReactiveFormsModule, // Required module for using reactive forms in Angular
  Validators       // Built-in validation functions (like required, minLength, email, etc.)
} from '@angular/forms';
import { TodoService } from 'src/app/shared/services/todo.service';
import { Todo } from '../../shared/interfaces/todo'
import { CommonModule } from '@angular/common'; // για να μπορέσω να χρησιμοποιήσω το *ngIf γιατι στην φορμα δεν μπορω @if


@Component({
  selector: 'app-todo',
  imports: [
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent {
  todoService = inject(TodoService)

  // get all
  todoData: Todo[] | null = null

  ngOnInit(): void {
    this.refreshTodo()
  }

  refreshTodo () {
    this.todoService.getAllTodo()
      .subscribe((data) => {
        console.log(data);
        // το data.data και όχι data είναι γιατι στο service είναι:
        // getAllTodo () {return this.http.get<{status: boolean, data: Todo}>(`${API_URL}`)}
        // δηλ τo data έχει μέσα του {status, data}
        this.todoData = data.data       
      })
  }

  // get by id
  todoById: Todo | null = null; // αυτο θα χρησιμοποιηθεί και στο delete / put
  idForm = new FormGroup({
    _id: new FormControl('', Validators.required)
  })

  onSubmitViewById() {
    const _id = this.idForm.value._id;
    if (!_id) return; // Με υποχρέωσε η ts να το προσθέσω

    this.todoService.getByIdTodo(_id)
      .subscribe((data) => {
        this.todoById = data.data
      });
    this.refreshTodo()
  }

  //delete by id
  deleteById: Todo | null = null
   onSubmintDeleteById() {
    const _id = this.idForm.value._id
    if (!_id) return

    const confirmed = window.confirm('Are you sure you want to delete this todo?');
    if (!confirmed) {
      return; 
    }

    this.todoService.deleteByIdTodo(_id)
      .subscribe((data) => {
        console.log("deleted", data)        
      })
    this.refreshTodo()
   }


  // create todo

  createForm = new FormGroup({
    username: new FormControl('', Validators.required),
    todo: new FormControl('', Validators.required)
  })

  onSubmitCreateTodo() {
    if (this.createForm.invalid) {
      return; 
    }

    const newTodo: Todo = {
      username: this.createForm.value.username!,
      todo: this.createForm.value.todo!,
      _id: ''  // _id will be assigned by backend, so empty here
    };

    this.todoService.createTodo(newTodo)
      .subscribe((response) => {
          console.log('Created todo:', response.data);
          window.alert('Todo created successfully!');
          this.createForm.reset(); // Clear the form after create
          this.refreshTodo();
        }
      );
  }

  // change todo
  // το changeForm εμφανίζετε αν πατηθεί το κομπι change μέσα στο υπομενου που εμφανίζετε αν δώσεις αναζήτηση μέσο id. 

  changeTodoById: Todo | null = null // αρχικόποιώ μια μεταβλητή για να αποθηκέυσει το παλιό todo θα χρειαστεί για να κάνω prefill την φορμα αλλαγής
  isToChange: boolean = false // θα χρησιμοποιηθεί για να κάνει toggle το changeForm

  // εχω δύο κουμπια. το ένα για να επηλέξω οτι θέλω να αλλαξω το todo δινοντας id. και το άλλο για να κάνω submit την αλλαγή μου
  toggleIsToChange = () => {
    this.isToChange = !this.isToChange
    this.onSubmitViewById() // το viewById όχι μονο χρειάζετε για να είναι σιγουρο οτι βλέπω το todo που αλλάζω αλλα μου δημιουργεί και το todoById

    if (this.isToChange) {
      const _id = this.idForm.value._id;
      if (!_id) return; 

      this.todoService.getByIdTodo(_id)
        .subscribe((data) => {
          this.changeTodoById = data.data
          
          // Prefill form
            console.log('Received for patching:', this.changeTodoById);
          // patchValue updates the form controls with the given values without affecting other controls.
          // It allows partial updates to the form — you don't have to provide values for all controls,
          // only the ones you want to change. Here, we're pre-filling the 'username' and 'todo' inputs
          // in the form with the data fetched from the backend so the user can edit them easily.
          this.changeForm.patchValue({
            username: this.changeTodoById.username,
            todo: this.changeTodoById.todo
          });
        });
    }
  }

  changeForm = new FormGroup({
    username: new FormControl('', Validators.required),
    todo: new FormControl('', Validators.required)
  })

  onSubmitChangeTodo() {
    const _id = this.idForm.value._id // το id απο το idForm
    if (!_id) return

    if (this.changeForm.invalid) { // το changeForm έιναι άλλο απο το idForm 
      return; 
    }

    const newTodo: Todo = {
      username: this.changeForm.value.username!,
      todo: this.changeForm.value.todo!,
      // _id: ''  // _id will be assigned by backend, so empty here
    };

    const confirmed = window.confirm('Are you sure you want to change this todo?');
    if (!confirmed) {
      return; 
    }

    this.todoService.putByIdTodo(_id, newTodo)
      .subscribe((response) => {
          console.log('Created todo:', response.data);
          window.alert('Todo changed successfully!');
          this.changeForm.reset(); // Clear the form after create
          this.isToChange = false // για να μου κρήψει το υπομενου
          this.refreshTodo();
        }
      );
  }

}
```
#### todo.component.html
```html
<p>todo works!</p>
<h3>Loaded Todo Data:</h3>
@if (todoData?.length) {
  <ul>
    @for (todo of todoData; track todo._id) {
      <li>
        <strong>{{ todo.username }}</strong> <br />
        {{ todo.todo }} <hr />
        <small>id: {{ todo._id }}</small><br/>
        <hr />
      </li>
    }
  </ul>
} @else {
  <p>No todos found.</p>
}

<h3>Create new todo</h3>
<form
  [formGroup]="createForm"
  (ngSubmit)="onSubmitCreateTodo()"
  class="d-flex flex-column mb-5"
>
  <mat-form-field>
    <mat-label>username</mat-label>
    <input 
      type="text"
      matInput
      formControlName="username"
    />
  </mat-form-field>

  <mat-form-field>
    <mat-label>To Do</mat-label>
    <input 
      type="text"
      matInput
      formControlName="todo"
    />
  </mat-form-field>

  <button
    mat-flat-button
    color="primary"
    class="mt-2"
    type="submit"
    [disabled]="createForm.invalid"
  >submit</button>
</form>

<!-- για την εφαρμογή του view by id -->
<h3>Alter todo by id</h3>
<form
  [formGroup]="idForm"
  (ngSubmit)="onSubmitViewById()"
  class="d-flex flex-column"
>
  <mat-form-field>
    <mat-label>display by id</mat-label>
    <input type="text" matInput formControlName="_id"/>
  </mat-form-field>
  <button
    mat-flat-button
    color="primary"
    class="mt-2"
    type="submit"
  >see by id</button>

  <!-- έχουμε ήδη ενα type submit btn για αυτό (click) -->
  <button
    mat-flat-button
    color="warn"
    class="mt-2"
    type="button"
    (click)="onSubmintDeleteById()"
  >delete by id</button>

  <button
    mat-flat-button
    color="accent"
    class="mt-2"
    type="button"
    (click)="toggleIsToChange()"
  >change by id</button>
</form>


<!-- θέλει Import MatCardModule -->
<mat-card *ngIf="todoById">
  <mat-card-header>
    <mat-card-title>
      Πληροφορίες για το todo με id: {{todoById!._id}}
    </mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <p>username: {{ todoById!.username }}</p>
    <p>todo: {{todoById!.todo}}</p>
  </mat-card-content>
</mat-card>

<mat-card *ngIf="isToChange">
  <mat-card-header>
    change To Do
  </mat-card-header>
  <form
    [formGroup]="changeForm"
    (ngSubmit)="onSubmitChangeTodo()"
    class="d-flex flex-column mb-5"
  >
    <mat-form-field>
      <mat-label>username</mat-label>
      <input 
        type="text"
        matInput
        formControlName="username"
      />
    </mat-form-field>

    <mat-form-field>
      <mat-label>To Do</mat-label>
      <input 
        type="text"
        matInput
        formControlName="todo"
      />
    </mat-form-field>

    <button
      mat-flat-button
      color="primary"
      class="mt-2"
      type="submit"
      [disabled]="changeForm.invalid"
    >submit</button>
  </form>
</mat-card>
```

# deploy
## local αλλαγες και δοκιμες πριν το deploy
### φτιάχνω νεο branch για το deploy στο github (για λογους ασφαλειας)
```bash
git checkout -b deploy
git push origin deploy
```
### script για αυτόματη αλλαγή του dist φακέλου στο backend
#### package.json (front)
```json
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "build:to-backend": "rm -rf ../../backend/dist && ng build --output-path=../../backend/dist --configuration production" //πρεπει να προσαρμοστεί ανα περίπτωση
  },
```
```bash
npm run build:to-backend
```
- (μου ζήτησε να εγκαταστήσω αυτή την βιβλιοθήκε `npm install @angular/animations`)  
- επειδή το build της angular δεν γινόταν κατευθείαν στον dist φάκελο του backend αλλά μεσα σε ένα υποφάκελο browser πρέπει να κάνω μικρές αλλαγές στις αντοίστηχες γραμμες του app.js (back)
#### app.js
```js
// για να σερβίρει τον φακελο dist του front μετα το npm run build:to-backend
// app.use(express.static('dist'))
app.use(express.static(path.join(__dirname, 'dist', 'browser')));

//...

app.get(/^\/(?!api|api-docs).*/, (req, res) => {
  // res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  res.sendFile(path.resolve(__dirname, 'dist', 'browser', 'index.html'));
});
```
- πριν ξεκινήσω το deploy κάνω μια δοκιμή αν ο dist φακελος που βρισκετε στο backend λειτουργει κανονικά. Για να τρέξει θα πρέπει να αλλαξω το enviroment.ts (front) (οχι το production, το κανονικό) απο
```ts
export const environment = {
  production: true,
  weatherApiKey: '3e8e3b95ae3ba2e1e20dbd3f7beaa176',
  apiURL: "https://θαΠροστεθείΟτανΓινειDeploy.com"
};
```
σε
```ts
export const environment = {
  production: true,
  weatherApiKey: '3e8e3b95ae3ba2e1e20dbd3f7beaa176',
  apiURL: "http://localhost:3001"
};
```
- Μετά το deploy αυτό θα πρέπει να αλαχθει ξανα
- το gpt μου είπε πως οι env μεταβλητές του front είναι hardcoded μεσα στον dist folder και δεν είναι αναγκη να μπουνε στο render. μονο το .env του backend

## render
- https://dashboard.render.com/login
- production '+' -> '+ create new service'
- mew web service
- git provider -> git credentials v -> configure in github -> Only select repositories -> βρίσκω το repo μου -> save
- επιλέγω το repo που πρόσθεσα
- branch -> deploy
- Root Directory -> backend
- Start Command -> npm start
- free
- Environment Variables -> add from .env -> copy paste
- deploy

#### αλλάζω ξανα το environment.ts
```ts
export const environment = {
  production: true,
  weatherApiKey: '3e8e3b95ae3ba2e1e20dbd3f7beaa176',
  apiURL: "https://simpletodoangularapp.onrender.com"
};
```
- και κάνω npm run build:to-backend (απο τον φάκελο του front) και git add . / git commit -m "deploy" / git push origin deploy απο τον συνολικό φάκελο

# ολα λειτουργούν 🎉