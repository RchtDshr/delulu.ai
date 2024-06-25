const { PrismaClient } = require("@prisma/client")

const db = new PrismaClient();

async function main() {
    try{
        await db.category.createMany({
            data: [
                {name: "Famous People"},
                {name: "Musicians"},
                {name: "Movies & TV"},
                {name: "Sports"},
                {name: "Scientists"},
                {name: "Philosophy"},     
                {name: "Anime"},     
            ]
        })
    } catch (err){
        console.error("error sending default categories",err);
    } finally {
        await db.$disconnect();
    }
}
main()