import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function main() { 
    const user = await prisma.user.create({
        data:{
            name: "John Doe",
            email: "johnDoe@gmail.com",
            avatarUrl: "http://github.com/dgioielli.png"
        }
    })

    const pool = await prisma.pool.create({
        data : {
            title : "Example Pool",
            code : "BOL123",
            ownerId : user.id,

            participants : {
                create : {
                    userId : user.id,
                }
            }
        }
    })

    await prisma.game.create({
        data : {
            date : "2022-11-20T18:00:00.201Z",
            firstTeamCountryCode : "DE",
            secondTeamCountryCode : "BR",
        }
    })

    await prisma.game.create({
        data : {
            date : "2022-11-21T18:00:00.201Z",
            firstTeamCountryCode : "AR",
            secondTeamCountryCode : "BR",

            guesses : {
                create : {
                    firstTeamPoints : 1,
                    secondTeamPoints : 2,

                    participant : {
                        connect : {
                            userId_poolId : {
                                userId : user.id,
                                poolId : pool.id,
                            }
                        }
                    }
                }
            }
        }
    })
}

main();