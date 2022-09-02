# Smart Budget

## Dependencies
- Bootstrap v.5.0.2
- NodeJS
- MongoDB
    - https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/ 
- Nodemon installed Globally

## Seeding the DB
- Run `node seeds/index.js`

## How to view the fake data in the database
`mongo` It is `mongoSH` on newer versions\
`use smart-budget`\
`db.transactions.find()`


## Running the code with live updates
`nodemon app.js`

## Running the code through debugger
* You need the JavaScript Debugger Extension
```
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/SmartBudget/seeds/index.js"
        }
    ]
}
```

### Ideas

- Organizing Categories in a simple approach allowing the user to go into a more complicated category if they'd like. They can drag each transaction into separate categories. This allows the user to not be overwhelmed at the start and if they'd like to get more complicated, they can do so.


### Architecture
- MVC architecture



### External Code Taken
- Starability - https://github.com/LunarLogic/starability 