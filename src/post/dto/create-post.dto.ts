import { Length } from "class-validator";

export class CreatePostDto {

    @Length(5, 200)
    text: string;

}
