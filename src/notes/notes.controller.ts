import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { NotesService } from "./notes.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import type { User } from "src/db/schema";
import { CreateNoteDto } from "./dto/create-note.dto";

@ApiTags('Notes')
@ApiBearerAuth()
@Controller('notes')
export class NotesController{
    constructor(private notesService: NotesService){}

    @Get()
    @ApiOperation({summary: 'Get all notes for current user'})
    findAll(@CurrentUser() user: User){
        return this.notesService.findAllNotesForUser(user.id)
    }

    @Post()
    @ApiOperation({summary: 'Create a new note'})
    create(@CurrentUser() user: User, @Body() dto:CreateNoteDto){
        return this.notesService.create(user.id, dto)
    }

    @Patch(':id')
    @ApiOperation({summary: 'Update a note'})
    update(
        @CurrentUser() user: User,
        @Param('id') id:string,
        @Body() dto: Partial<CreateNoteDto>
    ){
        return this.notesService.update(id, user.id, dto)
    }

    @Delete('id')
    @ApiOperation({summary: 'Delete a note'})
    remove(@CurrentUser() user:User, @Param('id') id:string){
        return this.notesService.delete(id, user.id)
    }
}