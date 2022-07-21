# Smart Budget

## Dependencies
- Bootstrap v.5.0.2

## Seeding the DB
- Run `node seeds/index.js`

## How to view the fake data in the database
`mongo` \
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

