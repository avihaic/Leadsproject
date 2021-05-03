const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const campaignRouter = require('./routers/campaigns')
const campaignInputsRouter = require('./routers/campaignsInputs')
const campaigncannel = require('./routers/campaignscannels')
const leadsRouter = require('./routers/Leads')
const app = express()
const port = 3000

app.use(express.json())
app.use(userRouter)
app.use(campaignRouter)
app.use(campaignInputsRouter)
app.use(campaigncannel)
app.use(leadsRouter)
//listen to the server
app.listen(port, () =>{
    console.log('server in up on port ' + port)
})
