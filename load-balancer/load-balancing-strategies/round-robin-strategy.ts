import { Server } from "../server";
import { LoadBalancingStrategy } from "./load-balancing-strategy";

export class RoundRobinStrategy implements LoadBalancingStrategy{

    private currIdx: number = 0;

    selectServer(servers: Server[]): Server {
        const server: Server = servers[this.currIdx];
        this.currIdx =(this.currIdx + 1) % servers.length;
        return server
    }
}