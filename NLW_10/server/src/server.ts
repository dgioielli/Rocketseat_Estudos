import fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient({
    log: ["query"],
});

async function bootstrap() {
    const fstf = fastify({
        logger: true,
    })

    await fstf.register(cors, {
        origin : true,
    });

    fstf.get("/pools/count", async () => {
        const result = await prisma.pool.count();
        return { count : result }
    });

    fstf.listen({
        port: 3333, 
        host: "0.0.0.0",
    })
}

bootstrap();