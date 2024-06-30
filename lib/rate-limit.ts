import {Ratelimit} from "@upstash/ratelimit";
import {Redis} from "@upstash/redis";

export async function rateLimit(identifier: string){
    const rateLimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10,"10 s"), //10 req in 10 s window
        analytics:true,
        prefix: "@upstash/ratelimit"
    });

    return await rateLimit.limit(identifier);
}