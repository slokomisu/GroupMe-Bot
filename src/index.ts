import app from './App'
import * as mongoose from 'mongoose'

mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true})


const port = process.env.PORT || 3000

app.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on ${port}`)
})