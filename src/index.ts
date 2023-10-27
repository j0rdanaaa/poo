import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'
import { TVideos } from './types'
import { Videos } from './models/Videos'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get("/videos", async (req: Request, res: Response) => {
    try {

        const result: TVideos[] = await db('videos')

        const video: Videos[] = result.map((videoDB) => new Videos(
            videoDB.id,
            videoDB.titulo,
            videoDB.duracao,
            videoDB.data_upload
        ))

        res.status(200).send(video)

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/videos", async (req: Request, res: Response) => {
    try {

        const { id, titulo, duracao } = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof titulo !== "string") {
            res.status(400)
            throw new Error("'titulo' deve ser string")
        }

        if (typeof duracao !== "number") {
            res.status(400)
            throw new Error("'duracao' deve ser number")
        }

        const [ videoDbExists ]: TVideos[] | undefined[] = await db('videos').where({id})

        if(videoDbExists){
            res.status(400)
            throw new Error("'id' já existe")
        }

        const video = new Videos (
            id,
            titulo,
            duracao,
            new Date().toISOString()
        )

        const newVideo: TVideos = {
            id: video.getId(),
            titulo: video.getTitulo(),
            duracao: video.getDuracao(),
            data_upload: video.getDataUpload()
        }

        await db('videos').insert(newVideo)
        const [ videoDB ]: TVideos[] = await db('videos').where({ id })

        res.status(200).send({message: "Video cadastrado com sucesso", videoDB})

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.put("/videos/:id", async (req: Request, res: Response) => {
    try {

        const idToEdit = req.params.id

        const newId = req.body.newId as string
        const newTitulo = req.body.newTitulo as string
        const newDuracao = req.body.newDuracao as number

        const [idExists] = await db("videos").where({ id: idToEdit })

        if(!idExists){
            res.status(400)
            throw new Error("'id' não existe")
        }

        if (typeof newId !== "string") {
            res.status(400)
            throw new Error("'newId' deve ser string")
        }

        if (typeof newTitulo !== "string") {
            res.status(400)
            throw new Error("'newTitulo' deve ser string")
        }

        if (typeof newDuracao !== "number") {
            res.status(400)
            throw new Error("'newDuracao' deve ser number")
        }


        const video = new Videos (
            newId,
            newTitulo,
            newDuracao,
            new Date().toISOString()
        )

        const newVideo: TVideos = {
            id: video.getId(),
            titulo: video.getTitulo(),
            duracao: video.getDuracao(),
            data_upload: video.getDataUpload()
        }

        await db('videos').update(newVideo).where({id: idToEdit})

        res.status(200).send({message: "Video atualizado com sucesso", newVideo})

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.delete("/videos/:id", async (req: Request, res: Response) => {
    try {

        const idToDelete = req.params.id

        const [idExists] = await db("videos").where({ id: idToDelete })

        if(!idExists){
            res.status(400)
            throw new Error("'id' não existe")
        }

        await db('videos').delete().where({id: idToDelete})

        res.status(200).send({message: "Video deletado com sucesso"})

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})