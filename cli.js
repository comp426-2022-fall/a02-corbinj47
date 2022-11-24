#!/usr/bin/env node

import minimist from "minimist";
import fetch from "node-fetch";
import moment from "moment-timezone";

const args = minimist(process.argv.slice(2));

function help(){
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE");
    console.log("    -h            Show this help message and exit.");
    console.log("    -n, -s        Latitude: N positive; S negative.");
    console.log("    -e, -w        Longitude: E positive; W negative.");
    console.log("    -z            Time zone: uses tz.guess() from moment-timezone by default.");
    console.log("    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.");
    console.log("    -j            Echo pretty JSON from open-meteo API and exit.");

    process.exit(0);
}

if (args.h){
    help();
}

let timezone = moment.tz.guess();
let lat = 35.9;
let longt = 75.1;
let days = 1;

if(args.n){
  lat = args.n
}
else{
  if(args.s){
    lat = -args.s
  }
  else{
    console.log("Latitude must be in range.")
    process.exit(0);
  }
}

if(args.e){
  longt = args.e
}
else{
  if(args.w){
    longt = -args.w
  }
  else{
    console.log("Longitude must be in range.")
    process.exit(0);
  }
}

if(args.z){
  timezone = args.z;
}

if (args.d){
  days = args.d;
}else if(args.d == 0){
  days = 0;
}

const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + longt + "&daily=precipitation_hours&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=" + timezone);

const data = await response.json();

if (args.j){
  console.log(data)
  process.exit(0)
}

if (days == 0) {
  console.log("today.")
} else if (days > 1) {
  console.log("in " + days + "days.")
} else {
  console.log("tomorrow.")
}

if(data.daily.precipitation_hours[days] == 0){
  console.log("No need for galoshes!")
}
else{
  console.log("Wear your galoshes!")
}
