import Docker from 'dockerode';
import fs from 'fs';
import nodemon from 'nodemon';
import { labelRegExp, hostRegExp, domainRegExp, matchDomainCnames, mapTarget } from './lib.js';

const docker = new Docker({socketPath: "/var/run/docker.sock"});
const startEvents = ['start', 'create', 'update'];
const stopEvents = ['stop', 'remove']; 
let cnames = []; 

Promise.all([ docker.listContainers(), docker.listServices() ]) 
.then( list => {
  const targets = list.flat()
    .map(t => mapTarget(t)) 
    .filter(t => ('traefik.enable' in t.Labels))
  
  for (var target of targets) {
      Object.keys(target.Labels).forEach(label => {
        if (labelRegExp.test(label) && hostRegExp.test(target.Labels[label])) {
          hostRegExp.lastIndex = 0;
          cnames = cnames.concat(matchDomainCnames(target.Labels[label]))
        }
      })
  }

  console.log(cnames)
  fs.writeFile("cnames",cnames.join('\n'), 'utf8', err => {}) 

  nodemon({
    watch: "cnames",
    script: "cname.py",
    execMap: {
      "py": "python"
    }
  })
  nodemon.on('start', function(){
    console.log("starting cname.py")
  })
  .on('restart', function(files){
    console.log("restarting cname.py with " + files)
  })
})
.then(() => {
  docker.getEvents({filters: { event: [ ...startEvents, ...stopEvents ]}})
  .then( events => {
    events.setEncoding('utf8');
    events.on('data', ev => {
      var eventJSON = JSON.parse(ev)
      if(![ ...startEvents, ...stopEvents  ].includes(eventJSON.status)){
        return;
      }
      
      Object.keys(eventJSON.Actor.Attributes).forEach(key => {
        if (!labelRegExp.test(key)) {
          return;
        }

        let hosts = matchDomainCnames(eventJSON.Actor.Attributes[key])
        if (!hosts.length) {
          return;
        }

        if (startEvents.contains(eventJSON.status)) {
          cnames = cnames.concat(hosts)
          console.log('Adding', hosts);
        } else if (stopEvents.contains(eventJSON.status)) {
          cnames = cnames.filter(host => !hosts.includes(host));
          console.log('Removing', hosts);
        }

        fs.writeFile("cnames",cnames.join('\n'),'utf8', err =>{})
      })
    })
  })
  .catch(err => {
    console.log(err)
  })
})

