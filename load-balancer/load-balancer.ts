import { Server } from './server';
import { LoadBalancingStrategy } from './load-balancing-strategies/load-balancing-strategy';

export class LoadBalancer {
    private static instance: LoadBalancer;
    private servers: Server[] = [];
    private loadBalancingStrategy : LoadBalancingStrategy;

    private constructor() { }

    static getInstance(): LoadBalancer {
        if (this.instance === null) {
            this.instance = new LoadBalancer();
        }
        return this.instance;
    }

    setLoadBalancingStrategy(strategy: LoadBalancingStrategy): void{
        this.loadBalancingStrategy = strategy
    }

    addServer(server: Server): void {
        this.servers.push(server);
    }

    removeServer(server: Server): void {
        this.servers = this.servers.filter((s) => s != server);
    }

    getLoadBalancingStrategy(): LoadBalancingStrategy{
        return this.loadBalancingStrategy;
    }

    forwardRequest(): Server | null {
        if (this.servers.length === 0) return null;
        const selectedServer = this.loadBalancingStrategy.selectServer(this.servers);
        if (selectedServer && selectedServer.handleRequest()) {
            return selectedServer;
        }
        return null;
    }

}