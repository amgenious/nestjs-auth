import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
    @ApiProperty({example:'Announcements'})
    @IsString()
    @IsNotEmpty()
    title!: string

    @ApiProperty({example:'Lorem is ipium, hu jie fjodg fopg euo fiod ewio'})
    @IsString()
    @IsOptional()
    message?: string
}