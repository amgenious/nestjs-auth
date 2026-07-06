import { Injectable,  NotFoundException,
  ForbiddenException, } from "@nestjs/common";
import {db} from "src/db"
import {notes} from "src/db/schema"
import {eq, and} from "drizzle-orm"
import type { CreateNoteDto } from "./dto/create-note.dto";

@Injectable()
export class NotesService{
    async findAllNotesForUser(userId:string){
        return db.query.notes.findMany({
            where: eq(notes.userId, userId)
        })
    }

    async create(userId: string, dto: CreateNoteDto){
        const [note]= await db.insert(notes).values({...dto,userId})
        .returning()

        return note
    }

    async update(id: string, userId:string, data: Partial<CreateNoteDto>){
        const note = await db.query.notes.findFirst({
            where:eq(notes.id, id)
        })
        if (!note) throw new NotFoundException('Not not found')
            
        if (note.userId !== userId){
            throw new ForbiddenException('You do not own this task')
        }

        const [updated] = await db
        .update(notes)
        .set({...data, updatedAt:new Date()})
        .where(and(eq(notes.id, id), eq(notes.userId, userId)))
        .returning()

        return updated
    }

    async delete(id: string, userId:string){
        const note = await db.query.notes.findFirst({
            where: eq(notes.id, id)
        })

        if (!note) throw new NotFoundException('Note not found')
        
        if (note.userId !== userId) {
            throw new ForbiddenException('You do not own this note')
        }

        await db.delete(notes).where(eq(notes.id, id))

        return {message: 'Notes Deleted Successfully'}
    }
}