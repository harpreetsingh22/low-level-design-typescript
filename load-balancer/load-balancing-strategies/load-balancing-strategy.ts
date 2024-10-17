import { Server } from "../server";

export interface LoadBalancingStrategy {
    selectServer(servers: Server[]): Server;
}