import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt'
import { PostEntity } from "src/post/entities/post.entity";


@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        nullable: false,
        unique: false
    })
    fullName: string;

    @Column({
        type: 'varchar',
        nullable: false,
        unique: false
    })
    email: string;

    @Column({
        type: 'varchar',
        nullable: false,
        unique: true
    })
    username: string;

    @Column({
        type: 'varchar',
        nullable: false,
        unique: false
    })
    password: string;

    @BeforeInsert()  async hashPassword() {
        this.password = await bcrypt.hash(this.password, 13);
    } 


    @OneToMany(() => PostEntity, (post) => post.author)
    posts: PostEntity[];
}
