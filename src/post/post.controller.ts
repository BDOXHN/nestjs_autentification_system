import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {Response, Request} from 'express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() request: Request) {
    return this.postService.create(createPostDto, request);
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.postService.findAll(request);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: Request) {
    return this.postService.findOne(+id, request);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updatePostDto: UpdatePostDto,
    @Req() request: Request) {
    return this.postService.update(+id, updatePostDto, request);
  }

  @Delete(':id', )
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.postService.remove(+id, request);
  }
}
