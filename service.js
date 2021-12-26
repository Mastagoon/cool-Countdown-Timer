const service = require("node-windows").Service
const path = require("path")

const svc = new service({
    name: "Cool Timer",
    description: "Man what a cool timer!",
    script: path.resolve(__dirname, "./", "server.js")
})

svc.on("install",() => {
    console.log("Installation complete(?) Starting service...")
    svc.start()
    console.log("Service started successfully.")
})

svc.install()