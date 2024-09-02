class RateLimiter {

    private static rateLimiterInstance: RateLimiter;
    private windowSizeInMilliSeconds: number;
    private noOfRequestsAllowed: number;
    private requestInfoMap: Map<string, number[]>;

    private constructor(noOfRequestsAllowed: number, windowSizeInMilliSecond: number) {
        this.noOfRequestsAllowed = noOfRequestsAllowed;
        this.windowSizeInMilliSeconds = windowSizeInMilliSecond;
        this.requestInfoMap = new Map();
    }

    public static getInstance(noOfRequestsAllowed: number, windowSizeInMilliSecond: number): RateLimiter {
        if (this.rateLimiterInstance === null) {
            this.rateLimiterInstance = new RateLimiter(noOfRequestsAllowed, windowSizeInMilliSecond);
        }

        return this.rateLimiterInstance;
    }


    public isRequestAllowed(requestId: string): boolean {
        const requestInfo = this.requestInfoMap?.get(requestId);
        const currentTime = Date.now();

        if (requestInfo) {
            const totalRequests = this.requestInfoMap.get(requestId);
            const requestsInWindow = totalRequests?.filter((timestamp) => {
                return currentTime - timestamp < this.windowSizeInMilliSeconds;
            }) || [];

            if (requestsInWindow?.length >= this.noOfRequestsAllowed) {
                return false;
            }
            else {
                this.requestInfoMap?.set(requestId, [currentTime]);
                return true;
            }

        }
        else {
            this.requestInfoMap?.set(requestId, [currentTime]);
            return true;
        }

    }
}

const rateLimiter = RateLimiter.getInstance(1,10000);

setInterval(() => {
    const clientId = 'client_1';
    const allowed = rateLimiter.isRequestAllowed(clientId);
    console.log(`Request for ${clientId} is ${allowed ? 'allowed' : 'denied'}.`);
}, 2000);