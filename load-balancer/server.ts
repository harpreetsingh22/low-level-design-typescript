
export class Server{
    private serverId: string;
    private isHealthy: boolean;
    private currentLoad : number
    private capacity: number;

    constructor(serverId: string, capacity: number){
        this.serverId = serverId;
        this.isHealthy = true;
        this.capacity = capacity;
        this.currentLoad = 0;
    }

    checkHealth(): boolean{
        return this.isHealthy;
    }

    setHealth(health: boolean) {
        this.isHealthy = health;
    }

    getServerId(): string{
        return this.serverId;
    }

    getCapacity(): number{
        return this.capacity;
    }

    getCurrentLoad(): number{
        return this.currentLoad;
    }

    handleRequest(): boolean {
        if (this.currentLoad < this.capacity) {
            this.currentLoad++;
            // Logic to process the request
            return true;
        } else {
            return false;
        }
    }

    // Simulate releasing load after a request is completed
    releaseRequest(): void {
        this.currentLoad--;
    }
}