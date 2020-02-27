// // const http = require('http')

// // const app = http.createServer((req, res)=>{
// //     console.log("Hiii")
// //     res.write("Hello world")
// //     res.end()
// // })

// // app.listen( 9000, function(error){
// //     if(error) return console.log("Error while running server", error)
// //     return console.log("Server running")
// // })

// const express = require('express')

// const server =  express()

// var users = [
//     {
//         id: 1,
//         name: "ramya",
//         age: 37
//     },
//     {
//         id: 2,
//         name: "ajay",
//         age: 25
//     },
//     {
//         id: 23,
//         name: "lakshmi",
//         age: 18
//     }
// ]

// server.get("/getUserDetails",(req, res)=>{

//     for(var i=0;i<users.length;i++){
//         if(users[i].id === parseInt(req.query.id)){
//             res.send(users[i])
//             break
//         }
//     }
//     // var x = users.find(h=>user.id === (+req.query.id))
//     // res.send(users.find(user=>user.id === (+req.query.id)))
//     // res.send(users.find(function(user){

//     // })

//     // res.send({
//     //     id: 1,
//     //     name: req.query.name,
//     //     age: 35,
//     //     pno: "3r236253652"
//     // })
// })

// server.get("/getReportData",(req, res)=>{
//     res.send({
//         name: 'ramya',
//         age: 35,
//         pno: "3r236253652"
//     })
// })

// server.get("/getTodayReport",(req, res)=>{
//     res.send({
//         name: 'ramya',
//         age: 35,
//         pno: "3r236253652"
//     })
// })

// server.listen(9000,"0.0.0.0" ,(err)=>{
//     if(err){
//         return console.log(err)
//     }
//     return console.log("Server running")
// })

import { shareLocation, getNearestDriver, setDriverStatus, bookRide, calculateFare, requestRide } from './src/app/socket/socketHandler'
import { activeDrivers, activeUsers } from './src/app/config/constants'
var socket = { emp_id: 1, id: 122 }
async function shareLoc() {
    try {
        console.log("Entered")
        console.log("Entered")
        redis.setItemIfNotExists(`${activeDrivers}${socket.emp_id}`, { socket: socket.id, emp_id: socket.emp_id }, 30000)
        await setDriverStatus({ active: true, lat: '12.984912', lang: '77.857031' }, socket)
        const response = await getNearestDriver({ pickupPosition: { x: '12.984019', y: ' 77.852338' }, dropPosition: { x: '12.985243', y: '77.843087' } })
        console.log(response)
        console.log("exited")
    } catch (error) {
        console.log(error)
        console.log(error)
    }
}

shareLoc()

