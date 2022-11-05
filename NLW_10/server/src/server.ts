import fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import ShortUniqueId  from "short-unique-id";



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
        return { count : result };
    });

    fstf.get("/users/count", async () => {
        const result = await prisma.user.count();
        return { count : result };
    });

    fstf.get("/guesses/count", async () => {
        const result = await prisma.guess.count();
        return { count : result };
    });

    fstf.post("/pools", async (request, reply) => {
        const createPoolBody = z.object({
            title : z.string(),
        });
        console.log(request.body);
        const { title } = createPoolBody.parse(request.body);
        const generateCodeId = new ShortUniqueId({ length : 6 });
        const code = String(generateCodeId()).toUpperCase();

        await prisma.pool.create({
            data : {
                title,
                code,
            }
        })

        return reply.status(201).send({ code });
    });

    fstf.listen({
        port: 3333, 
        host: "0.0.0.0",
    })
}

bootstrap();