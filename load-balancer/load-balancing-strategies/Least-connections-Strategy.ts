import { Server } from "../server";
import { LoadBalancingStrategy } from "./load-balancing-strategy";

export class LeastConnectionsStrategy implements LoadBalancingStrategy{
    selectServer(servers: Server[]): Server {
      let minConnections = Infinity;
      let server = servers[0];
    
      for(let i=0;servers.length;i++){
         if(servers[i].getCurrentLoad()<minConnections){
            minConnections = server.getCurrentLoad();
            server = servers[i];
         }
      }

      return server;
    }
}