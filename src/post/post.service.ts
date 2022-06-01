import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import {Response, Request} from 'express';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(createPostDto: CreatePostDto, @Req() request: Request) {
    const userInfo = await this.authService.acces(request);
    
    // Имя из дто, которое достали внутри acces из куки реквестом
    const username = userInfo.username; 

    // Создаём пост (энтити) и сохраняем его
    let post = new PostEntity();
    post.text = createPostDto.text;

    const newPost = await this.postRepository.save(post);

    if (!newPost) {
       throw new BadRequestException('Error at post creating');
     }

    // Вытаскиваем пользователя (энтити) по имени
    // Добавляем в энтити пользователя энтити поста (связь один ко многим)
    // Сохраняем пользователя
    const user = await this.userRepository.findOne({ 
      where: { username: username }, relations: ['posts'] });
    user.posts.push(newPost);

    const savedUser = await this.userRepository.save(user);

    if (!savedUser) {
      throw new BadRequestException('Error at user saving');
    }

    return 'Post created';
  }

  async findAll(@Req() request: Request) {
    await this.authService.acces(request);
    return await this.postRepository.find()
  }

  async findOne(id: number, @Req() request: Request) {
    await this.authService.acces(request);
    const findedPost = await this.postRepository.findOneBy({postid: id});
    return findedPost;
  }

  async update(id: number, updatePostDto: UpdatePostDto, @Req() request: Request) {
    await this.authService.acces(request);

    // check that user can update post
    const findedPost = await this.postRepository.findOneBy({postid: id});

    if(!(findedPost)) {
      throw new BadRequestException('Error: post not found');
    }

    const updatedPost = await this.postRepository.update(id, updatePostDto);
    return `Post succesfully updated: #${id}`
  }

  async remove(id: number, @Req() request: Request) {
    const userInfo = await this.authService.acces(request);

    // check that user can update post
    const findedPost = await this.postRepository.findOneBy({postid: id});

    await this.postRepository.delete(id);
    return `Post succesfully removed: #${id}`;
  }
}
