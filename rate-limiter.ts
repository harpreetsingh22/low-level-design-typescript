class RateLimiter {
    private static rateLimiterInstance: RateLimiter | undefined;
    private windowSizeInMilliSeconds: number;
    private noOfRequestsAllowed: number;
    private requestInfoMap: Map<string, number[]>;

    private constructor(noOfRequestsAllowed: number, windowSizeInMilliSecond: number) {
        this.noOfRequestsAllowed = noOfRequestsAllowed;
        this.windowSizeInMilliSeconds = windowSizeInMilliSecond;
        this.requestInfoMap = new Map();
    }

    public static getInstance(noOfRequestsAllowed: number, windowSizeInMilliSecond: number): RateLimiter {
        if (!this.rateLimiterInstance) {
            this.rateLimiterInstance = new RateLimiter(noOfRequestsAllowed, windowSizeInMilliSecond);
        }
        return this.rateLimiterInstance;
    }

    public isRequestAllowed(requestId: string): boolean {
        const currentTime = Date.now();
        let requestInfo = this.requestInfoMap.get(requestId) || [];

        // Filter out timestamps outside the window size
        requestInfo = requestInfo.filter((timestamp) => currentTime - timestamp < this.windowSizeInMilliSeconds);

        // Check if the number of requests is within the allowed limit
        if (requestInfo.length >= this.noOfRequestsAllowed) {
            return false;
        }

        // Add current request timestamp and update map
        requestInfo.push(currentTime);
        this.requestInfoMap.set(requestId, requestInfo);

        return true;
    }
}

// Usage example
const rateLimiter = RateLimiter.getInstance(1, 10000);

setInterval(() => {
    const clientId = 'client_1';
    const allowed = rateLimiter.isRequestAllowed(clientId);
    console.log(`Request for ${clientId} is ${allowed ? 'allowed' : 'denied'}.`);
}, 2000);
