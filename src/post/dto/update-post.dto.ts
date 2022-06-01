import { PartialType } from '@nestjs/mapped-types';
import { Length } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends CreatePostDto{}
